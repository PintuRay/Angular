
export class AddressModel {
    fk_CountryId: string;
    fk_StateId: string;
    fk_DistId: string;
    fk_UserId: string | null;
    fk_PartyId: string | null;
    fk_LabourId: string | null;
    fk_BranchId: string | null;
    at: string;
    post: string;
    city: string;
    pinCode: string;
    constructor() {
        this.fk_CountryId = '';
        this.fk_StateId = '';
        this.fk_DistId = '';
        this.fk_UserId = null;
        this.fk_PartyId = null;
        this.fk_LabourId = null;
        this.fk_BranchId = null;
        this.at = '';
        this.post = '';
        this.city = '';
        this.pinCode = '';
    }
}

export class AddressUpdateModel extends AddressModel {
    addressId: string;
    constructor() {
        super();
        this.addressId = '';
    }
}
export class AddressDto extends AddressUpdateModel {
    countryName: string;
    stateName: string;
    distName: string;
    constructor() {
        super();
        this.countryName = '';
        this.stateName = '';
        this.distName = '';
    }
} 
