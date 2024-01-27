export class Member {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly password: string,
    private readonly isAdmin: boolean,
  ) {}
}
