export class User {
  id?: number;
  userCode?: string;
  name?: string;

  constructor({ id, userCode, name }: User) {
    this.id = id;
    this.userCode = userCode;
    this.name = name;
  }
}
