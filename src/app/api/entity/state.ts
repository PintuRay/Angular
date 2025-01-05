import { Address } from "./address";
import { Country } from "./country";
import { Dist } from "./dist";
import { Party } from "./Party";

export class StateModel {
    fk_CountryId: string;
    stateName: string;
    constructor() {
        this.fk_CountryId = '';
        this.stateName ='';
    }
}
export class State extends StateModel {
    stateId:string;
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    country?: Country;
    addresses?: Address[];
    parties?: Party[];
    dists?:Dist[];
    constructor() {
        super();
        this.stateId = '';
        this.isActive = false;
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.country = new Country();
        this.addresses = [];
        this.dists=[];
    }
}
