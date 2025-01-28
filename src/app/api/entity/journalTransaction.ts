export class JournalTransactionModel {
    transactionId?: string;
    transactionNo?: string;
    fk_JournalOrderId: string;
    fk_LedgerGroupId: string;
    fk_LedgerId: string;
    fk_SubLedgerId?: string;
    fk_BranchId: string;
    fk_FinancialYearId: string;
    amount: number;
    drCr: string;

    constructor() {
        this.transactionId = '';
        this.transactionNo = '';
        this.fk_JournalOrderId = '';
        this.fk_LedgerGroupId = '';
        this.fk_LedgerId = '';
        this.fk_SubLedgerId = '';
        this.fk_BranchId = '';
        this.fk_FinancialYearId = '';
        this.amount = 0;
        this.drCr = '';
    }
}
export class JournalTransactionUpdateModel extends JournalTransactionModel {
    journalId: string;
    constructor() {
        super();
        this.journalId = '';
    }
}
export class JournalTransactionDto extends JournalTransactionUpdateModel{
    constructor() {
        super();
    }
}