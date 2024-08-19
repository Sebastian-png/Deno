import { Client } from "./deps.ts";

export const client = await new Client().connect({
  hostname: "localhost",
  username: "root",  
  db: "baseDeno",
  password: "",  
});
