import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';

describe('UserService', () => {
  let userService: UserService;
  // let userController: UserController;
  let userRepository: Repository<UserEntity>;
  const userRepositoryToken = getRepositoryToken(UserEntity);

  const post = {
    id: 1,
    title: 'post title',
    content: 'post content',
    createdAt: new Date(),
  } as PostEntity;

  const user = {
    id: 1,
    username: 'johnDoe',
    password: 'password',
    email: 'dummy@gmail.com',
    role: 'user',
    createdAt: new Date(),
    posts: [post],
  } as UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: userRepositoryToken,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    // userController = module.get<UserController>(UserController);
    userRepository = module.get<Repository<UserEntity>>(userRepositoryToken);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should be defined', () => {
      expect(userService.getUsers).toBeDefined();
    });
    it('should return an array of users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);
      const users = await userService.getUsers();
      expect(users).toBeInstanceOf(Array);
    });
    it('should return an empty array if there are no users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);
      const users = await userService.getUsers();
      expect(users).toEqual([]);
    });
    it('should return the datas without transformation', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);
      const users = await userService.getUsers();
      expect(users).toEqual([user]);
    });
  });

  describe('getUserById', () => {
    it('should be defined', () => {
      expect(userService.getUserById).toBeDefined();
    });
    it('should return a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const userById = await userService.getUserById(1);
      expect(userById).toEqual(user);
    });
    it('should return null if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      const userById = await userService.getUserById(1);
      expect(userById).toBeNull();
    });
  });
  describe('getUserByUsername', () => {});
  describe('createUser', () => {});
});
