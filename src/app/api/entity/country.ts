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
export class CountryDto extends CountryUpdateModel{
    constructor() {
        super();
    }
}

