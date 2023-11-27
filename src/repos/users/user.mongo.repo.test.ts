import { User, UserLogin } from '../../entities/user.model.js';
import { Auth } from '../../services/auth.js';
import { HttpError } from '../../types/http.error.js';
import { UsersMongoRepo } from './user.mongo.repo.js';
import { UserModel } from './users.mongo.model.js';
jest.mock('./users.mongo.model');

describe('Given UserMongoRepo class', () => {
  let repo: UsersMongoRepo;
  const exec = jest.fn().mockResolvedValue('name');

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      repo = new UsersMongoRepo();
      UserModel.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockReturnValue({ exec }) });
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      UserModel.create = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockReturnValue({ exec }) });
    });

    test('should return a user object when a valid id is passed', async () => {
      const repo = new UsersMongoRepo();
      const id = 'validId';
      const user = {
        id: 'validId',
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [],
        probada: [],
      };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });

      const result = await repo.getById(id);

      expect(UserModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
    test('should return an array of users when there are users in the database', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John',
          surname: 'Doe',
          age: 25,
          userName: 'johndoe',
          visitado: [],
          probada: [],
        },
        {
          id: '2',
          name: 'Jane',
          surname: 'Smith',
          age: 30,
          userName: 'janesmith',
          visitado: [],
          probada: [],
        },
      ];
      UserModel.find = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUsers) });

      const repo = new UsersMongoRepo();
      const result = await repo.getAll();

      expect(result).toEqual(mockUsers);
      expect(UserModel.find).toHaveBeenCalledTimes(1);
    });
    test('should return a user object when valid credentials are provided', async () => {
      const loginUser: UserLogin = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user: User = {
        id: 'validId',
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [],
        probada: [],
        email: 'test@example.com',
        password: 'hashedPassword',
        avatar: {
          publicId: '',
          with: 0,
          height: 0,
          format: '',
          url: '',
        },
      };
      UserModel.findOne = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      Auth.compare = jest.fn().mockResolvedValue(true);
      const result = await repo.login(loginUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: loginUser.email,
      });
      expect(Auth.compare).toHaveBeenCalledWith(
        loginUser.password,
        user.password
      );
      expect(result).toEqual(user);
    });
    test('It should search', async () => {
      const result = await repo.search({ key: 'name', value: true });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('name');
    });
    test('should create a new user with valid input data', async () => {
      // Arrange
      const newItem: Omit<User, 'id'> = {
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [],
        probada: [],
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        avatar: {
          publicId: '',
          with: 0,
          height: 0,
          format: '',
          url: '',
        },
      };
      const hashedPassword = 'hashedPassword';
      const createdUser: User = {
        id: 'validId',
        ...newItem,
      };
      Auth.hash = jest.fn().mockResolvedValue(hashedPassword);
      UserModel.create = jest.fn().mockResolvedValue(createdUser);
      const result = await repo.create(newItem);

      expect(Auth.hash).toHaveBeenCalledWith(newItem.password);
      expect(UserModel.create).toHaveBeenCalledWith({
        ...newItem,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('when there is an error', () => {
    test('should throw a HttpError with status code 404 when given an empty string as user id', async () => {
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(repo.getById('')).rejects.toThrow(HttpError);
      expect(UserModel.findById).toHaveBeenCalledWith('');
    });
    test('should throw an HttpError with status 404 when an invalid id is passed', async () => {
      const repo = new UsersMongoRepo();
      const id = 'invalidId';
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(repo.getById(id)).rejects.toThrow(HttpError);
      expect(UserModel.findById).toHaveBeenCalledWith(id);
    });
    test('Then, when data isnt found with the update() method', () => {
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      expect(repo.update('', {})).rejects.toThrow();
    });

    test('Then, when data isnt found with the delete() method', () => {
      const mockExec = jest.fn().mockReturnValueOnce(null);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
    test("Then, when data isn't found with the update() method", async () => {
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      await expect(repo.update('', {})).rejects.toThrow(HttpError);
    });

    test("Then, when data isn't found with the delete() method", async () => {
      const mockExec = jest.fn().mockReturnValueOnce(null);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      await expect(repo.delete('')).rejects.toThrow(HttpError);
    });
  });
});
