import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from '@/modules/users/users.service';
import { ApiResponse } from '@/common/interfaces/api-response.interface';
import { User } from '@/modules/users/schemas/user.schema';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Promise<ApiResponse<User[]>> {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
        return this.usersService.create(createUserDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<ApiResponse<User>> {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string, 
        @Body() updateUserDto: UpdateUserDto
    ): Promise<ApiResponse<User>> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<ApiResponse<void>> {
        return this.usersService.remove(id);
    }

    // Message Pattern Handlers
    @MessagePattern({ cmd: 'create_user' })
    async createUser(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
        return this.usersService.create(createUserDto);
    }

    @MessagePattern({ cmd: 'get_users' })
    async getUsers(): Promise<ApiResponse<User[]>> {
        return this.usersService.findAll();
    }

    @MessagePattern({ cmd: 'get_user' })
    async getUser(data: { id: string }): Promise<ApiResponse<User>> {
        return this.usersService.findOne(data.id);
    }

    @MessagePattern({ cmd: 'update_user' })
    async updateUser(data: { 
        id: string; 
        updateData: UpdateUserDto 
    }): Promise<ApiResponse<User>> {
        return this.usersService.update(data.id, data.updateData);
    }

    @MessagePattern({ cmd: 'delete_user' })
    async deleteUser(data: { id: string }): Promise<ApiResponse<void>> {
        return this.usersService.remove(data.id);
    }
}
