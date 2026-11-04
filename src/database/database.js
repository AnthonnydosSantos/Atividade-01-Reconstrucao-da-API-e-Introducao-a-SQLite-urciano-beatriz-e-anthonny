import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { createSchema } from "./schema.js";
import { seedDatabase } from "./seed.js";

const databasePath = fileURLToPath(new URL("./geek-store.db", import.meta.url));
const database = new Database(databasePath);

database.pragma("foreign_keys = ON");

createSchema(database);
seedDatabase(database);

export default database;
