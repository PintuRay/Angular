
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
export class StateDto extends StateUpdateModel {
    constructor() {
        super();
    }
}

