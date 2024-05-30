// import { UserService } from 'src/routes/user/user.service';
// import * as bcrypt from 'bcrypt';
// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from '../user.controller';
// import { DeleteResult, Repository, UpdateResult } from 'typeorm';
// import { UserEntity } from 'src/entities/user.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { user, users } from './test-data/test-data';

// describe('UserService', () => {
//   let userService: UserService;
//   let userRepository: Repository<UserEntity>;
//   const userRepositoryToken = getRepositoryToken(UserEntity);

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         UserService,
//         {
//           provide: userRepositoryToken,
//           useValue: {
//             create: jest.fn(),
//             save: jest.fn(),
//             find: jest.fn(),
//             findOne: jest.fn(),
//             update: jest.fn(),
//             delete: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     userService = module.get<UserService>(UserService);
//     userRepository = module.get<Repository<UserEntity>>(userRepositoryToken);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('UserService', () => {
//     it('should be defined', () => {
//       expect(userService).toBeDefined();
//     });

//     describe('createUser', () => {
//       it('should be defined', () => {
//         expect(userService.createUser).toBeDefined();
//       });
//       it('should call userRepository.save()', async () => {
//         const spyFn = jest.spyOn(userRepository, 'save');
//         await userService.createUser({
//           username: 'user123',
//           password: 'LemonLime12344231!!',
//           email: 'test@nestjs.com',
//         });
//         expect(spyFn).toHaveBeenCalled();
//         expect(spyFn).toHaveBeenCalledTimes(1);
//       });

