import { User, UserLogin } from '../../entities/user.model.js';
import { Auth } from '../../services/auth.js';
import { HttpError } from '../../types/http.error.js';
import { UsersMongoRepo } from './user.mongo.repo.js';
import { UserModel } from './users.mongo.model.js';
jest.mock('./users.mongo.model');
jest.mock('../../services/auth');
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
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });
      Auth.compare = jest.fn().mockResolvedValue(true);
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
    test("should update a user's data when valid id and newData are provided", async () => {
      const id = 'validId';
      const newData: Partial<User> = {
        name: 'New Name',
        age: 30,
      };
      const updatedUser: User = {
        id: 'validId',
        name: 'New Name',
        age: 30,
      } as unknown as User;
      UserModel.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedUser) });
      const result = await repo.update(id, newData);

      expect(result).toEqual(updatedUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, {
        new: true,
      });
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
      };
      UserModel.findOne = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
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
      const newItem: Omit<User, 'id'> = {
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [],
        probada: [],
        email: 'john.doe@example.com',
        password: 'hashedPassword',
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
    test('should return the updated user object after adding a beer to the "probada" list', async () => {
      const beerId = 'beerId';
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [],
        probada: [],
      };
      const updatedUser = { ...user, probada: [beerId] };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      UserModel.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedUser) });

      const result = await repo.addBeer(beerId, userId);
      expect(UserModel.findById).toHaveBeenCalledWith(userId);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $push: { probada: beerId } },
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });
    test('should return the updated user object after adding a Pub to the "visitado" list', async () => {
      const PubId = 'beerId';
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [],
        probada: [],
      };
      const updatedUser = { ...user, visitado: [PubId] };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await repo.addPub(PubId, userId);
      expect(UserModel.findById).toHaveBeenCalledWith(userId);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $push: { visitado: PubId } },
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });
    test("should remove a pub from a user's visited pubs list when the pub exists in the list", async () => {
      // Arrange
      const pubIdToRemove = 'pubId';
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [pubIdToRemove],
        probada: [],
      };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });
      const result = await repo.removePub(pubIdToRemove, userId);
      expect(UserModel.findById).toHaveBeenCalledWith(userId);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $pull: { visitado: pubIdToRemove } },
        { new: true }
      );
      expect(result).toEqual(user);
    });
    test("should remove a beer from a user's visited pubs list when the pub exists in the list", async () => {
      const beerIdToRemove = 'beerId';
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [],
        probada: [beerIdToRemove],
      };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });
      const result = await repo.removeBeer(beerIdToRemove, userId);
      expect(UserModel.findById).toHaveBeenCalledWith(userId);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $pull: { probada: beerIdToRemove } },
        { new: true }
      );
      expect(result).toEqual(user);
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
    test('should throw a 404 error if the user is not found in the database', async () => {
      const beerId = 'beerId';
      const userId = 'userId';
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(repo.addBeer(beerId, userId)).rejects.toThrow(HttpError);
    });
    test('should throw a 404 error if the user is not found in the database', async () => {
      const PubId = 'beerId';
      const userId = 'userId';
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(repo.addPub(PubId, userId)).rejects.toThrow(HttpError);
    });
    test('should not add a beer to the "probada" list if it is already in the list', async () => {
      const PubId = 'PubId';
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [PubId],
        probada: [],
      };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });

      const result = await repo.addPub(PubId, userId);

      expect(UserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
    test('should throw a HttpError with status 404 when the user does not exist', async () => {
      const pubIdToRemove = 'pubId';
      const userId = 'userId';
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(repo.removePub(pubIdToRemove, userId)).rejects.toThrow(
        HttpError
      );
    });
    test('should throw a HttpError with status 404 when the update fails', async () => {
      const pubIdToRemove = 'pubId';
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [pubIdToRemove],
        probada: [],
      };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(repo.removePub(pubIdToRemove, userId)).rejects.toThrow(
        HttpError
      );
    });
    test('should throw a HttpError with status 404 when the user does not exist', async () => {
      const beerIdToRemove = 'beerId';
      const userId = 'userId';
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(repo.removeBeer(beerIdToRemove, userId)).rejects.toThrow(
        HttpError
      );
    });
    test('should throw a HttpError with status 404 when the update fails', async () => {
      const beerIdToRemove = 'beerId';
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        visitado: [],
        probada: [beerIdToRemove],
      };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(repo.removeBeer(beerIdToRemove, userId)).rejects.toThrow(
        HttpError
      );
    });
    test('should throw HttpError with 401 status when invalid email is provided', async () => {
      const loginUser: UserLogin = {
        email: 'invalid@example.com',
        password: 'password123',
      };
      UserModel.findOne = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(repo.login(loginUser)).rejects.toThrow(HttpError);
    });
  });
});
