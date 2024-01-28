export class Member {
    constructor(
        private readonly id: string,
        private readonly email: string,
        private readonly isAdmin: boolean,
        private readonly password?: string,
    ) {}
    public get data() {
        return {
            id: this.id,
            email: this.email,
            isAdmin: this.isAdmin,
            password: this.password,
        };
    }
}
