import client from "~config/es.config";
import type { ApiResponse } from "@elastic/elasticsearch";

import type { ICollectionIndex, IFileIndex, ISnipIndex } from "~declarations/index";

const validIndices = ["snips", "files", "collections"];

export const createIndex = async (index: string): Promise<ApiResponse> => {
   try {
      const result = await client.indices.create({
         index
      });

      return result;
   } catch (err) {
      throw new Error(err);
   }
}

export async function addDocumentToIndex(doc: ISnipIndex, index: string): Promise<ApiResponse>;
export async function addDocumentToIndex(doc: IFileIndex, index: string): Promise<ApiResponse>;
export async function addDocumentToIndex(doc: ICollectionIndex, index: string): Promise<ApiResponse>;
export async function addDocumentToIndex(doc: ISnipIndex | IFileIndex | ICollectionIndex, index: string
): Promise<ApiResponse> {
   if(!validIndices.includes(index)) throw new Error("invalid index");
   
   try {
      const result = await client.index({
         index,
         body: doc
      });
      
      return result;
   } catch (err) {
      throw new Error(err);
   }
}

export const searchIndices = async (indices: string[], query: string, fields: string[]): Promise<ApiResponse> => {
   if(!indices.every(index => validIndices.includes(index))) throw new Error("invalid index");

   try {
      const result = client.search({
         index: indices,
         body: {
            size: 20,
            from: 0,
            query: {
               multi_match: {
                  query,
                  fields: [...fields],
                  fuzziness: "AUTO"
               }
            }
         }
      });

      return result;
   } catch (err) {
      throw new Error(err);
   }
}

export const deleteDocument = async (index: string, id: string): Promise<ApiResponse> => {
   try {
      const result = client.delete({
         id,
         index
      });

      return result;
   } catch (err) {
      throw new Error(err);
   }
}
