import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) {}

    @MessagePattern({ cmd: 'get_all_products' })
    async getAllProducts() {
        return this.productsService.findAll();
    }

    @MessagePattern({ cmd: 'create_product' })
    async createProduct(@Payload() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @MessagePattern({ cmd: 'get_product' })
    async getProduct(@Payload() data: { id: number }) {
        return this.productsService.findOne(data.id);
    }

    @MessagePattern({ cmd: 'update_product' })
    async updateProduct(@Payload() data: { id: number, updateData: UpdateProductDto }) {
        return this.productsService.update(data.id, data.updateData);
    }

    @MessagePattern({ cmd: 'delete_product' })
    async deleteProduct(@Payload() data: { id: number }) {
        return this.productsService.remove(data.id);
    }
}
