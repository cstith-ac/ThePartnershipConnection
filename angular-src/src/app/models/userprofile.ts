export class UserProfile {
    id: number;
    userName: string;
    normalizedUserName: string;
    email: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: Date = new Date();
    lockoutEnabled: boolean;
    accessFailedCount: number;
    firstName: string;
    lastName: string;
    altEmail: string;
    cellPhoneNumber1: string;
    afauserLink: string;
    createdBy: string;
    creationDate: Date;
    afaemployee: number;
    afaRole: number;
}