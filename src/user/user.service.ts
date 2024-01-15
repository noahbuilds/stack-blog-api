import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  create = async (createUserDto: CreateUserDto) => {
    return await this.userModel.create(createUserDto);
  };

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  doLogin = async (loginDto: LoginDto): Promise<User> => {
    const foundUser = await this.userModel.findOne({ email: loginDto.email });
    if (!foundUser) {
      throw new HttpException('bad credentials', HttpStatus.UNAUTHORIZED);
    }
    if (foundUser.password === loginDto.password) {
      return foundUser;
    } else {
      throw new HttpException('bad credentials', HttpStatus.UNAUTHORIZED);
    }
  };

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
