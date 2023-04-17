import { Repository } from '@repository';
import { Injectable } from '@injection-dependency';
import { User } from '../models/user.model';

@Injectable('authRepository')
export class AuthRepository extends Repository {
  constructor() {
    super();
  }

  getOneUser(userCode: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.connection.query<User>(`SELECT * FROM users WHERE "user_code" = '${userCode}' LIMIT 1`, (error, results) => {
        if (error) {
          return reject(error);
        }

        if (!results.rows.length) {
          return resolve(null);
        }

        resolve(new User(results.rows[0]));
      });
    });
  }
}
