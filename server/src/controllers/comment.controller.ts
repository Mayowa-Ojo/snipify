import codes from "http-status-codes";

import * as commentRepository from "~repository/comment.repository";
import * as snipRepository from "~repository/snip.repository";
import { ResponseError } from "~utils/index";
import type { AsyncHandler } from "~declarations/index";
import User from "~entity/user.entity";

export const create: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { content } = req.body;
   const { snipId } = req.query;
   const user = <User>res.locals.user;

   if(!content || !snipId) {
      error.message = "missing/malformed field in request body/query";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return
   }

   try {
      const snip = await snipRepository.findOne({
         query: { id: snipId }
      });

      const result = await commentRepository.create({
         data: {
            content,
            author: user.id,
            snip: snip.id
         }
      });

      await snipRepository.updateOne({
         query: { id: snipId },
         update: { commentsCount: () => "comments_count + 1" }
      });

      const comment = await commentRepository.findOne({
         query: { id: result.id },
      }, {
         relations: ["replies", "author"]
      });

      res.status(codes.CREATED).json({
         ok: true,
         message: "resource created",
         data: {
            comment
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const createReply: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { content } = req.body;
   const { id } = req.params;
   const user = <User>res.locals.user;

   if(!content || !id) {
      error.message = "missing/malformed field in request body/params";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return
   }

   try {
      const parent = await commentRepository.findOne({
         query: { id }
      });

      if(!parent) {
         error.message = "resource doesn't exist"
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      const result = await commentRepository.create({
         data: {
            content,
            author: user.id,
            parent: parent.id
         }
      });

      const comment = await commentRepository.findOne({
         query: { id: result.id },
      }, {
         relations: ["author"]
      });

      res.status(codes.CREATED).json({
         ok: true,
         message: "resource created",
         data: {
            reply: comment
         }
      });

   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const getOne: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;

   if(!id) {
      error.message = "missing/malformed field in request params";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const comment = await commentRepository.findOne({
         query: { id }
      }, {
         relations: ["replies", "author"]
      });

      if(!comment) {
         error.message = "resource doesn't exist"
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      res.status(codes.OK).json({
         ok: true,
         message: "resource found",
         data: {
            collection: comment
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const deleteOne: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;
   const user = <User>res.locals.user;

   if(!id) {
      error.message = "missing/malformed field in request params";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const comment = await commentRepository.findOne({
         query: { id }
      }, {
         relations: ["author"]
      });

      if(!comment) {
         error.message = "resource doesn't exist"
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      if(user.id !== comment.author.id) {
         error.message = "not authorized";
         error.statusCode = codes.FORBIDDEN;

         next(error);
         return;
      }

      await commentRepository.deleteOne({
         query: { id }
      });

      res.status(codes.OK).json({
         ok: true,
         message: "resource deleted",
         data: null
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const likeByUser: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;
   const user = <User>res.locals.user;

   if(!id) {
      error.message = "missing/malformed field in request params";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      let comment = await commentRepository.findOne({
         query: { id }
      }, {
         relations: ["parent"]
      });

      await commentRepository.updateOne({
         query: { id },
         update: { 
            likes: () => "likes + 1",
            likedBy: comment.likedBy.includes(user.id) ? [...comment.likedBy] : [...comment.likedBy, user.id]
         }
      });

      comment = await commentRepository.findOne({
         query: { id }
      }, {
         relations: comment.parent ? ["author", "parent"] : ["replies", "author"]
      });

      if(!comment) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      res.status(codes.OK).json({
         ok: true,
         message: "resource updated",
         data: {
            comment
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}