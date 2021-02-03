import { FindOneOptions, getRepository, Repository } from "typeorm";

import Collection from "~entity/collection.entity";
import { IRepositoryPayload } from "~declarations/index";
import { populateEntityFields } from "~utils/index";

let repository: Repository<Collection>
const validRelations = ["snips", "owner", "snips.files"];

export const create = async ({ data }: IRepositoryPayload): Promise<Collection> => {
   try {
      repository = getRepository(Collection);

      const collectionInstance = new Collection();

      populateEntityFields(collectionInstance, data);

      const collection = await repository.save(collectionInstance);

      return collection;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findOne = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<Collection>): Promise<Collection> => {
   try {
      repository = getRepository(Collection);

      const collection = await repository.findOne({ where: query, ...opts });

      return collection;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<Collection>): Promise<Collection> => {
   try {
      repository = getRepository(Collection);

      const collection = await repository.findOne(query.id, { ...opts });

      return collection as Collection;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<Collection>): Promise<Collection[]> => {
   try {
      repository = getRepository(Collection);

      const collections = Array.isArray(query.ids) ?
         await repository.findByIds(query.ids, { ...opts })
      :
         await repository.find({ where: query, ...opts });

      return collections;
   } catch (err) {
      throw new Error(err.message)
   }
}

export const updateOne = async ({ query, update }: IRepositoryPayload): Promise<Collection> => {
   try {
      repository = getRepository(Collection);
      const updateResult = await repository.update(query, update);

      return updateResult as unknown as Collection;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteOne = async ({ query }: IRepositoryPayload): Promise<Collection> => {
   try {
      repository = getRepository(Collection);
      const result = await repository.delete(query);

      return result as unknown as Collection;
   } catch (err) {
      throw new Error(err.message);
   }
}