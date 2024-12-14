import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) {}

    @MessagePattern({ cmd: 'get_all_products' })
    async getAllProducts(): Promise<ApiResponse<Product[]>> {
        return this.productsService.findAll();
    }

    @MessagePattern({ cmd: 'create_product' })
    async createProduct(
        @Payload() createProductDto: CreateProductDto
    ): Promise<ApiResponse<Product>> {
        return this.productsService.create(createProductDto);
    }

    @MessagePattern({ cmd: 'get_product' })
    async getProduct(
        @Payload() data: { id: number }
    ): Promise<ApiResponse<Product>> {
        return this.productsService.findOne(data.id);
    }

    @MessagePattern({ cmd: 'update_product' })
    async updateProduct(
        @Payload() data: { id: number; updateData: UpdateProductDto }
    ): Promise<ApiResponse<Product>> {
        return this.productsService.update(data.id, data.updateData);
    }

    @MessagePattern({ cmd: 'delete_product' })
    async deleteProduct(
        @Payload() data: { id: number }
    ): Promise<ApiResponse<void>> {
        return this.productsService.remove(data.id);
    }
}
