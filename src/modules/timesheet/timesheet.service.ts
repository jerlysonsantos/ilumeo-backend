import { Response } from 'express';
import { Inject, Injectable } from '@injection-dependency';
import { TimesheetDto } from './dto/timesheet.dto';
import { User } from '../auth/models/user.model';
import { TimesheetRepository } from './repository/timesheet.repository';

@Injectable('timesheetService')
export class TimesheetService {
  @Inject('timesheetRepository')
  timesheetRepository: TimesheetRepository;

  async registerTime(timesheetDto: TimesheetDto, user: User, res: Response) {
    try {
      const lastTimesheet = await this.timesheetRepository.getLastUserRegister(user);

      let registredHourType: boolean = false;

      if (lastTimesheet) {
        registredHourType = !lastTimesheet.registred_hour_type;
      }

      await this.timesheetRepository.registerTime(timesheetDto, registredHourType, user);

      return res.status(200).json({ message: 'Hora registrada com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  getTimesheet(user: User, res: Response) {}
}
