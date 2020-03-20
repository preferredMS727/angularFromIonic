export class User
{
    id?: number;
    mail: string;
    password?: string;
    age?: number;
    gender?: User.GenderEnum;
    netto_income?: number;
    current_shares?: number;
    current_bonds?: number;
    pension_age?: number;
    coupon?: number;
    inflation?: number;
    expenses?: number;
    personal_status?: string;
    zipcode?: string;
}
export namespace User {
    export type GenderEnum = 'm' | 'f' | 'd';
    export const GenderEnum = {
        M: 'm' as GenderEnum,
        F: 'f' as GenderEnum,
        D: 'd' as GenderEnum
    };
}

