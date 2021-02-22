import { createConnection, getConnectionOptions, Connection } from "typeorm";
import path from "path"

import { config } from "~config/env.config";

const connectDB = async (): Promise<Connection | void> => {

   try {
      const options = await getConnectionOptions();

      if(config.NODE_ENV === "test") {
         Object.assign(options, { database: config.DB_TEST});
      }

      if(config.NODE_ENV === "production") {
         Object.assign(options, {
            entities: [__dirname + "../database/entity/**/*.js"],
            extra: {
               ssl: {
                  rejectUnauthorized: false
               }
            }
         })
      }

      const connection = await createConnection(options);

      console.log("[INFO] --typeorm: connected to database");
      console.log("[DEBUG] __dirname: ", path.join(__dirname, "../database/entity"));
      return connection;
   } catch (err) {
      console.error(`[ERROR] --typeorm: ${err.message}`);
   }
}

export default connectDB;