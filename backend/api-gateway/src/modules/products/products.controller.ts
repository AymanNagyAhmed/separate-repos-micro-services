import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards,
    ParseIntPipe,
    ForbiddenException,
    Req,
    UseInterceptors
  } from '@nestjs/common';

  @Controller('products')
  export class ProductsController {
    constructor() {}

    @Get()
    async findAll() {
        return [{id: 1, name: 'Product 1'}, {id: 2, name: 'Product 2'}];
    }

    @Post()
    async create(@Body() createProductDto: { name: string }) {
        return {id: 1, name: 'Product 1'};
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return {id: 1, name: 'Product 1'};
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: { name: string }) {
        return {id: 1, name: 'Product 1'};
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return {id: 1, name: 'Product 1'};
    }


  }
