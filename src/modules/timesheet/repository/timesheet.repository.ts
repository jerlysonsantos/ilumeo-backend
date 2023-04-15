import { Injectable } from '@injection-dependency';
import { Repository } from '@repository';
import { TimesheetDto } from '../dto/timesheet.dto';
import { User } from 'src/modules/auth/models/user.model';
import { Timesheet } from '../models/timesheet.model';

@Injectable('timesheetRepository')
export class TimesheetRepository extends Repository {
  constructor() {
    super();
  }

  registerTime(timesheetDto: TimesheetDto, registredHourType: boolean, user: User) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        'INSERT INTO timesheet (user_id, registred_hour, registred_date, registred_hour_type) VALUES ($1, $2, $3, $4)',
        [user.id, timesheetDto.registred_hour, timesheetDto.registred_date, registredHourType],
        (error, results) => {
          if (error) {
            return reject(error);
          }

          resolve(results);
        }
      );
    });
  }

  getLastUserRegister(user: User): Promise<Timesheet> {
    return new Promise((resolve, reject) => {
      this.connection.query<Timesheet>(
        `SELECT 
            id, 
            registred_hour_type, 
            user_id 
          FROM timesheet WHERE "user_id" = '${user.id}' 
          ORDER BY "created_at" DESC 
          LIMIT 1`,
        (error, results) => {
          if (error) {
            return reject(error);
          }

          if (!results.rows.length) {
            return resolve(null);
          }

          resolve(new Timesheet(results.rows[0]));
        }
      );
    });
  }

  getTimesheetByUserCode() {}
}
