import { getRepository, Repository } from "typeorm";

import Collection from "~entity/collection.entity";
import { IRepositoryPayload } from "~declarations/index";
import { populateEntityFields } from "~utils/index";

let repository: Repository<Collection>
const validRelations = ["snips", "owner"];

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

export const findOne = async ({ query, relations }: any): Promise<Collection> => {
   try {
      repository = getRepository(Collection);

      if(relations && relations.length >= 1) {
         if(!Array.isArray(relations)) relations = [relations];
         const isValid = relations.every((relation: string) => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const collection = await repository.findOne({ where: query, relations });

         return collection as Collection;
      }

      const collection = await repository.findOne({ where: query });

      return collection;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query, relations }: IRepositoryPayload): Promise<Collection> => {
   try {
      repository = getRepository(Collection);

      if(relations && relations.length >= 1) {
         if(!Array.isArray(relations)) relations = [relations];
         const isValid = relations.every(relation => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const collection = await repository.findOne(query.id, { relations });

         return collection as Collection;
      }

      const collection = await repository.findOne(query.id);

      return collection as Collection;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async ({ query, relations }: IRepositoryPayload): Promise<Collection[]> => {
   try {
      repository = getRepository(Collection);

      if(relations && relations.length >= 1) {
         if(!Array.isArray(relations)) relations = [relations];
         const isValid = relations.every(relation => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const collections = Array.isArray(query.ids) ?
            await repository.findByIds(query.ids, { relations })
         :
            await repository.find({ where: query, relations });

         return collections;
      }

      const collections = Array.isArray(query.ids) ?
         await repository.findByIds(query.ids)
      :
         await repository.find({ where: query });

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