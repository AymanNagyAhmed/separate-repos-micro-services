import { Injectable, NotFoundException, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/modules/products/entities/product.entity';
import { CreateProductDto } from '@/modules/products/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/products/dto/update-product.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { ApiResponseUtil } from '@/common/utils/api-response.util';
import { ApplicationException } from '@/common/exceptions/application.exception';

@Injectable()
export class ProductsService {
    private readonly BASE_PATH = '/products';

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
    ) {}

    async create(createProductDto: CreateProductDto): Promise<ApiResponse<Product>> {
        try {
            const product = this.productsRepository.create(createProductDto);
            const savedProduct = await this.productsRepository.save(product);
            
            return ApiResponseUtil.success(
                savedProduct,
                'Product created successfully',
                this.BASE_PATH,
                HttpStatus.CREATED
            );
        } catch (error) {
            throw new ApplicationException(
                'Failed to create product',
                HttpStatus.BAD_REQUEST,
                this.BASE_PATH
            );
        }
    }

    async findAll(): Promise<ApiResponse<Product[]>> {
        const products = await this.productsRepository.find();
        
        return ApiResponseUtil.success(
            products,
            'Products retrieved successfully',
            this.BASE_PATH
        );
    }

    async findOne(id: number): Promise<ApiResponse<Product>> {
        const product = await this.findProductById(id);
        
        return ApiResponseUtil.success(
            product,
            'Product retrieved successfully',
            `${this.BASE_PATH}/${id}`
        );
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<ApiResponse<Product>> {
        await this.findProductById(id);

        try {
            const product = await this.productsRepository.preload({
                id,
                ...updateProductDto,
            });

            if (!product) {
                throw new ApplicationException(
                    `Product with ID ${id} not found`,
                    HttpStatus.NOT_FOUND,
                    `${this.BASE_PATH}/${id}`
                );
            }

            const updatedProduct = await this.productsRepository.save(product);
            
            return ApiResponseUtil.success(
                updatedProduct,
                'Product updated successfully',
                `${this.BASE_PATH}/${id}`
            );
        } catch (error) {
            if (error instanceof ApplicationException) {
                throw error;
            }
            throw new ApplicationException(
                'Failed to update product',
                HttpStatus.BAD_REQUEST,
                `${this.BASE_PATH}/${id}`
            );
        }
    }

    async remove(id: number): Promise<ApiResponse<void>> {
        const product = await this.findProductById(id);

        try {
            await this.productsRepository.remove(product);
            
            return ApiResponseUtil.success(
                undefined,
                'Product deleted successfully',
                `${this.BASE_PATH}/${id}`
            );
        } catch (error) {
            throw new ApplicationException(
                'Failed to delete product',
                HttpStatus.BAD_REQUEST,
                `${this.BASE_PATH}/${id}`
            );
        }
    }

    private async findProductById(id: number): Promise<Product> {
        try {
            const product = await this.productsRepository.findOne({ 
                where: { id } 
            });
            
            if (!product) {
                throw new ApplicationException(
                    `Product with ID ${id} not found`,
                    HttpStatus.NOT_FOUND,
                    `${this.BASE_PATH}/${id}`
                );
            }
            
            return product;
        } catch (error) {
            if (error instanceof ApplicationException) {
                throw error;
            }
            throw new ApplicationException(
                `Invalid product ID: ${id}`,
                HttpStatus.BAD_REQUEST,
                `${this.BASE_PATH}/${id}`
            );
        }
    }
}
