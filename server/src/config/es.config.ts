import { Client } from "@elastic/elasticsearch";

import { config } from "~config/env.config";

let client: Client;

try {
   client = new Client({
      node: config.ELASTIC_SEARCH_HOST,
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: true
   });

   console.log("[LOG]: --elasticsearch: connected to es client");
} catch (err) {
   console.error("[ERROR] --elasticsearch: ", err.message);
}

export default client;