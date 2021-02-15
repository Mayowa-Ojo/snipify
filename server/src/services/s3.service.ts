import * as Aws from "aws-sdk";
import { nanoid } from "nanoid";

import { config } from "~config/env.config";

const s3 = new Aws.S3({
   credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY
   },
   region: config.AWS_REGION
});

interface IUploadObject {
   content: unknown
   filename: string
   objectKey?: string
}

export const getOne = async (key: string): Promise<Aws.S3.GetObjectOutput> => {
   try {
      const result = await s3.getObject({
         Key: key,
         Bucket: config.AWS_S3_BUCKET
      }).promise();

      return { ...result, Body: result.Body.toString() };
   } catch (err) {
      throw new Error(err);
   }
}

export const getMany = async (keys: string[]): Promise<Aws.S3.GetObjectOutput[]> => {
   try {
      const promises = keys.map(key => s3.getObject({
         Key: key,
         Bucket: config.AWS_S3_BUCKET
      }).promise());

      const result = await Promise.all(promises);

      return result.map(obj => ({ ...obj, Body: obj.Body.toString() }))
   } catch (err) {
      throw new Error(err);
   }
}

export const uploadOne = async (object: IUploadObject): Promise<Aws.S3.ManagedUpload.SendData> => {
   try {
      const result = await s3.upload({
         Bucket: config.AWS_S3_BUCKET,
         Body: object.content,
         Key: `${nanoid(8)}~${object.filename}`,
         ContentType: "text/plain"
      }).promise()
   
      return result;
   } catch (err) {
      throw new Error(err);
   }
}

export const uploadMany = async (objects: IUploadObject[]): Promise<Aws.S3.ManagedUpload.SendData[]> => {
   try {
      const promises = objects.map(obj => s3.upload({
         Bucket: config.AWS_S3_BUCKET,
         Body: obj.content,
         Key: `${nanoid(8)}~${obj.filename}`,
         ContentType: "text/plain"
      }).promise());

      const result = await Promise.all(promises);

      return result;
   } catch (err) {
      throw new Error(err);
   }
}

export const updateMany = async (objects: IUploadObject[]): Promise<Aws.S3.PutObjectOutput[]> => {
   try {
      const promises = objects.map(obj => s3.putObject({
         Bucket: config.AWS_S3_BUCKET,
         Body: obj.content,
         Key: obj.objectKey,
         ContentType: "text/plain"
      }).promise());

      const result = await Promise.all(promises);

      return result;
   } catch (err) {
      throw new Error(err);
   }
}

export const deleteOne = async (key: string): Promise<void> => {
   try {
      await s3.deleteObject({
         Bucket: config.AWS_S3_BUCKET,
         Key: key
      }).promise();
   } catch (err) {
      throw new Error(err);
   }
}