import type { Request, Response, NextFunction } from "express";

import File from "~entity/file.entity";
import Snip from "~entity/snip.entity";
import Collection from "~entity/collection.entity";
import User from "~entity/user.entity";
import Comment from "~entity/comment.entity";

declare interface IEnvConfig {
   PORT: string | number
   NODE_ENV: string
   API_VERSION: string | number
   LOG_FILE: string
   DB_URI: string
   DB_NAME: string
   DB_TEST: string
   DB_USER: string
   DB_PASSWORD: string
   AWS_ACCESS_KEY_ID: string
   AWS_SECRET_ACCESS_KEY: string
   AWS_REGION: string
   AWS_S3_BUCKET: string
   GITHUB_OAUTH_CLIENT_ID: string
   GITHUB_OAUTH_CLIENT_SECRET: string
   GITHUB_OAUTH_URL: string
   GITHUB_USER_URL: string
}

declare type IBaseEntity = User | Collection | Snip | File | Comment

declare interface IRepositoryPayload {
   data?: any
   query?: any
   update?: any
}

declare type AsyncHandler = (req: Request, res: Response, next?: NextFunction) => Promise<void>
