export class CountryDto{
    countryId: string;
    countryCode: string;
    countryName: string;
    constructor() {
        this.countryId = '';
        this.countryCode = '';
        this.countryName = '';
    }
}
export class CountryModel {
    countryCode: string;
    countryName: string;
    constructor() {
        this.countryCode = '';
        this.countryName = '';
    }
}
export class CountryUpdateModel extends CountryModel{
    countryId: string;
    constructor() {
        super();
        this.countryId = '';
    }
}

