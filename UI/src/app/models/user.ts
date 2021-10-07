export class User {
  username: string;
  password: string;
  type: string;
  email: string;

  constructor() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.type = '';
  }
}

export class UserLogin {
  username: string;
  password: string;

  constructor() {
    this.username = '';
    this.password = '';
  }
}
