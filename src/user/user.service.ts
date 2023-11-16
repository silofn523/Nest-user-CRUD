import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from './entities/user.entity';
import { UpdateUserDto, UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async getAllUser(): Promise<User[]> {
        return await this.userRepository.find()
    }

    async getOneUser(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id })

        if (!user) {  
            throw new NotFoundException(`Can't find user with id ${id}`)
        }
        return user
    }

    async createUser(UserData: UserDto): Promise<void>{
    const { username, password } = UserData // Dto에 있는  username, password  값들을 변수로 가져온다
      const user = this.userRepository.create({ username, password});
      
      await this.userRepository.save(user)
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.delete({ id })
        
        if(user.affected === 0) {
            throw new NotFoundException(`Can't find user with id ${id}`)
        }
    }

    async updateUser(id: number, updateUser: UpdateUserDto) {

        const result = await this.userRepository.update(
            { id },
            updateUser
        )

        if (result.affected) { // ffected 값이 1이면 트루 값 반환 
            return {
              success: true
            }
        } else {
            return {
              success: false // affected 값이 0이면 즉, 업뎃하려는 유저 아이디가 없으면 false값 반환
            }
        }
    }
}
