import type { NextFunction, Request, Response } from "express";
import codes from "http-status-codes";
import fetch from "node-fetch";

import logger from "~config/logger.config";
import { ResponseError } from "~utils/index";
import { config } from "~config/env.config";
import * as userRepository from "~repository/user.repository";

export const notFoundError = (req: Request, res:Response) => {
   logger.error(`${req.method} | 404 | ${req.originalUrl} | ${req.ip}`);

   res.status(404).json({
      ok: false,
      message: "the requested resource doesn't exist",
      data: null
   });
}

export const errorHandler = (error: ResponseError, req: Request, res:Response, _next: NextFunction) => {
   const status = error.statusCode || error.status || 500;
   const message = error.message || "Internal server error";

   logger.error(`${status} | ${req.method} | ${req.originalUrl} | ${req.ip} | ${message}`);

   res.status(status).json({
      ok: false,
      message,
      data: null
   });
}

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
   const error = new ResponseError;
   const authorization = <string>req.headers["authorization"];

   if(!authorization || !authorization.startsWith("token")) {
      error.message = "not authenticated";
      error.statusCode = codes.UNAUTHORIZED;

      next(error);
      return;
   }

   try {
      // verify token
      const response = await fetch(config.GITHUB_USER_URL, {
         headers: {
            Authorization: authorization
         }
      }).then(res => {
         if(!res.ok || res.status === 401) {
            return false;
         }

         return res.json();
      });

      if(!response) {
         error.message = "not authenticated";
         error.statusCode = codes.UNAUTHORIZED;

         next(error);
         return;
      }

      const user = await userRepository.findOne({
         query: { username: response.login }
      });

      if(!user) {
         error.message = "resource not found";
         error.statusCode = codes.NOT_FOUND;

         next(error);
         return;
      }

      const token = authorization.split(" ")[1]

      if(user.revokedTokens.includes(token)) {
         error.message = "invalid token";
         error.statusCode = codes.UNAUTHORIZED;

         next(error);
         return;
      }

      res.locals.user = user;
      next();
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}