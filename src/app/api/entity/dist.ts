export class DistDto{
    distId: string;
    fk_CountryId: string;
    countryName: string;
    fk_StateId: string;
    stateName: string;
    distName: string;
    constructor() {
        this.distId = '';
        this.fk_CountryId = '';
        this.countryName ='';
        this.fk_StateId = '';
        this.stateName='';
        this.distName = '';
    }
}
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

