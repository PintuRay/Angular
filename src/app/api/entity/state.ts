export class StateDto{
    stateId: string;
    fk_CountryId: string;
    countryName: string;
    stateName: string;
    constructor() {
        this.stateId = '';
        this.fk_CountryId = '';
        this.countryName = '';
        this.stateName = '';
    }
}
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

