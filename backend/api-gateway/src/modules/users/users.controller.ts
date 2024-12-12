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

@Controller('users')
export class UsersController {
    constructor() { }

    @Post()
    async create(@Body() createUserDto: { name: string }) {
        return { id: 1, name: 'John Doe' };
    }

    @Get()
    async findAll() {
        return [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return { id: 1, name: 'John Doe' };
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: { name: string },
    ) {
        return { id: 1, name: 'John Doe' };
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return { id: 1, name: 'John Doe' };
    }

    private checkUserAccess(user: any, targetUserId: number): void {
        if (user.id !== targetUserId) {
            throw new ForbiddenException('You can only modify your own profile');
        }
    }
}
