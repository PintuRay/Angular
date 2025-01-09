import { Address } from "./address";
import { Country } from "./country";
import { Dist } from "./dist";
import { Party } from "./Party";

export class StateModel {
    fk_CountryId: string;
    stateName: string;
    constructor() {
        this.fk_CountryId = '';
        this.stateName = '';
    }
}
export class StateUpdateModel extends StateModel {
    stateId: string;
    constructor() {
        super();
        this.stateId = '';
    }
}
export class State extends StateUpdateModel {
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    country?: Country;
    addresses?: Address[];
    parties?: Party[];
    dists?: Dist[];
    constructor() {
        super();
        this.isActive = false;
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.country = new Country();
        this.addresses = [];
        this.dists = [];
    }
}
