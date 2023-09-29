import {
  Injectable,
  InternalServerErrorException,
  Logger,
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

const logger = new Logger('BooksService');
const getBookInfoConfig = (id: string) => `books/${id}/info.json`;
const booksDir = path.resolve(DataDir, 'books');

@Injectable()
export class BooksService {
  constructor(private commonService: CommonService) {}

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

  get(id: string): BookDto {
    try {
      const result = this.commonService.readJSONFile(getBookInfoConfig(id));
      const errors = validateSync(plainToInstance(BookDto, result));
      if (errors.length > 0) {
        for (const error of errors) {
          logger.error(error);
        }
        logger.log(result);
        throw new Error('entry validation failed');
      }
      return result as BookDto;
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
}
