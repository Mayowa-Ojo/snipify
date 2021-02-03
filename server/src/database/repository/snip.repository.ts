import { getRepository, Repository, UpdateResult, DeleteResult, FindManyOptions, FindOneOptions } from "typeorm";

import Snip from "~entity/snip.entity";
import { IRepositoryPayload } from "~declarations/index";
import { populateEntityFields } from "~utils/index";

let repository: Repository<Snip>

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

export const findOne = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<Snip>): Promise<Snip> => {
   try {
      repository = getRepository(Snip);

      const snip = await repository.findOne({ where: query, ...opts });

      return snip;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<Snip>): Promise<Snip> => {
   try {
      repository = getRepository(Snip);

      const snip = await repository.findOne(query.id, { ...opts });

      return snip as Snip;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async ({ query }: IRepositoryPayload, opts?: FindManyOptions<Snip>): Promise<Snip[]> => {
   try {
      repository = getRepository(Snip);

      const snips = Array.isArray(query.ids) ?
         await repository.findByIds(query.ids, { ...opts })
      :
         await repository.find({ where: query, ...opts });

      return snips;
   } catch (err) {
      throw new Error(err.message)
   }
}

export const updateOne = async ({ query, update }: IRepositoryPayload): Promise<UpdateResult> => {
   try {
      repository = getRepository(Snip);
      const result = await repository.update(query, update);

      return result;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteOne = async ({ query }: IRepositoryPayload): Promise<DeleteResult> => {
   try {
      repository = getRepository(Snip);
      const result = await repository.delete(query);

      return result;
   } catch (err) {
      throw new Error(err.message);
   }
}