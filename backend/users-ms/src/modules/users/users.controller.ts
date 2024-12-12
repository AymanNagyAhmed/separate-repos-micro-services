import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, ClientProxy, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { firstValueFrom } from 'rxjs';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('PRODUCTS_MS') private productsClient: ClientProxy,
    @Inject('SHARED_DATA_MS') private sharedDataClient: ClientProxy,
  ) {}

  @MessagePattern('get_user_details')
  async getUserDetails(userId: string) {
    try {
      // Fetch data from shared data microservice
      const sharedData = await firstValueFrom(this.sharedDataClient.send('get_shared_data', userId));
      
      // Send data to products microservice
      await firstValueFrom(this.productsClient.emit('user_data_processed', sharedData));
      
      return sharedData;
    } catch (error) {
      // Handle microservice communication errors
      throw new Error(`Failed to fetch user details: ${error.message}`);
    }
  }

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('updateUser')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}
