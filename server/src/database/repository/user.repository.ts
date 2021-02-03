import { FindManyOptions, FindOneOptions, getRepository, Repository } from "typeorm";

import User from "~entity/user.entity";
import { IRepositoryPayload } from "~declarations/index";
import { populateEntityFields } from "~utils/index";

let repository: Repository<User>
const validRelations = ["collections", "snips", "starred"];

export const create = async ({ data }: IRepositoryPayload): Promise<User> => {
   try {
      repository = getRepository(User);

      const userInstance = new User();

      populateEntityFields(userInstance, data);

      const newUser = await repository.save(userInstance);

      return newUser;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findOne = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<User>): Promise<User> => {
   try {
      repository = getRepository(User);

      const user = await repository.findOne({ where: query, ...opts });

      return user;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<User>): Promise<User> => {
   try {
      repository = getRepository(User);

      const user = await repository.findOne(query.id, { ...opts });

      return user as User;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async ({ query }: IRepositoryPayload, opts?: FindManyOptions<User>): Promise<User[]> => {
   try {
      repository = getRepository(User);

      const users = await repository.find({ where: query, ...opts });

      return users;
   } catch (err) {
      throw new Error(err.message)
   }
}

export const updateOne = async ({ query, update }: IRepositoryPayload): Promise<User> => {
   try {
      repository = getRepository(User);
      const updateResult = await repository.update(query, update);

      return updateResult as unknown as User;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteOne = async ({ query }: IRepositoryPayload): Promise<User> => {
   try {
      repository = getRepository(User);
      const result = await repository.delete(query);

      return result as unknown as User;
   } catch (err) {
      throw new Error(err.message);
   }
}