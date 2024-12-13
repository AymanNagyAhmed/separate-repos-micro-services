import { Body, Controller, Get, Post, HttpStatus, Param, Put, Delete } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductsService } from '@/modules/products/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    findAll(): Promise<ApiResponse<Product[]>> {
        return this.productsService.findAll();
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto): Promise<ApiResponse<Product>> {
        return this.productsService.create(createProductDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<ApiResponse<Product>> {
        return this.productsService.findOne(parseInt(id));
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ApiResponse<Product>> {
        return this.productsService.update(parseInt(id), updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<ApiResponse<void>> {
        return this.productsService.remove(parseInt(id));
    }

    @MessagePattern({ cmd: 'get_products' })
    getProducts(): Promise<ApiResponse<Product[]>> {
        return this.productsService.findAll();
    }

    @MessagePattern({ cmd: 'create_product' })
    createProduct(createProductDto: CreateProductDto): Promise<ApiResponse<Product>> {
        return this.productsService.create(createProductDto);
    }

    

    @MessagePattern({ cmd: 'get_product' })
    getProduct(data: { id: number }): Promise<ApiResponse<Product>> {
        return this.productsService.findOne(data.id);
    }

    @MessagePattern({ cmd: 'update_product' })
    updateProduct(data: { id: number; updateData: UpdateProductDto }): Promise<ApiResponse<Product>> {
        return this.productsService.update(data.id, data.updateData);
    }

    @MessagePattern({ cmd: 'delete_product' })
    deleteProduct(data: { id: number }): Promise<ApiResponse<void>> {
        return this.productsService.remove(data.id);
    }
}
