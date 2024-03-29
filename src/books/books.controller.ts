import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { ModifiedRequest } from 'src/users/m';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { BookShowDto } from './dto/book.show';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Serialize(BookShowDto)
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createBookDto: CreateBookDto,
    @Req() req: ModifiedRequest,
  ) {
    const data = await this.booksService.create(createBookDto, req);
    return {
      message: 'Book created',
      data,
    };
  }
  // @UseGuards(AuthGuard)
  @Post('/subcategory')
  createSubcategory(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.booksService.createSubcategory(createSubcategoryDto);
  }

  @Get('/subcategory')
  grtAllSubcategory() {
    return this.booksService.findAllSubcategory();
  }

  //book
  @Serialize(BookShowDto)
  @Get()
  async findAll() {
    const all = await this.booksService.findAll();
    return { message: 'fetched all', count: '12', data: all };
  }

  @Serialize(BookShowDto)
  @Get('/my')
  findAllMy(@Req() req: ModifiedRequest) {
    return this.booksService.findAllMy(req);
  }

  @Serialize(BookShowDto)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (isNaN(+id)) throw new BadRequestException('Invalid id');
    const result = await this.booksService.findOne(+id);
    return { message: 'fetched aby id', count: '12', data: result };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @Serialize(BookShowDto)
  update(
    @Param('id') id: string,
    @Req() req: ModifiedRequest,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return {
      message: 'updated',
      data: this.booksService.update(+id, req, updateBookDto),
    };
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: ModifiedRequest) {
    return this.booksService.remove(+id, req);
  }
}
