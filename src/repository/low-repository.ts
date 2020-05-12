import "reflect-metadata";
import { injectable } from "inversify";
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { DbSchema } from "@src/model/db-schema";

@injectable()
export default class LowRepository {
  private database: low.LowdbSync<DbSchema>;

  constructor() {
    const adapter = new FileSync<DbSchema>('db.json');

    this.database = low(adapter);
  }

  getInstance() {
    return this.database;
  }
}