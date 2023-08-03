export class ContactUs {
    name: string;
    email: string;
    phone: string;
    contactMeBy: ContactPreference;
    subject: string;
    message: string;
}

export enum ContactPreference {
    Email = 1,
    Phone = 2,
}