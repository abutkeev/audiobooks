import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly old_password: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly new_password: string;
}
