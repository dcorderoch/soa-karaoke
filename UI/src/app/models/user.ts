export class User {
  username: string;
  password: string;
  role: string;
  email: string;

  constructor() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.role = '';
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

export class UserToken {
  username: string;
  role: string;
  accessToken: string;
  refreshToken: string;

  constructor() {
    this.username = '';
    this.role = '';
    this.accessToken = '';
    this.refreshToken = '';
  }
}
