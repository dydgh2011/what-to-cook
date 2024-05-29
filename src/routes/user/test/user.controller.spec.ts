// import { UserService } from 'src/routes/user/user.service';
// import { Test } from '@nestjs/testing';
// import { UserController } from '../user.controller';
// import {
//   createUserTestData,
//   updateUserTestData,
//   userInfo,
// } from './test-data/test-data';
// import { DeleteResult, UpdateResult } from 'typeorm';

// describe('UserController', () => {
//   let userController: UserController;
//   let userService: UserService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         {
//           provide: UserService,
//           useValue: {
//             //Create
//             createUser: jest.fn(),
//             //Read
//             getUserById: jest.fn(),
//             getUserByUsername: jest.fn(),
//             getUserByEmail: jest.fn(),
//             //Update
//             updateUser: jest.fn(),
//             //Delete
//             deleteUser: jest.fn(),
//             //Friend Request
//             friendRequest: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     userController = moduleRef.get<UserController>(UserController);
//     userService = moduleRef.get<UserService>(UserService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(userController).toBeDefined();
//   });

//   describe('Create User', () => {
//     it('should be defined', () => {
//       expect(userController.createUser).toBeDefined();
//     });
//     it('should call userService.createUser()', async () => {
//       const spyFn = jest.spyOn(userService, 'createUser');
//       await userController.createUser(createUserTestData);
//       expect(spyFn).toHaveBeenCalledTimes(1);
//       expect(spyFn).toHaveBeenCalledWith(createUserTestData);
//     });
//     it('should return a user on success', async () => {
//       userService.createUser = jest.fn().mockReturnValue(createUserTestData);
//       const result = await userController.createUser(createUserTestData);
//       expect(result).toEqual(createUserTestData);
//     });
//     it('should return an error message if user already exists', async () => {
//       userService.createUser = jest.fn().mockReturnValue({
//         error: 'User already exists',
//         message: 'User with username of MarkNam already exist',
//       });
//       const result = await userController.createUser(createUserTestData);
//       expect(result).toEqual({
//         error: 'User already exists',
//         message: 'User with username of MarkNam already exist',
//       });
//     });
//   });

//   describe('Read User', () => {
//     it('should be defined', () => {
//       expect(userController.getUser).toBeDefined();
//     });
//     it('should call userService.getUserById() if method is "id"', async () => {
//       const spyFn = jest.spyOn(userService, 'getUserById');
//       await userController.getUser({
//         method: 'id',
//         value: '1',
//       });
//       expect(spyFn).toHaveBeenCalledTimes(1);
//     });
//     it('should return error message if id is not a number', async () => {
//       const result = await userController.getUser({
//         method: 'id',
//         value: 'invalid',
//       });
//       expect(result).toEqual({
//         error: 'wrong input',
//         message: 'ID must be number',
//       });
//     });
//     it('should call userService.getUserByUsername() if method is "username"', async () => {
//       const spyFn = jest.spyOn(userService, 'getUserByUsername');
//       await userController.getUser({
//         method: 'username',
//         value: 'JohnDoe',
//       });
//       expect(spyFn).toHaveBeenCalledTimes(1);
//     });
//     it('should call userService.getUserByEmail() if method is "email"', async () => {
//       const spyFn = jest.spyOn(userService, 'getUserByEmail');
//       await userController.getUser({
//         method: 'email',
//         value: 'test@nestjs.com',
//       });
//       expect(spyFn).toHaveBeenCalledTimes(1);
//     });
//     it('should return a user on success', async () => {
//       userService.getUserById = jest.fn().mockReturnValue(userInfo);
//       const result = await userController.getUser({
//         method: 'id',
//         value: '1',
//       });
//       expect(result).toEqual(userInfo);
//     });
//     it('should return an error message if user does not exist', async () => {
//       userService.getUserById = jest.fn().mockReturnValue(null);
//       const result = await userController.getUser({
//         method: 'id',
//         value: '1',
//       });
//       expect(result).toEqual({
//         error: 'User not found',
//         message: 'User not found',
//       });
//     });
//   });

