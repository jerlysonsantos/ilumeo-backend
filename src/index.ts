import 'reflect-metadata';
import 'module-alias/register';

import bodyParser from 'body-parser';
import App from './app';

import { AuthController } from './modules/auth/auth.controller';
import { TimesheetController } from './modules/timesheet/timesheet.controller';

const app = new App({
  port: 3000,
  controllers: [AuthController, TimesheetController],
  middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })],
});

app.listen();
