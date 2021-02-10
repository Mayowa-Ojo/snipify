import bcrypt from "bcrypt";
import codes from "http-status-codes";
import { nanoid } from "nanoid";

import languages from "./language_map.json";
import type { IBaseEntity } from "~declarations/index.d";

export class ResponseError extends Error {
   status: number;
   statusCode: number;

   constructor() {
      super();
      this.status = codes.INTERNAL_SERVER_ERROR;
      this.statusCode = codes.INTERNAL_SERVER_ERROR;
   }
}

/**
 * create a hashed version of the given password
 */
export const hashPassword = async (password: string): Promise<string> => {
   try {
      const hash = await bcrypt.hash(password, 12);

      return hash;
   } catch (err) {
      throw new Error(err);
   }
}

/**
 * verify that the password provided is consistent with the hashed version
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
   try {
      const isValid = await bcrypt.compare(password, hash);

      return isValid;
   } catch (err) {
      throw new Error(err);
   }
}

/**
 * populates the fields of a new entity instance with given data
 * @param entity - instance of entity class to be populated
 * @param data - entity properties and values [properties shoould directly align with defined entity]
 */
export const populateEntityFields = <IData>(entity: IBaseEntity, data: IData): void => {
   Object.entries(data).map(([field, value]) => {
      entity[field] = value
   });

   return;
}

/**
 * detect a programming language from its file extension
 * @param ext - file extension
 * @returns
 */
export const mapExtensionToLanguage = (ext: string): string => {
   return languages[ext] || "unknown";
}

/**
 * create a url-friendly slug from given string
 * @param str - source
 */
export const slugify = (str: string): string => {
   return nanoid(5) + "-" + str.toLowerCase().split(" ").join("-");
}