//   describe('Update User', () => {
//     it('should be defined', () => {
//       expect(userController.updateUser).toBeDefined();
//     });
//     it('should call userService.updateUser()', async () => {
//       const dummy = new UpdateResult();
//       dummy.affected = 1;
//       const spyFn = jest
//         .spyOn(userService, 'updateUser')
//         .mockResolvedValue(dummy);
//       await userController.updateUser(updateUserTestData);
//       expect(spyFn).toHaveBeenCalledTimes(1);
//       expect(spyFn).toHaveBeenCalledWith(updateUserTestData);
//     });
//     it('should return a success message on success', async () => {
//       const dummy = new UpdateResult();
//       dummy.affected = 1;
//       userService.updateUser = jest.fn().mockResolvedValue(dummy);
//       const result = await userController.updateUser(updateUserTestData);
//       expect(result).toEqual({ message: 'User updated successfully' });
//     });
//     it('should return an error message if user does not exist', async () => {
//       const dummy = new UpdateResult();
//       dummy.affected = 0;
//       userService.updateUser = jest.fn().mockResolvedValue(dummy);
//       const result = await userController.updateUser(updateUserTestData);
//       expect(result).toEqual({
//         error: 'User not found',
//         message: 'User not found',
//       });
//     });
//   });

//   describe('Delete User', () => {
//     it('should be defined', () => {
//       expect(userController.deleteUser).toBeDefined();
//     });
//     it('should call userService.deleteUser()', async () => {
//       const dummy = new DeleteResult();
//       dummy.affected = 1;
//       const spyFn = jest
//         .spyOn(userService, 'deleteUser')
//         .mockResolvedValue(dummy);
//       await userController.deleteUser({ id: 1 });
//       expect(spyFn).toHaveBeenCalledTimes(1);
//     });
//     it('should return a user on success', async () => {
//       const dummy = new DeleteResult();
//       dummy.affected = 1;
//       userService.deleteUser = jest.fn().mockResolvedValue(dummy);
//       const result = await userController.deleteUser({ id: 1 });
//       expect(result).toEqual({ message: 'User deleted successfully' });
//     });
//     it('should return an error message if user does not exist', async () => {
//       const dummy = new DeleteResult();
//       dummy.affected = 0;
//       userService.deleteUser = jest.fn().mockResolvedValue(dummy);
//       const result = await userController.deleteUser({ id: 1 });
//       expect(result).toEqual({
//         error: 'User not found',
//         message: 'User not found',
//       });
//     });
//   });

//   describe('Friend Request', () => {
//     it('should be defined', () => {
//       expect(userController.friendRequest).toBeDefined();
//     });
//     it('should call userService.friendRequest()', async () => {
//       const spyFn = jest.spyOn(userService, 'friendRequest');
//       await userController.friendRequest(
//         1,
//         new Request('http://localhost/user/friend-request/1'),
//       );
//       expect(spyFn).toHaveBeenCalledTimes(1);
//     });
//     it('should return a success message on success', async () => {
//       userService.friendRequest = jest
//         .fn()
//         .mockReturnValue({ message: 'Friend request sent' });
//       const result = await userController.friendRequest(
//         1,
//         new Request('http://localhost/user/friend-request/1'),
//       );
//       expect(result).toEqual({ message: 'Friend request sent' });
//     });
//     it('should return an error message if user does not exist', async () => {
//       userService.friendRequest = jest.fn().mockReturnValue({
//         error: 'user not found',
//         message: 'Friend request sent',
//       });
//       const result = await userController.friendRequest(
//         1,
//         new Request('http://localhost/user/friend-request/1'),
//       );
//       expect(result).toEqual({
//         error: 'user not found',
//         message: 'Friend request sent',
//       });
//     });
//   });
// });
