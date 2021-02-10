import { getRepository } from "typeorm";
import codes from "http-status-codes";

import * as collectionRepository from "~repository/collection.repository";
import * as snipRepository from "~repository/snip.repository";
import { ResponseError } from "~utils/index";
import type { AsyncHandler } from "~declarations/index";
import User from "~entity/user.entity";
import Snip from "~entity/snip.entity";

export const getCollectionsForUser: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const user = res.locals.user;
   const { id } = req.params;

   if(!id) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   if(user.id !== id) {
      error.message = "not authorized";
      error.statusCode = codes.FORBIDDEN;

      next(error);
      return;
   }

   try {
      const collections = await collectionRepository.find({
         query: { owner: user.id }
      }, {
         relations: [
            "snips",
            "snips.files",
            "snips.author",
            "snips.source",
            "snips.source.author"],
         order: {
            updatedAt: "DESC"
         }
      });

      res.status(codes.OK).json({
         ok: true,
         message: "resources found",
         data: {
            collections
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const getSnipsForUser: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const user = <User>res.locals.user;
   const { id } = req.params;

   if(!id) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   if(user.id !== id) {
      error.message = "not authorized";
      error.statusCode = codes.FORBIDDEN;

      next(error);
      return;
   }

   try {
      const snips = await snipRepository.find({
         query: { author: user.id }
      }, {
         relations: ["files", "author", "source", "source.author", "source.files"],
         order: {
            updatedAt: "DESC"
         }
      });

      res.status(codes.OK).json({
         ok: true,
         message: "resources found",
         data: {
            snips
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const getStarredSnipsForUser: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const repository = getRepository(Snip);
   const user = <User>res.locals.user;
   const { id } = req.params;

   if(!id) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   if(user.id !== id) {
      error.message = "not authorized";
      error.statusCode = codes.FORBIDDEN;

      next(error);
      return;
   }

   try {
      const snips = await repository.createQueryBuilder("snip")
         .leftJoinAndSelect("snip.files", "file")
         .leftJoinAndSelect("snip.author", "author")
         .where("snip.id IN (:...starred)", { starred: user.starred })
         .getMany();

      res.status(codes.OK).json({
         ok: true,
         message: "resources found",
         data: {
            snips
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}