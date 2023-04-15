import { User } from '../../../modules/auth/models/user.model';

export class Timesheet {
  id?: number;
  user_id?: number;
  user?: User;
  registred_hour?: number;
  registred_date?: Date;

  /**
   * 0 = Entrada
   * 1 = Saída
   */
  registred_hour_type?: boolean;

  constructor({ id, user_id, registred_hour, registred_date, registred_hour_type }: Timesheet) {
    this.id = id;
    this.user_id = user_id;
    this.registred_hour = registred_hour;
    this.registred_date = registred_date;
    this.registred_hour_type = registred_hour_type;
  }
}
