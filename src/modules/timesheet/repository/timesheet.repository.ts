import { Injectable } from '@injection-dependency';
import { Repository } from '@repository';
import { TimesheetDto } from '../dto/timesheet.dto';
import { User } from 'src/modules/auth/models/user.model';
import { Timesheet } from '../models/timesheet.model';
import { IPaginateOptions } from '../interfaces/timesheet-paginate.interface';
import { ITimesheet } from '../interfaces/timesheet.interface';

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

  private formatTime(hourFloat: number) {
    if (hourFloat < 0) {
      return '0h 00m';
    }

    var hour = Math.floor(hourFloat);
    var minutes = Math.round((hourFloat - hour) * 60);

    var formattedTime = hour + 'h ' + String(minutes).padStart(2, '0') + 'm';
    return formattedTime;
  }

  private formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0') + '/' + year;
  }

  getTimesheetByUserId(userId: number, { page, limit }: IPaginateOptions): Promise<ITimesheet[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT date_trunc('day', registred_date) as date,
          SUM(CASE WHEN registred_hour_type = false THEN -registred_hour ELSE registred_hour END) as total_hours
        FROM timesheet t 
        WHERE user_id = ${userId} AND registred_date < CURRENT_DATE
        GROUP BY date
        ORDER BY date DESC
        LIMIT ${limit}
        OFFSET ${page * limit}
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }

          const items: ITimesheet[] = results.rows.map((row) => ({
            date: this.formatDate(row.date),
            total_hours: this.formatTime(row.total_hours),
          }));

          resolve(items);
        }
      );
    });
  }

  getLastRegisterType(userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT 
          registred_hour_type
        FROM timesheet t 
        WHERE 
          user_id = ${userId}
          AND registred_date >= CURRENT_DATE
        ORDER BY created_at DESC
        LIMIT 1
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }

          if (!results.rows.length) {
            return resolve(null);
          }

          resolve(results.rows[0].registred_hour_type);
        }
      );
    });
  }

  getCurrentHourById(userId: number): Promise<ITimesheet> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT date_trunc('day', registred_date) as date,
          SUM(CASE WHEN registred_hour_type = false THEN -registred_hour ELSE registred_hour END) as total_hours
        FROM timesheet t 
        WHERE 
          user_id = ${userId} 
          AND registred_date >= CURRENT_DATE
        GROUP BY date
        ORDER BY date DESC
        LIMIT 1
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }

          if (!results.rows.length) {
            return resolve(null);
          }

          const timesheet = {
            total_hours: this.formatTime(results.rows[0].total_hours),
          };

          resolve(timesheet);
        }
      );
    });
  }
}
