import { Injectable, NotFoundException, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/modules/products/entities/product.entity';
import { CreateProductDto } from '@/modules/products/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/products/dto/update-product.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
    ) {}

    async create(createProductDto: CreateProductDto): Promise<ApiResponse<Product>> {
        try {
            const product = this.productsRepository.create(createProductDto);
            const savedProduct = await this.productsRepository.save(product);
            
            return {
                success: true,
                statusCode: HttpStatus.CREATED,
                message: 'Product created successfully',
                path: '/products',
                timestamp: new Date().toISOString(),
                data: savedProduct
            };
        } catch (error) {
            throw new BadRequestException('Failed to create product');
        }
    }

    async findAll(): Promise<ApiResponse<Product[]>> {
        const products = await this.productsRepository.find();
        
        return {
            success: true,
            statusCode: HttpStatus.OK,
            message: 'Products retrieved successfully',
            path: '/products',
            timestamp: new Date().toISOString(),
            data: products
        };
    }

    async findOne(id: number): Promise<ApiResponse<Product>> {
        const product = await this.findProductById(id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return {
            success: true,
            statusCode: HttpStatus.OK,
            message: 'Product retrieved successfully',
            path: `/products/${id}`,
            timestamp: new Date().toISOString(),
            data: product
        };
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<ApiResponse<Product>> {
        const product = await this.findProductById(id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        try {
            Object.assign(product, updateProductDto);
            const updatedProduct = await this.productsRepository.save(product);
            
            return {
                success: true,
                statusCode: HttpStatus.OK,
                message: 'Product updated successfully',
                path: `/products/${id}`,
                timestamp: new Date().toISOString(),
                data: updatedProduct
            };
        } catch (error) {
            throw new BadRequestException('Failed to update product');
        }
    }

    async remove(id: number): Promise<ApiResponse<void>> {
        const product = await this.findProductById(id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        try {
            await this.productsRepository.remove(product);
            
            return {
                success: true,
                statusCode: HttpStatus.OK,
                message: 'Product deleted successfully',
                path: `/products/${id}`,
                timestamp: new Date().toISOString(),
                data: undefined
            };
        } catch (error) {
            throw new BadRequestException('Failed to delete product');
        }
    }

    private async findProductById(id: number): Promise<Product> {
        try {
            return await this.productsRepository.findOne({ 
                where: { id } 
            });
        } catch (error) {
            throw new BadRequestException(`Invalid product ID: ${id}`);
        }
    }
}
