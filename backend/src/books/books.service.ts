import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CommonService } from 'src/common/common.service';
import BookEntryDto from './dto/BookEntryDto';
import BookDto from './dto/BookDto';
import { existsSync, lstatSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { DataDir } from 'src/constants';
import BookInfoDto from './dto/BookInfoDto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import ExternalChapterDto from './dto/ExternalChapterDto';
import OldBookDto from './dto/OldBookDto';

const logger = new Logger('BooksService');
const getBookInfoConfig = (id: string) => `books/${id}/info.json`;
const booksDir = path.resolve(DataDir, 'books');

@Injectable()
export class BooksService {
  constructor(
    private readonly httpService: HttpService,
    private commonService: CommonService
  ) {}

  getList(): BookEntryDto[] {
    if (!existsSync(booksDir) || !lstatSync(booksDir)?.isDirectory()) return [];

    const books: BookEntryDto[] = [];
    const dirEntries = readdirSync(booksDir);

    for (const id of dirEntries) {
      if (id.startsWith('.')) continue;

      try {
        const { info } = this.get(id);
        books.push({ id, info });
      } catch (e) {
        logger.error(`can't read book ${id}`);
        logger.error(e);
      }
    }
    return books;
  }

  private check_config(config): config is OldBookDto | BookDto {
    if (validateSync(plainToInstance(OldBookDto, config)).length === 0) {
      return true;
    }

    const errors = validateSync(plainToInstance(BookDto, config));
    if (errors.length > 0) {
      for (const error of errors) {
        logger.error(error);
      }
      logger.log(config);
      throw new Error('entry validation failed');
    }

    return true;
  }

  private is_new_config(config): config is BookDto {
    return 'series' in config.info;
  }

  get(id: string): BookDto {
    try {
      const config = this.commonService.readJSONFile(getBookInfoConfig(id));
      if (!this.check_config(config)) {
        throw new InternalServerErrorException('config validation failed');
      }
      if (this.is_new_config(config)) {
        return config;
      }
      const {
        chapters,
        info: { name, author_id, reader_id, series_id, series_number, cover },
      } = config;
      const series = series_id ? [{ id: series_id, number: series_number }] : [];
      return {
        chapters,
        info: {
          name,
          authors: [author_id],
          readers: [reader_id],
          series,
          cover,
        },
      };
    } catch (e) {
      logger.error(e);
      if (e instanceof NotFoundException) {
        throw new NotFoundException(`book ${id} not found`);
      }
      throw new InternalServerErrorException(`can't get book ${id}`);
    }
  }

  create(info: BookInfoDto): string {
    try {
      const id = this.commonService.generateID();
      mkdirSync(path.resolve(booksDir, id));
      const config: BookDto = { info, chapters: [] };
      this.commonService.writeJSONFile(getBookInfoConfig(id), config);
      return id;
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't create book`);
    }
  }

  edit(id: string, book: BookDto) {
    const config = getBookInfoConfig(id);
    if (!existsSync(path.resolve(DataDir, config))) throw new NotFoundException(`book ${id} not found`);

    try {
      this.commonService.writeJSONFile(config, book);
      return true;
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't edit book ${id}`);
    }
  }

  remove(id: string) {
    const bookDir = path.resolve(booksDir, id);
    if (!existsSync(bookDir) || !lstatSync(bookDir)?.isDirectory()) throw new NotFoundException(`book ${id} not found`);
    try {
      rmSync(bookDir, { recursive: true });
      return true;
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't remove book ${id}`);
    }
  }

  uploadChapter(bookId: string, title: string, { originalname, buffer }: Express.Multer.File): true {
    const filename = decodeURI(originalname);
    const config = getBookInfoConfig(bookId);
    if (!existsSync(path.resolve(DataDir, config))) throw new NotFoundException(`book ${bookId} not found`);
    try {
      const { info, chapters } = this.get(bookId);
      if (chapters.find(chapter => chapter.title === title)) {
        throw new UnprocessableEntityException(`chapter ${title} for book ${bookId} is already exists`);
      }
      if (chapters.find(chapter => chapter.filename === filename)) {
        throw new UnprocessableEntityException(`chapter file ${filename} for book ${bookId} is already exists`);
      }
      if (!filename.toLowerCase().endsWith('.mp3')) {
        throw new UnprocessableEntityException(`chapter file ${filename} for book ${bookId} is not mp3`);
      }
      writeFileSync(path.resolve(booksDir, bookId, filename), buffer);
      chapters.push({ title, filename });
      this.commonService.writeJSONFile(config, { info, chapters });
      return true;
    } catch (e) {
      if (e instanceof UnprocessableEntityException) throw e;
      logger.error(e);
      throw new InternalServerErrorException(`can't add chapter ${title} to book ${bookId}`);
    }
  }

  removeCover(bookId: string) {
    const config = getBookInfoConfig(bookId);
    const bookDir = path.resolve(booksDir, bookId);
    if (!existsSync(path.resolve(DataDir, config))) throw new NotFoundException(`book ${bookId} not found`);
    try {
      const { info, chapters } = this.get(bookId);
      if (info.cover) {
        const { filename } = info.cover;
        const coverFile = path.resolve(bookDir, filename);
        if (existsSync(coverFile)) {
          rmSync(coverFile);
        }
        delete info.cover;
      }
      this.commonService.writeJSONFile(config, { info, chapters });
      return true;
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't remove book ${bookId} cover`);
    }
  }

  uploadCover(
    bookId: string,
    { originalname, mimetype, buffer }: Pick<Express.Multer.File, 'buffer' | 'mimetype' | 'originalname'>
  ): true {
    const config = getBookInfoConfig(bookId);
    const bookDir = path.resolve(booksDir, bookId);
    if (!existsSync(path.resolve(DataDir, config))) throw new NotFoundException(`book ${bookId} not found`);
    try {
      const { info, chapters } = this.get(bookId);
      if (info.cover) {
        this.removeCover(bookId);
      }
      const extension = originalname.split('.').pop().toLowerCase();
      const filename = `${this.commonService.generateID()}.${extension}`;
      writeFileSync(path.resolve(bookDir, filename), buffer);
      info.cover = { type: mimetype, filename };
      this.commonService.writeJSONFile(config, { info, chapters });
      return true;
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't add cover to book ${bookId}`);
    }
  }

  extractCover(bookId: string): true {
    const bookDir = path.resolve(booksDir, bookId);
    try {
      const { chapters } = this.get(bookId);
      for (const { filename } of chapters) {
        const cover = this.commonService.extractImageFromID3tag(path.resolve(bookDir, filename));
        if (cover) {
          this.uploadCover(bookId, cover);
          return true;
        }
      }
      throw new NotAcceptableException(`No covers found for book ${bookId}`);
    } catch (e) {
      logger.error(e);
      throw new InternalServerErrorException(`can't extract book ${bookId} cover`);
    }
  }

  private getPlaylist(data: string) {
    try {
      const result = /file:(\[[^\]]+\])/.exec(data);
      if (!result) return;

      const playlist = JSON.parse(result[1]);
      if (!Array.isArray(playlist)) return;

      for (const item of playlist) {
        if (
          !item ||
          typeof item !== 'object' ||
          !(
            'title' in item &&
            'file' in item &&
            item.title &&
            item.file &&
            typeof item.title === 'string' &&
            typeof item.file === 'string'
          )
        ) {
          return;
        }
      }
      return playlist.map(({ title, file }) => ({ title, url: file }));
    } catch {}
  }

  async getChaptersFromUrl(url: string): Promise<ExternalChapterDto[]> {
    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      const result = this.getPlaylist(data);
      if (!result) {
        throw new NotAcceptableException(`url ${url} is not supported`);
      }
      return result;
    } catch (e) {
      logger.error(e);
      throw new NotAcceptableException(`url ${url} is not supported`);
    }
  }

  async downloadExternalChapter(bookId: string, { title, url }: ExternalChapterDto): Promise<true> {
    const config = getBookInfoConfig(bookId);
    if (!existsSync(path.resolve(DataDir, config))) throw new NotFoundException(`book ${bookId} not found`);
    try {
      const { info, chapters } = this.get(bookId);
      if (chapters.find(chapter => chapter.title === title)) {
        throw new UnprocessableEntityException(`chapter ${title} for book ${bookId} is already exists`);
      }
      const filename = `${title}.mp3`;
      if (chapters.find(chapter => chapter.filename === filename)) {
        throw new UnprocessableEntityException(`chapter file ${filename} for book ${bookId} is already exists`);
      }
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          responseType: 'arraybuffer',
        })
      );
      writeFileSync(path.resolve(booksDir, bookId, filename), data, 'binary');
      chapters.push({ title, filename });
      this.commonService.writeJSONFile(config, { info, chapters });
      return true;
    } catch (e) {
      if (e instanceof UnprocessableEntityException) throw e;
      logger.error(e);
      throw new InternalServerErrorException(`can't add chapter ${title} to book ${bookId}`);
    }
  }
}