//       it('should hash the password', async () => {
//         const spyFn = jest.spyOn(userRepository, 'save');
//         const spyHash = jest.spyOn(bcrypt, 'hash');
//         const hashedPassword = 'hashedPassword';
//         spyHash.mockResolvedValue(hashedPassword);
//         const password = 'LemonLime12344231!!';
//         await userService.createUser({
//           username: 'user123',
//           password: password,
//           email: 'test@nestjs.com',
//         });
//         expect(spyFn).toHaveBeenCalledWith({
//           username: 'user123',
//           password: hashedPassword,
//           email: 'test@nestjs.com',
//         });
//       });
//       it('should return a user on success', async () => {
//         userRepository.save = jest.fn().mockReturnValue(user);
//         const result = await userService.createUser({
//           username: 'user123',
//           password: 'liMOnLime12344231!!',
//           email: 'test@nestjs.com',
//         });
//         expect(result).toEqual(user);
//       });
//       it('should return an error message if user with same username exists', async () => {
//         userService.getUserByUsername = jest.fn().mockReturnValue(user);
//         userService.getUserByEmail = jest.fn().mockReturnValue(null);
//         const result = await userService.createUser({
//           username: 'user123',
//           password: 'liMOnLime12344231!!',
//           email: 'test@nestjs.com',
//         });
//         expect(result).toEqual({
//           error: 'User with same username already exists',
//           message: 'User with same username already exists',
//         });
//       });
//       it('should return an error message if user with same email exists', async () => {
//         userService.getUserByUsername = jest.fn().mockReturnValue(null);
//         userService.getUserByEmail = jest.fn().mockReturnValue(user);
//         const result = await userService.createUser({
//           username: 'user123',
//           password: 'liMOnLime12344231!!',
//           email: 'test@nestjs.com',
//         });
//         expect(result).toEqual({
//           error: 'User with same email already exists',
//           message: 'User with same email already exists',
//         });
//       });
//     });
//     describe('getUser', () => {
//       describe('getUsers', () => {
//         it('should be defined', () => {
//           expect(userService.getUsers).toBeDefined();
//         });
//         it('should call userRepository.find()', async () => {
//           const spyFn = jest.spyOn(userRepository, 'find');
//           await userService.getUsers();
//           expect(spyFn).toHaveBeenCalled();
//           expect(spyFn).toHaveBeenCalledTimes(1);
//         });
//         it('should return an array of users', async () => {
//           userRepository.find = jest.fn().mockReturnValue(users);
//           const result = await userService.getUsers();
//           expect(result).toEqual(users);
//         });
//         it('should return an empty array if no users are found', async () => {
//           userRepository.find = jest.fn().mockReturnValue([]);
//           const result = await userService.getUsers();
//           expect(result).toEqual([]);
//         });
//         it('should return an reject Promise on an error', async () => {
//           userRepository.find = jest.fn().mockRejectedValue('error');
//           await expect(userService.getUsers()).rejects.toEqual('error');
//         });
//       });
//       describe('getUserById', () => {
//         it('should be defined', () => {
//           expect(userService.getUserById).toBeDefined();
//         });
//         it('should call userRepository.findOne()', async () => {
//           const spyFn = jest.spyOn(userRepository, 'findOne');
//           await userService.getUserById(1);
//           expect(spyFn).toHaveBeenCalled();
//           expect(spyFn).toHaveBeenCalledTimes(1);
//         });
//         it('should return a user on success', async () => {
//           userRepository.findOne = jest.fn().mockReturnValue(user);
//           const result = await userService.getUserById(1);
//           expect(result).toEqual(user);
//         });
//         it('should return an error message if user is not found', async () => {
//           userRepository.findOne = jest.fn().mockReturnValue(null);
//           const result = await userService.getUserById(1);
//           expect(result).toEqual(null);
//         });
//       });
//       describe('getUserByUsername', () => {
//         it('should be defined', () => {
//           expect(userService.getUserByUsername).toBeDefined();
//         });
//         it('should call userRepository.findOne()', async () => {
//           const spyFn = jest.spyOn(userRepository, 'findOne');
//           await userService.getUserByUsername('johnDoe');
//           expect(spyFn).toHaveBeenCalled();
//           expect(spyFn).toHaveBeenCalledTimes(1);
//         });
//         it('should return a user on success', async () => {
//           userRepository.findOne = jest.fn().mockReturnValue(user);
//           const result = await userService.getUserByUsername('johnDoe');
//           expect(result).toEqual(user);
//         });
//         it('should return an error message if user is not found', async () => {
//           userRepository.findOne = jest.fn().mockReturnValue(null);
//           const result = await userService.getUserByUsername('johnDoe');
//           expect(result).toEqual(null);
//         });
//       });
//       describe('getUserByEmail', () => {
//         it('should be defined', () => {
//           expect(userService.getUserByEmail).toBeDefined();
//         });
//         it('should call userRepository.findOne()', async () => {
//           const spyFn = jest.spyOn(userRepository, 'findOne');
//           await userService.getUserByEmail('test@nestjs.com');
//           expect(spyFn).toHaveBeenCalled();
//           expect(spyFn).toHaveBeenCalledTimes(1);
//         });
//         it('should return a user on success', async () => {
//           userRepository.findOne = jest.fn().mockReturnValue(user);
//           const result = await userService.getUserByEmail('test@nestjs.com');
//           expect(result).toEqual(user);
//         });
//         it('should return an error message if user is not found', async () => {
//           userRepository.findOne = jest.fn().mockReturnValue(null);
//           const result = await userService.getUserByEmail('test@nestjs.com');
//           expect(result).toEqual(null);
//         });
//       });
//     });
//     describe('updateUser', () => {
//       it('should be defined', () => {
//         expect(userService.createUser).toBeDefined();
//       });
//       it('should call userRepository.update()', async () => {
//         const spyFn = jest.spyOn(userRepository, 'update');
//         await userService.updateUser({
//           id: 1,
//           profilePicture: 'profilePicture',
//           coverPicture: 'coverPicture',
//         });
//         expect(spyFn).toHaveBeenCalled();
//         expect(spyFn).toHaveBeenCalledTimes(1);
//       });
//       it('should return a UpdateResult on success', async () => {
//         const dummy = new UpdateResult();
//         userRepository.update = jest.fn().mockReturnValue(dummy);
//         const result = await userService.updateUser({
//           id: 1,
//           profilePicture: 'profilePicture',
//           coverPicture: 'coverPicture',
//         });
//         expect(result).toEqual(dummy);
//       });
//     });
//     describe('deleteUser', () => {
//       it('should be defined', () => {
//         expect(userService.createUser).toBeDefined();
//       });
//       it('should call userRepository.delete()', async () => {
//         const spyFn = jest.spyOn(userRepository, 'delete');
//         await userService.deleteUser({ id: 1 });
//         expect(spyFn).toHaveBeenCalled();
//         expect(spyFn).toHaveBeenCalledTimes(1);
//       });
//       it('should return a success message on success', async () => {
//         const dummy = new DeleteResult();
//         userRepository.delete = jest.fn().mockReturnValue(dummy);
//         const result = await userService.deleteUser({ id: 1 });
//         expect(result).toEqual(dummy);
//       });
//     });
//     describe('friendRequest', () => {
//       it('should be defined', () => {
//         expect(userService.createUser).toBeDefined();
//       });
//       it('should return not implemented message', async () => {
//         const result = await userService.friendRequest({ id: 1 }, 2);
//         expect(result).toEqual({
//           error: 'Not implemented',
//           message: 'Not implemented',
//         });
//       });
//     });
//   });
// });
