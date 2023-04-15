import 'reflect-metadata';
import 'module-alias/register';

import bodyParser from 'body-parser';
import App from './app';

import { AuthController } from './modules/auth/auth.controller';

const app = new App({
  port: 3000,
  controllers: [AuthController],
  middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })],
});

app.listen();
