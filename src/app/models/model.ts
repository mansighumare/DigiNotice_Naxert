export class LandCategory {
    id: number;
    name: string;
    displayName: string;
    sortOrder: number;
}

export class NewsPaper {
    id: number;
    name: string;
    edition: string;
}

//Dummy models
export class DataEntry {
    id: number;
    name: string;
    email: string;
    password: string;
}

export class ContactInfo {
    id: number;
    name: string;
    email: string;
    password: string;
}

export class Country {
    id: number;
    name: string;
    code: string;
}
export class State {
    id: number;
    name: string;
    stateCode: string;
    countryId: number;
    countryName: string;
}
// export class District {
//     id: number;
//     name: string;
//     stateId: number;
//     stateName: string;
// }
export class City {
    id: number;
    name: string;
    stateId: number;
    cityCode: string;
    isSelected: boolean;
}
export class Taluka {
    id: number;
    name: string;
    cityId: number;
    // districtId: number;
    // districtName: string;
}
export class Village {
    id: number;
    talukaId: number;
    name: string;
}

export class UnitType {
    id: number;
    displayName: string;
    description: string;
    unitName: string;
}


export class Keyword {
    id: number;
    name: string;
    description: string;
}