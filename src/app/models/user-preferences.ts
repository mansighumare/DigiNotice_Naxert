export class UserPreferences {
    userId: number;
    notificationPreferences: Array<number>;
}

export enum NotificationPreferenceEnum {
    Email = 1,
    Sms = 2,
    InApp = 3,
}

export class NotificationPreferenceDto {
    id: number;
    userId: number;
    notificationTypeId: number;
}