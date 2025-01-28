export class InwardSupplyTransactionModel {
    fk_InwardSupplyOrderId: string;
    transactionNo: string;
    transactionDate: Date;
    fk_ProductId: string;
    fk_BranchId: string;
    fk_FinancialYearId: string;
    quantity: number;
    rate: number;
    amount: number;
    constructor() {
        this.fk_InwardSupplyOrderId = '';
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
export class InwardSupplyTransactionUpdateModel extends InwardSupplyTransactionModel {
    inwardSupplyTransactionId: string;
    constructor() {
        super();
        this.inwardSupplyTransactionId = '';
    }
}
export class InwardSupplyTransactionDto extends InwardSupplyTransactionUpdateModel {
    constructor() {
        super();
    }
}