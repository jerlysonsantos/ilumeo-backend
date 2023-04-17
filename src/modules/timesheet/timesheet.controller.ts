import { Controller, Get, Post } from '@routers';
import { Authenticate, AuthenticatedRequest } from '../../helpers/jwt.helper';
import { Response } from 'express';
import { Inject } from '@injection-dependency';
import { TimesheetService } from './timesheet.service';
import { TimesheetDto } from './dto/timesheet.dto';
import { ValidateBody } from '../../helpers/validate-body.helper';
import { IPaginateOptions } from './interfaces/timesheet-paginate.interface';

@Controller('/timesheet')
export class TimesheetController {
  @Inject('timesheetService')
  timesheetService: TimesheetService;

  @Post('/register', Authenticate, ValidateBody(TimesheetDto))
  registerTime(req: AuthenticatedRequest<TimesheetDto>, res: Response) {
    try {
      return this.timesheetService.registerTime(req.body, req.user, res);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @Get('/', Authenticate)
  getTimesheet(req: AuthenticatedRequest, res: Response) {
    try {
      const paginateOptions: IPaginateOptions = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
      };

      return this.timesheetService.getTimesheet(req.user, paginateOptions, res);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @Get('/current', Authenticate)
  getCurrentHour(req: AuthenticatedRequest, res: Response) {
    try {
      return this.timesheetService.getCurrentHour(req.user, res);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
