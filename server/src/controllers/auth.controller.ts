import fetch from "node-fetch";
import codes from "http-status-codes";

import * as userRepository from "~repository/user.repository";
import User from "~entity/user.entity";
import { ResponseError } from "~utils/index";
import { config } from "~config/env.config";
import type { AsyncHandler } from "~declarations/index";

export const authenticate: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { requestToken } = req.body;

   if(!requestToken) {
      error.message = "authorization failed";
      error.statusCode = codes.UNAUTHORIZED;

      next(error);
      return;
   }

   try {
      const tokenResponse = await fetch(
         `${config.GITHUB_OAUTH_URL}?client_id=${config.GITHUB_OAUTH_CLIENT_ID}&client_secret=${config.GITHUB_OAUTH_CLIENT_SECRET}&code=${requestToken}`,
         {
            headers: {
               "accept": "application/json"
            }
         }
      );
      const tokenResponseData = await tokenResponse.json();

      const userResponse = await fetch(
         `${config.GITHUB_USER_URL}`,
         {
            headers: {
               "Authorization": `token ${tokenResponseData["access_token"]}`
            }
         }
      );
      const userResponseData = await userResponse.json();

      const user = await userRepository.findOne({ query: { githubId: userResponseData.id }});

      if(!user) {
         // create user
         const payload = {
            name: userResponseData["name"],
            username: userResponseData["login"],
            avatar: userResponseData["avatar_url"],
            githubId: userResponseData["id"]
         }

         const user = await userRepository.create({ data: payload });

         res.status(codes.CREATED).json({
            ok: true,
            message: "resource created",
            data: {
               user,
               token: tokenResponseData["access_token"]
            }
         });

         return;
      }

      res.status(codes.OK).json({
         ok: true,
         message: "resource found",
         data: {
            user,
            token: tokenResponseData["access_token"]
         }
      });

   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const reAuthenticate: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { accessToken } = req.body;

   if(!accessToken) {
      error.message = "authorization failed";
      error.statusCode = codes.UNAUTHORIZED;

      next(error);
      return;
   }

   try {
      // verify token
      const response = await fetch(config.GITHUB_USER_URL, {
         headers: {
            Authorization: "token " + accessToken
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

      res.json({
         ok: true,
         message: "authenticated",
         data: {
            user
         }
      });
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}

export const revokeToken: AsyncHandler = async (req, res, next) => {
   const error = new ResponseError;
   const { accessToken } = req.body;
   const user = <User>res.locals.user;

   if(!accessToken) {
      error.message = "missing/malformed field in request body";
      error.statusCode = codes.BAD_REQUEST;

      next(error);
      return;
   }

   try {
      await userRepository.updateOne({
         query: { id: user.id },
         update: { 
            revokedTokens: user.revokedTokens.length < 50 ?
                              [...user.revokedTokens, accessToken]
                           :
                              [...user.revokedTokens.filter((_, idx) => idx > 10), accessToken]
         }
      });

      res.status(codes.OK).json({
         ok: true,
         message: "token revoked",
         data: null
      })
   } catch (err) {
      error.message = err.message;
      next(error);
   }
}
