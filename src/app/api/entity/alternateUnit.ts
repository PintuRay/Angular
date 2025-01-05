import { Product } from "./product";
import { PurchaseReturnTransaction } from "./purchaseReturnTransaction";
import { PurchaseTransaction } from "./purchaseTransaction";
import { Unit } from "./unit";

export class AlternateUnitModel
{
    alternateUnitName: string;
    alternateQuantity: number;
    fkProductId: string; 
    fkUnitId: string;
    unitQuantity: number;
    constructor() {
        this.alternateUnitName = '';
        this.alternateQuantity = 0;
        this.fkProductId = '';
        this.fkUnitId = '';
        this.unitQuantity = 0;
    }
}
export class  AlternateUnit  extends AlternateUnitModel{
    alternateUnitId: string;
    isActive?: boolean; 
    createdDate?: Date; 
    modifyDate?: Date; 
    createdBy?: string; 
    modifyBy?: string; 
    product?: Product; 
    unit?: Unit; 
    purchaseTransactions?: PurchaseTransaction[]; 
    purchaseReturnTransactions?: PurchaseReturnTransaction[]; 
    constructor() {
        super();
        this.alternateUnitId = '';
        this.isActive = true;
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.purchaseTransactions = [];
        this.purchaseReturnTransactions = [];
    }
}