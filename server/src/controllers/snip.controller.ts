import codes from "http-status-codes";
import jszip from "jszip";

import * as fileRepository from "~repository/file.repository";
import * as snipRespository from "~repository/snip.repository";
import * as userRespository from "~repository/user.repository";
import * as commentRespository from "~repository/comment.repository";
import * as s3 from "~services/s3.service";
import { mapExtensionToLanguage, ResponseError, slugify } from "~utils/index";
import { Permissions } from "~declarations/enums";
import type { AsyncHandler } from "~declarations/index";
import User from "~entity/user.entity";

export const create: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { title, description, files, permission } = req.body;
   const user = <User>res.locals.user;

   if(![title, description, files].every(Boolean)) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   if(!Array.isArray(files) || !files.every((file) => !!file.filename && !!file.content)) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const result = await snipRespository.create({ data: {
         title,
         description,
         slug: slugify(title),
         permission,
         author: user.id
      }});

      const uploadResult = await s3.uploadMany(files);

      const insertFilesPayload = uploadResult.map(obj => ({
         filename: obj.Key.split("~").pop(),
         language: mapExtensionToLanguage(obj.Key.split(".").pop()),
         objectKey: obj.Key,
         objectLocation: obj.Location,
         snip: result.id
      }));

      await fileRepository.insertMany({ data: insertFilesPayload});

      const snip = await snipRespository.findById({
         query: { id: result.id }
      }, {
         relations: ["files", "author", "source", "source.author"]
      });

      res.status(201).json({
         ok: true,
         message: "snip created",
         data: {
            snip
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const getFeed: AsyncHandler = async (_req, res, next) => {
   const error = new ResponseError;

   try {
      const snips = await snipRespository.find({
         query: { permission: "public" },
      }, {
         take: 10,
         order: {
            createdAt: "DESC"
         },
         relations: ["files", "author", "source", "source.author", "source.files"]
      });

      res.status(codes.OK).json({
         ok: true,
         message: "resources found",
         data: {
            feed: snips
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const getCommentsForSnip: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;

   if(!id) {
      error.message = "missing/malformed field in request params";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const snip = await snipRespository.findOne({
         query: { id },
      }, {
         relations: ["comments", "comments.author", "comments.replies", "comments.replies.author"]
      });

      if(!snip) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      const comments = await commentRespository.buildQuery(async (repo) => {

         return repo.createQueryBuilder("comment")
            .leftJoinAndSelect("comment.replies", "reply")
            .leftJoinAndSelect("reply.author", "replyAuthor")
            .leftJoinAndSelect("comment.author", "author")
            .where("comment.snip_id = :id", { id })
            .orderBy("comment.created_at", "DESC")
            .getMany();
      });


      res.status(codes.OK).json({
         ok: true,
         message: "resources found",
         data: {
            comments
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
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const snip = await snipRespository.findById({
         query: { id }
      }, {
         relations: ["author"]
      });

      if(!snip) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      if(snip.author.id !== user.id) {
         error.message = "not authorized";
         error.statusCode = codes.FORBIDDEN;

         next(error);
         return;
      }

      await userRespository.updateOne({
         query: { id: user.id },
         update: {
            starred: user.starred.filter(id => id !== snip.id),
            forked: user.forked.filter(id => id !== snip.id)
         }
      });

      await snipRespository.deleteOne({ query: { id }});

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

export const starSnipByUser: AsyncHandler = async (req, res, next) => {
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
      await snipRespository.updateOne({
         query: { id },
         update: { stars: () => "stars + 1" } // raw sql query
      });

      const snip = await snipRespository.findById({
         query: { id }
      }, {
         relations: ["author", "source", "files", "source.author", "source.files"]
      });

      if(!snip) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      await userRespository.updateOne({
         query: { id: user.id },
         update: { starred: [...user.starred, snip.id] }
      });

      res.status(codes.OK).json({
         ok: true,
         message: "resource updated",
         data: {
            snip
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const createFork: AsyncHandler = async (req, res, next) => {
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
      let source = await snipRespository.findById({
         query: { id }
      }, {
         relations: ["files"]
      });

      if(!source) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      let forkedSnip = await snipRespository.create({
         data: {
            title: source.title,
            description: source.description,
            slug: slugify(source.title),
            author: user.id,
            source: source.id
         }
      });

      const objectKeys = source.files.map(file => file.objectKey);
      // fetch files from s3 bucket to re-upload
      const originalFiles = await s3.getMany(objectKeys);
      const filesToUpload = originalFiles.map((file, index) => (
         { 
            content: file.Body,
            filename: objectKeys[index].split("~").pop()
         }
      ));

      const uploadResult = await s3.uploadMany(filesToUpload);

      // duplicate files in database
      const insertFilesPayload = uploadResult.map(obj => ({
         filename: obj.Key.split("~").pop(),
         language: mapExtensionToLanguage(obj.Key.split(".").pop()),
         objectKey: obj.Key,
         objectLocation: obj.Location,
         snip: forkedSnip.id
      }));

      await fileRepository.insertMany({ data: insertFilesPayload});
      forkedSnip = await snipRespository.findById({
         query: { id: forkedSnip.id }
      }, {
         relations: ["files"]
      });

      await snipRespository.updateOne({
         query: { id: source.id },
         update: { forks: () => "forks + 1" } // raw sql query
      });

      await userRespository.updateOne({
         query: { id: user.id },
         update: { forked: [...user.forked, source.id] }
      });

      source = await snipRespository.findOne({
         query: { id: source.id }
      }, {
         relations: ["files", "author", "source", "source.author", "source.files"]
      });

      res.status(codes.CREATED).json({
         ok: true,
         message: "resource created",
         data: {
            fork: forkedSnip,
            source
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const generateZipFile: AsyncHandler = async (req, res, next) => {
   const error= new ResponseError;
   const { id } = req.params;
   const zip = new jszip;

   if(!id) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      const snip = await snipRespository.findById({
         query: { id }
      }, {
         relations: ["files"]
      });

      if(!snip) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      const objectKeys = snip.files.map(file => file.objectKey);
      // fetch files from s3 bucket
      const objects = await s3.getMany(objectKeys);

      snip.files.forEach((file, index) => {
         zip.file(`${file.objectKey}`, `${objects[index].Body}`);
      });

      const zipped = await zip.generateAsync({
         type: "base64"
      });

      const buffer = Buffer.from(zipped, "base64");

      res.writeHead(200, {
         "Content-Type": "application/zip",
         "Content-disposition": `attachment; filename=${snip.title}.zip`
      });
      res.end(buffer);
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const updatePermission: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { id } = req.params;
   const { permission } = req.body;

   if(!id) {
      error.message = "missing/malformed field in request params";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   if(!permission || !Object.values(Permissions).includes(permission)) {
      error.message = "missing/invalid field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      await snipRespository.updateOne({
         query: { id },
         update: { permission }
      });

      const snip = await snipRespository.findOne({
         query: { id }
      });

      if(!snip) {
         error.message = "resource doesn't exist";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      res.status(codes.OK).json({
         ok: true,
         message: "resource updated",
         data: {
            snip
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}