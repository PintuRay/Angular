import { Address } from './address';
import { Country } from './country';
import { Party } from './Party';
import { State } from './state';

export class DistModel {
    fk_CountryId: string;
    fk_StateId: string;
    distName: string;
    constructor() {
        this.fk_CountryId = '';
        this.fk_StateId = '';
        this.distName = '';
    }
}
export class DistUpdateModel extends DistModel{
    distId: string;
    constructor() {
        super();
        this.distId = '';
    }
}
export class Dist extends DistUpdateModel {
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    country?: Country;
    state?: State;
    addresses?: Address[];
    parties?: Party[];
    constructor() {
        super();
        this.distId = '';
        this.isActive = false;
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.state = new State();
        this.addresses = [];
        this.parties= [];
    }
}
