import codes from "http-status-codes";

import * as collectionRepository from "~repository/collection.repository";
import * as snipRepository from "~repository/snip.repository";
import * as es from "~services/es.service";
import User from "~entity/user.entity";
import { ResponseError } from "~utils/index";
import type { AsyncHandler, ICollectionIndex } from "~declarations/index";

export const create: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { name } = req.body;

   if(!name) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return
   }

   try {
      const user = res.locals.user;
      const result = await collectionRepository.create({
         data: {
            name,
            owner: user.id
         }
      });

      await es.addDocumentToIndex(<ICollectionIndex>{
         collectionId: result.id,
         name: result.name
      }, "collections");

      res.status(codes.CREATED).json({
         ok: true,
         message: "resource created",
         data: {
            collection: result
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
   const user = res.locals.user;

   if(!id) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return
   }

   try {
      const collection = await collectionRepository.findById({ 
         query: { id }
      }, {
         relations: [
            "owner",
            "snips",
            "snips.author",
            "snips.files",
            "snips.source",
            "snips.source.author"
         ]
      });

      if(!collection) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      if(user.id !== collection.owner.id) {
         error.message = "not authorized";
         error.statusCode = codes.FORBIDDEN;

         next(error);
         return;
      }

      res.status(codes.OK).json({
         ok: true,
         message: "resource found",
         data: {
            collection
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const addSnipToCollection: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;
   const { snipId } = req.query;

   if(!id || !snipId) {
      error.message = "missing/malformed field in request param &/ query";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const snip = await snipRepository.findOne({
         query: { id: snipId }
      });

      let collection = await collectionRepository.findOne({
         query: { id }
      });

      if(!snip || !collection) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      await snipRepository.updateOne({
         query: { id: snipId },
         update: { collection: id }
      });

      collection = await collectionRepository.findOne({
         query: { id: collection.id }
      }, {
         relations: [
            "owner",
            "snips",
            "snips.author",
            "snips.files",
            "snips.source",
            "snips.source.author"
         ]
      });

      res.status(codes.OK).json({
         ok: true,
         message: "resource updated",
         data: {
            collection
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const removeSnipFromCollection: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;
   const { snipId } = req.query;

   if(!id || !snipId) {
      error.message = "missing/malformed field in request param &/ query";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const snip = await snipRepository.findOne({
         query: { id: snipId }
      });

      if(!snip) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      await snipRepository.updateOne({
         query: { id: snipId },
         update: { collection: null }
      });

      res.status(codes.OK).json({
         ok: true,
         message: "resource updated",
         data: null
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const updateOne: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;
   const { name } = req.body;
   const user = <User>res.locals.user;

   if(!id || !name) {
      error.message = "missing/malformed field in request params/body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      let collection = await collectionRepository.findOne({
         query: { id }
      }, {
         relations: ["owner"]
      });

      if(collection.owner.id !== user.id) {
         error.message = "not authorized";
         error.statusCode = codes.FORBIDDEN;

         next(error);
         return;
      }

      await collectionRepository.updateOne({
         query: { id },
         update: { name }
      })

      collection = await collectionRepository.findOne({
         query: { id }
      }, {
         relations: [
            "owner",
            "snips",
            "snips.author",
            "snips.files",
            "snips.source",
            "snips.source.author"
         ]
      });

      res.status(codes.OK).json({
         ok: true,
         message: "resource updated",
         data: {
            collection
         }
      })
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
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const collection = await collectionRepository.findById({
         query: { id },
      }, {
         relations: ["owner"]
      });

      if(!collection) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      if(collection.owner.id !== user.id) {
         error.message = "not authorized";
         error.statusCode = codes.FORBIDDEN;

         next(error);
         return;
      }

      await collectionRepository.deleteOne({ query: { id }});

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