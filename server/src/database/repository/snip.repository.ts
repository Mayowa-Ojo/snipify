import { getRepository, Repository, FindManyOptions } from "typeorm";

import Snip from "~entity/snip.entity";
import { IRepositoryPayload } from "~declarations/index";
import { populateEntityFields } from "~utils/index";

let repository: Repository<Snip>
const validRelations = ["files"];

export const create = async ({ data }: IRepositoryPayload): Promise<Snip> => {
   try {
      repository = getRepository(Snip);

      const snipInstance = new Snip();

      populateEntityFields(snipInstance, data);

      const snip = await repository.save(snipInstance);

      return snip;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findOne = async ({ query, relations }: IRepositoryPayload): Promise<Snip> => {
   try {
      repository = getRepository(Snip);

      if(relations && relations.length >= 1) {
         if(!Array.isArray(relations)) relations = [relations];
         const isValid = relations.every((relation: string) => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const snip = await repository.findOne({ where: query, relations });

         return snip as Snip;
      }

      const snip = await repository.findOne({ where: query });

      return snip;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query, relations }: IRepositoryPayload): Promise<Snip> => {
   try {
      repository = getRepository(Snip);

      if(relations && relations.length >= 1) {
         if(!Array.isArray(relations)) relations = [relations];
         const isValid = relations.every(relation => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const snip = await repository.findOne(query.id, { relations });

         return snip as Snip;
      }

      const snip = await repository.findOne(query.id);

      return snip as Snip;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async ({ query, relations }: IRepositoryPayload): Promise<Snip[]> => {
   try {
      repository = getRepository(Snip);

      if(relations && relations.length >= 1) {
         if(!Array.isArray(relations)) relations = [relations];
         const isValid = relations.every(relation => validRelations.includes(relation));

         if(!isValid) throw new Error("One or more relations does not exist on queried entity");

         const snips = Array.isArray(query.ids) ?
            await repository.findByIds(query.ids, { relations })
         :
            await repository.find({ where: query, relations });

         return snips;
      }

      const snips = Array.isArray(query.ids) ?
         await repository.findByIds(query.ids)
      :
         await repository.find({ where: query });

      return snips;
   } catch (err) {
      throw new Error(err.message)
   }
}

export const updateOne = async ({ query, update }: IRepositoryPayload): Promise<Snip> => {
   try {
      repository = getRepository(Snip);
      const updateResult = await repository.update(query, update);

      return updateResult as unknown as Snip;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteOne = async ({ query }: IRepositoryPayload): Promise<Snip> => {
   try {
      repository = getRepository(Snip);
      const result = await repository.delete(query);

      return result as unknown as Snip;
   } catch (err) {
      throw new Error(err.message);
   }
}