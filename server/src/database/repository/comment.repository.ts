import { getRepository, Repository, InsertResult, UpdateResult, DeleteResult, FindOneOptions } from "typeorm";

import Comment from "~entity/comment.entity";
import { populateEntityFields } from "~utils/index";
import type { IRepositoryPayload, IBaseEntity } from "~declarations/index";

let repository: Repository<Comment>
const validRelations = ["replies", "author"]

export const create = async ({ data }: IRepositoryPayload): Promise<Comment> => {
   try {
      repository = getRepository(Comment);

      const commentInstance = new Comment();

      populateEntityFields(commentInstance, data);

      const comment = await repository.save(commentInstance);

      return comment;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const insertMany = async ({ data }: IRepositoryPayload): Promise<InsertResult> => {
   try {
      repository = getRepository(Comment);

      const commentInstances = data.map(() => new Comment());

      commentInstances.forEach((instance: IBaseEntity, idx: number) => populateEntityFields(instance, data[idx]));

      const result = await repository.insert(commentInstances);

      return result;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findOne = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<Comment>): Promise<Comment> => {
   try {
      repository = getRepository(Comment);

      const comment = await repository.findOne({ where: query, ...opts });

      return comment;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const findById = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<Comment>): Promise<Comment> => {
   try {
      repository = getRepository(Comment);

      const comment = await repository.findOne(query.id, { ...opts });

      return comment;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const find = async ({ query }: IRepositoryPayload, opts?: FindOneOptions<Comment>): Promise<Comment[]> => {
   try {
      repository = getRepository(Comment);

      const comments = Array.isArray(query.ids) ?
         await repository.findByIds(query.ids, { ...opts })
      :
         await repository.find({ where: query, ...opts });

      return comments;
   } catch (err) {
      throw new Error(err.message)
   }
}

export const updateOne = async ({ query, update }: IRepositoryPayload): Promise<UpdateResult> => {
   try {
      repository = getRepository(Comment);

      const updateResult = await repository.update(query, update);

      return updateResult;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const deleteOne = async ({ query }: IRepositoryPayload): Promise<DeleteResult> => {
   try {
      repository = getRepository(Comment);

      const result = await repository.delete(query);

      return result;
   } catch (err) {
      throw new Error(err.message);
   }
}

export const buildQuery = async (cb: (repo: Repository<Comment>) => Promise<Comment[]>) => {
   try {
      repository = getRepository(Comment);

      return await cb(repository)
   } catch (err) {
      throw new Error(err.message)
   }
}