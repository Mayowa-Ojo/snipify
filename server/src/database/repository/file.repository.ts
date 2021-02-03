import { getRepository, Repository, InsertResult, FindOneOptions } from "typeorm";

import File from "~entity/file.entity";
import { populateEntityFields } from "~utils/index";
import type { IRepositoryPayload, IBaseEntity } from "~declarations/index";

let repository: Repository<File>

export const create = async ({ data }: IRepositoryPayload): Promise<File> => {
   try {
      repository = getRepository(File);

      const fileInstance = new File();

      populateEntityFields(fileInstance, data);

      const file = await repository.save(fileInstance);

      return file;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const insertMany = async ({ data }: IRepositoryPayload): Promise<InsertResult> => {
   try {
      repository = getRepository(File);

      const fileInstances = data.map(() => new File());

      fileInstances.forEach((instance: IBaseEntity, idx: number) => populateEntityFields(instance, data[idx]));

      const result = await repository.insert(fileInstances);

      return result;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findOne = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<File>): Promise<File> => {
   try {
      repository = getRepository(File);

      const file = await repository.findOne({ where: query, ...opts });

      return file;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<File>): Promise<File> => {
   try {
      repository = getRepository(File);

      const file = await repository.findOne(query.id, { ...opts });

      return file as File;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<File>): Promise<File[]> => {
   try {
      repository = getRepository(File);
      let files: File[];

      if(Array.isArray(query.ids)) {
         files = await repository.findByIds(query.ids, { ...opts });
         return files;
      }

      files = await repository.find({ where: query, ...opts });
      return files;
   } catch (err) {
      throw new Error(err.message)
   }
}

export const updateOne = async ({ query, update }: IRepositoryPayload): Promise<File> => {
   try {
      repository = getRepository(File);
      const updateResult = await repository.update(query, update);

      return updateResult as unknown as File;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteOne = async ({ query }: IRepositoryPayload): Promise<File> => {
   try {
      repository = getRepository(File);
      const result = await repository.delete(query);

      return result as unknown as File;
   } catch (err) {
      throw new Error(err.message);
   }
}