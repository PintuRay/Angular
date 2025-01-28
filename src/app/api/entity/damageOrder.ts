import { DamageTransactionDto, DamageTransactionModel, DamageTransactionUpdateModel } from "./damageTransaction";

export class DamageOrderModel {
    transactionNo: string;
    transactionDate: Date;
    fk_ProductTypeId: string;
    fk_LabourId?: string;
    fk_BranchId: string;
    fk_FinancialYearId: string;
    totalAmount: number;
    reason?: string;
    damageTransactions: DamageTransactionModel[];
    constructor() {
        this.transactionNo = '';
        this.transactionDate = new Date();
        this.fk_ProductTypeId = '';
        this.fk_LabourId = undefined;
        this.fk_BranchId = '';
        this.fk_FinancialYearId = '';
        this.totalAmount = 0;
        this.reason = '';
        this.damageTransactions = [];
    }
}
export class DamageOrderUpdateModel extends DamageOrderModel {
    damageOrderId: string;
    override damageTransactions: DamageTransactionUpdateModel[];
    constructor() {
        super();
        this.damageOrderId = '';
        this.damageTransactions =[];
    }
}
export class  DamageOrderDto extends DamageOrderUpdateModel{
    override damageTransactions: DamageTransactionDto[];
    constructor() {
        super();
        this.damageTransactions = [];
    }
}