import { Injectable, NotFoundException, BadRequestException, HttpStatus } from '@nestjs/common';
import { User, UserDocument } from '@/modules/users/schemas/user.schema';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { ApiResponseUtil } from '@/common/utils/api-response.util';
import { EMAIL_REGEX } from '@/common/constants/validation.constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApplicationException } from '@/common/exceptions/application.exception';

@Injectable()
export class UsersService {
    private readonly BASE_PATH = '/users';

    constructor(
        @InjectModel(User.name)
        private readonly usersModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
        try {
            if (!this.validateEmail(createUserDto.email)) {
                throw new ApplicationException('Invalid email format', HttpStatus.BAD_REQUEST, this.BASE_PATH);
            }

            // Check if email already exists
            const existingUser = await this.usersModel.findOne({ email: createUserDto.email });
            if (existingUser) {
                throw new ApplicationException('Email already exists', HttpStatus.BAD_REQUEST, this.BASE_PATH);
            }

            const newUser = new this.usersModel(createUserDto);
            const savedUser = await newUser.save();
            
            return ApiResponseUtil.success(
                savedUser,
                'User created successfully',
                this.BASE_PATH,
                HttpStatus.CREATED
            );
        } catch (error) {
            if (error instanceof ApplicationException) {
                throw error;
            }
            
            if (error.name === 'ValidationError') {
                throw new ApplicationException(error.message, HttpStatus.BAD_REQUEST, this.BASE_PATH);
            }

            if (error.code === 11000) { // MongoDB duplicate key error
                throw new ApplicationException('Email already exists', HttpStatus.BAD_REQUEST, this.BASE_PATH);
            }

            throw new ApplicationException('Failed to create user', HttpStatus.BAD_REQUEST, this.BASE_PATH);
        }
    }

    async findAll(): Promise<ApiResponse<User[]>> {
        const users = await this.usersModel.find().exec();
        
        return ApiResponseUtil.success(
            users,
            'Users retrieved successfully',
            this.BASE_PATH
        );
    }

    async findOne(id: string): Promise<ApiResponse<User>> {
        const user = await this.findUserById(id);
        
        return ApiResponseUtil.success(
            user,
            'User retrieved successfully',
            `${this.BASE_PATH}/${id}`
        );
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<ApiResponse<User>> {
        await this.findUserById(id);

        try {
            if (!this.validateEmail(updateUserDto.email)) {
                throw new BadRequestException('Invalid email format');
            }
            const updatedUser = await this.usersModel.findByIdAndUpdate(
                id,
                { $set: updateUserDto },
                { new: true, runValidators: true }
            );
            
            return ApiResponseUtil.success(
                updatedUser,
                'User updated successfully',
                `${this.BASE_PATH}/${id}`
            );
        } catch (error) {
            throw new BadRequestException('Failed to update user');
        }
    }

    async remove(id: string): Promise<ApiResponse<void>> {
        await this.findUserById(id);

        try {
            await this.usersModel.findByIdAndDelete(id);
            
            return ApiResponseUtil.success(
                undefined,
                'User deleted successfully',
                `${this.BASE_PATH}/${id}`
            );
        } catch (error) {
            throw new BadRequestException('Failed to delete user');
        }
    }

    private async findUserById(id: string): Promise<UserDocument> {
        try {
            const user = await this.usersModel.findById(id).exec();
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Invalid user ID: ${id}`);
        }
    }

    private validateEmail(email: string): boolean {
        // Basic validation
        if (!email || !EMAIL_REGEX.test(email)) {
            return false;
        }

        // Additional validations you might want:
        const [localPart, domain] = email.split('@');

        // Check length constraints
        if (localPart.length > 64 || domain.length > 255) {
            return false;
        }

        // Check for consecutive dots
        if (email.includes('..')) {
            return false;
        }

        // Check for valid TLD (assumes TLD should be at least 2 chars)
        const tld = domain.split('.').pop();
        if (!tld || tld.length < 2) {
            return false;
        }

        return true;
    }
}
