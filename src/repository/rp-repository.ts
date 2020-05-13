import 'reflect-metadata';
import { injectable } from 'inversify';
import * as mysql from 'mysql';
import config from '@src/config';

@injectable()
export default class RpRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: config.server.mysql.host,
      user: config.server.mysql.user,
      password: config.server.mysql.password,
      database: config.server.mysql.db,
      port: config.server.mysql.port,
    });
  }

  userExists(rpId: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.connection.query(
        `SELECT whitelisted FROM ${config.whitelist.mysql.table} 
      WHERE ${config.whitelist.mysql.table}.${config.whitelist.mysql.idField} = ?`,
        [rpId],
        (error, results, fields) => {
          if (error) {
            reject(error);
          }

          if (results && results.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  isWhitelisted(rpId: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.connection.query(
        `SELECT whitelisted FROM ${config.whitelist.mysql.table} 
      WHERE ${config.whitelist.mysql.table}.${config.whitelist.mysql.idField} = ?`,
        [rpId],
        (error, results, fields) => {
          if (error) {
            reject(error);
          }

          if (results && results.length > 0) {
            resolve(results[0].whitelisted);
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  setWhitelisted(rpId: string, whitelisted: boolean) {
    return new Promise<void>((resolve, reject) => {
      this.connection.query(
        {
          sql: `UPDATE ${config.whitelist.mysql.table} 
        SET ${config.whitelist.mysql.table}.${config.whitelist.mysql.flagField} = ? 
        WHERE ${config.whitelist.mysql.table}.${config.whitelist.mysql.idField} = ?`,
          timeout: 10000,
          values: [whitelisted ? 1 : 0, Number(rpId)],
        },
        (error, results, fields) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(results);
        }
      );
    });
  }
}
