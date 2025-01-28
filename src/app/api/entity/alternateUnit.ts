export class AlternateUnitModel
{
    fK_ProductId: string; 
    alternateUnitName: string;
    fk_UnitId: string;
    unitQuantity: number;
    alternateQuantity: number;
    constructor() {
        this.fK_ProductId = '';
        this.alternateUnitName = '';
        this.fk_UnitId = '';
        this.unitQuantity = 0;
        this.alternateQuantity = 0;
    }
}
export class  AlternateUnitUpdateModel  extends AlternateUnitModel{
    alternateUnitId: string;
    constructor() {
        super();
        this.alternateUnitId = '';
    }
}
export class AlternateUnitDto extends AlternateUnitUpdateModel{
    constructor() {
        super();
    }
}