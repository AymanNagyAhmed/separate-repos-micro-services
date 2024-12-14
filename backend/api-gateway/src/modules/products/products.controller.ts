import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Logger } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    @Inject('PRODUCTS_MS') private readonly productsClient: ClientProxy,
  ) {}

  @Get()
  async getAllProducts() {
    this.logger.log('Received request to get all products');
    try {
      const response = await firstValueFrom(
        this.productsClient.send({ cmd: 'get_all_products' }, {})
      );
      this.logger.log('Received response from products microservice');
      return response;
    } catch (error) {
      this.logger.error('Error getting products:', error);
      throw error;
    }
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return firstValueFrom(
      this.productsClient.send({ cmd: 'create_product' }, createProductDto)
    );
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return firstValueFrom(
      this.productsClient.send({ cmd: 'get_product' }, { id: parseInt(id) })
    );
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return firstValueFrom(
      this.productsClient.send(
        { cmd: 'update_product' },
        { id: parseInt(id), updateData: updateProductDto }
      )
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return firstValueFrom(
      this.productsClient.send(
        { cmd: 'delete_product' },
        { id: parseInt(id) }
      )
    );
  }
}
