import { Address } from './address';
import { Dist } from './dist';
import { Party } from './Party';
import { State } from './state';

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
export class Country extends CountryUpdateModel {

    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    addresses?: Address[];
    parties?: Party[];
    states?: State[];
    dists?: Dist[];
    constructor() {
        super();
        this.isActive = false;
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.addresses = [];
        this.parties = [];
        this.states = [];
        this.dists = [];
    }
}
