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
export class Country extends CountryModel {
    countryId: string;
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
        this.countryId = '';
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
