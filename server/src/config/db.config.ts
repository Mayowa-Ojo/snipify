import { createConnection, getConnectionOptions, Connection } from "typeorm";

import { config } from "~config/env.config";

const connectDB = async (): Promise<Connection | void> => {

   try {
      const options = await getConnectionOptions();

      if(config.NODE_ENV === "test") {
         Object.assign(options, { database: config.DB_TEST});
      }

      if(config.NODE_ENV === "production") {
         Object.assign(options, {
            extra: {
               ssl: {
                  rejectUnauthorized: false
               }
            }
         })
      }

      const connection = await createConnection(options);
      console.error(`[ERROR] --typeorm: connected to database`);
      return connection;
   } catch (err) {
      console.error(`[ERROR] --typeorm: ${err.message}`);
   }
}

export default connectDB;