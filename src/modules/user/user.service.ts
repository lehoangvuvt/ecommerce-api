import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import User from 'src/entities/user.entity'
import { Repository, EntityManager } from 'typeorm'

@Injectable()
export class UserService {
  constructor(@InjectEntityManager() private readonly entityManager: EntityManager, @InjectRepository(User) private userRepository: Repository<User>) {}

  async getAll(): Promise<Array<User>> {
    const result = await this.entityManager.query(`SELECT * FROM public."user"`)
    return result
  }

  async insert(username: string, password: string): Promise<User> {
    const checkExisted = await this.userRepository.findOne({ where: { username } })
    if(checkExisted) return null
    const userRepository = this.userRepository.create({
      username,
      password,
    })
    const result = await userRepository.save()
    return result
  }
}
