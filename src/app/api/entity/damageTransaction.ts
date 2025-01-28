export class DamageTransactionModel {
    fk_DamageOrderId: string;
    transactionNo: string;
    transactionDate: Date;
    fk_ProductId: string;
    fk_BranchId: string;
    fk_FinancialYearId: string;
    quantity: number;
    rate: number;
    amount: number;
    constructor() {
        this.fk_DamageOrderId = '';
        this.transactionNo = '';
        this.transactionDate = new Date();
        this.fk_ProductId = '';
        this.fk_BranchId = '';
        this.fk_FinancialYearId = '';
        this.quantity = 0;
        this.rate = 0;
        this.amount = 0;
    }
}
export class DamageTransactionUpdateModel extends DamageTransactionModel {
    damageTransactionId: string;
    constructor() {
        super();
        this.damageTransactionId = '';
    }
}
export class DamageTransactionDto extends DamageTransactionUpdateModel {
    constructor() {
        super();
    }
}