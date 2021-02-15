import codes from "http-status-codes";

import * as fileRepository from "~repository/file.repository";
import * as s3 from "~services/s3.service";
import * as es from "~services/es.service";
import { mapExtensionToLanguage, ResponseError } from "~utils/index";
import type { AsyncHandler, IFileIndex } from "~declarations/index";

export const create: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { content, filename } = req.body;

   if(!content || !filename) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }
   const language = mapExtensionToLanguage(filename.split(".").pop());

   try {
      const result = await s3.uploadOne({ content, filename })

      const file = await fileRepository.create({ data: {
         filename,
         language,
         objectKey: result.Key,
         objectLocation: result.Location
      }});

      await es.addDocumentToIndex(<IFileIndex>{
         fileId: file.id,
         filename: file.filename,
         language: file.language
      }, "files");

      res.status(codes.CREATED).json({
         ok: true,
         message: "file created",
         data: {
            file
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const getFileObject: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;

   if(!id) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const file = await fileRepository.findOne({
         query: { id }
      });

      if(!file) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      const result = await s3.getOne(file.objectKey);

      res.status(codes.OK).json({
         ok: true,
         message: "resource found",
         data: {
            file: {
               body: result.Body,
               size: result.ContentLength
            }
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

   if(!id) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const file = await fileRepository.findById({ query: { id }});

      if(!file) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      await fileRepository.deleteOne({ query: { id }});

      await s3.deleteOne(file.objectKey);

      res.status(codes.OK).json({
         ok: true,
         message: "file deleted",
         data: null
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}