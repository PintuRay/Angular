export class AddressDto{
    addressId: string;
    fk_CountryId: string;
    countryName:string;
    fk_StateId: string;
    stateName:string;
    fk_DistId: string;
    distName:string;
    at: string;
    post: string;
    city: string;
    pinCode: string;
    constructor() {
        this.addressId='';
        this.fk_CountryId = '';
        this.countryName ='';
        this.fk_StateId = '';
        this.stateName ='';
        this.fk_DistId = '';
        this.distName ='';
        this.at = '';
        this.post = '';
        this.city = '';
        this.pinCode = '';
    }
}

export class AddressModel {
    fk_CountryId: string;
    fk_StateId: string;
    fk_DistId: string;
    at: string;
    post: string;
    city: string;
    pinCode: string;
    constructor() {
        this.fk_CountryId = '';
        this.fk_StateId = '';
        this.fk_DistId = '';
        this.at = '';
        this.post = '';
        this.city = '';
        this.pinCode = '';
    }
}

export class AddressUpdateModel extends AddressModel{
    addressId: string;
    constructor() {
        super();
        this.addressId='';
    }
}

