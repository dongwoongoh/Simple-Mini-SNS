export class Member {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly password: string,
    private readonly isAdmin: boolean,
  ) {}

  public get fields() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      isAdmin: this.isAdmin,
    };
  }
}
