import { Response } from 'express';
import { Inject, Injectable } from '@injection-dependency';
import { TimesheetDto } from './dto/timesheet.dto';
import { User } from '../auth/models/user.model';
import { TimesheetRepository } from './repository/timesheet.repository';
import { IPaginateOptions } from './interfaces/timesheet-paginate.interface';

@Injectable('timesheetService')
export class TimesheetService {
  @Inject('timesheetRepository')
  timesheetRepository: TimesheetRepository;

  async registerTime(timesheetDto: TimesheetDto, user: User, res: Response) {
    try {
      const lastTimesheet = await this.timesheetRepository.getLastUserRegister(user);

      let registredHourType = false;

      if (lastTimesheet) {
        registredHourType = !lastTimesheet.registred_hour_type;
      }

      await this.timesheetRepository.registerTime(timesheetDto, registredHourType, user);

      return res.status(200).json({ message: 'Hora registrada com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getTimesheet(user: User, paginateOptions: IPaginateOptions, res: Response) {
    try {
      const timesheets = await this.timesheetRepository.getTimesheetByUserId(user.id, paginateOptions);

      return res.status(200).json({ paginateOptions, items: timesheets });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getCurrentHour(user: User, res: Response) {
    try {
      const timesheet = await this.timesheetRepository.getCurrentHourById(user.id);
      const lastRegisterType = await this.timesheetRepository.getLastRegisterType(user.id);

      if (!timesheet) {
        return res.status(200).json({ total_hours: '0h 00m', last_register_type: null });
      }

      return res.status(200).json({ ...timesheet, last_register_type: lastRegisterType });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
