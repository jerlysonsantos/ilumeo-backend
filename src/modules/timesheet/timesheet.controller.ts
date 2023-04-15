import { Controller, Post } from '@routers';
import { Authenticate, AuthenticatedRequest } from '../../helpers/jwt.helper';
import { Request, Response } from 'express';
import { Inject } from '@injection-dependency';
import { TimesheetService } from './timesheet.service';
import { TimesheetDto } from './dto/timesheet.dto';
import { ValidateBody } from '../../helpers/validate-body.helper';

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
}
