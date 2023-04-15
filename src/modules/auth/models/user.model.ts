export class User {
  id?: number;
  user_code?: string;
  name?: string;

  constructor({ id, user_code, name }: User) {
    this.id = id;
    this.user_code = user_code;
    this.name = name;
  }
}
