import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Inject,
} from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
    constructor(@Inject('USERS_MS') private readonly usersClient: ClientProxy) {}

    @EventPattern('get_all_users')
    async getAllUsers(data: any) {
        console.log('getAllUsers', data);
    }

    @Post()
    async create(@Body() createUserDto: { name: string }) {
        return firstValueFrom(
            this.usersClient.send({ cmd: 'create_user' }, createUserDto)
        );
    }

    @Get()
    async findAll() {
        return firstValueFrom(
            this.usersClient.send({ cmd: 'get_users' }, {})
        );
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return firstValueFrom(
            this.usersClient.send({ cmd: 'get_user' }, { id })
        );
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: { name: string }
    ) {
        return firstValueFrom(
            this.usersClient.send({ cmd: 'update_user' }, { id, ...updateUserDto })
        );
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return firstValueFrom(
            this.usersClient.send({ cmd: 'delete_user' }, { id })
        );
    }
}
