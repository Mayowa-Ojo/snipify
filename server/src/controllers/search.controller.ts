import codes from "http-status-codes";

import * as es from "~services/es.service";
import { ResponseError } from "~utils/index";
import type { AsyncHandler } from "~declarations/index";

export const createIndex: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError
   const { index } = req.body;

   if(!index) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const result = await es.createIndex(index);

      res.json({
         ok: true,
         message: "resource created",
         data: {
            result
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const searchByQuery: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const q = <string>req.query.q;

   if(!q) {
      error.message = "missing/malformed field in request query";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const { body: { hits: { hits: snipHits }}} = await es.searchIndices(["snips"], q, ["title", "description"]);
      const { body: { hits: { hits: fileHits }}} = await es.searchIndices(["files"], q, ["filename", "language"]);
      // const { body: { hits: { hits: collectionHits }}} = await es.searchIndices(["collections"], q, ["name"]);

      res.status(codes.OK).json({
         ok: true,
         message: "resource found",
         data: {
            snip_hits: snipHits,
            file_hits: fileHits,
            // collection_hits: collectionHits
         }
      })
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const deleteDocument: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;
   const index = <string>req.query['index'];

   if(!id || !index) {
      error.message = "missing/malformed field in request body &/ query";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const result = await es.deleteDocument(index, id);

      res.status(200).json({
         ok: true,
         message: "resource updated",
         data: {
            result
         }
      });
   } catch (err) {
      error.message = err.message;
      next(err);
   }
}