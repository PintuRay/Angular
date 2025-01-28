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
export class DistDto extends DistUpdateModel{
    constructor() {
        super();
    }
}
