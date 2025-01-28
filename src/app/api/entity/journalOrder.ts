import { JournalTransactionDto, JournalTransactionModel, JournalTransactionUpdateModel } from "./journalTransaction";

export class JournalOrderModel {
    voucherNo: string;
    voucherDate: Date;
    narration: string;
    totalAmount: number;
    drCr: string;
    fk_BranchId: string;
    fk_FinancialYearId: string;
    journalTransactions?: JournalTransactionModel[];
    constructor() {
        this.voucherNo = '';
        this.voucherDate = new Date();
        this.narration = '';
        this.totalAmount = 0;
        this.drCr = '';
        this.fk_BranchId = '';
        this.fk_FinancialYearId = '';
        this.journalTransactions = [];
    }
}
export class JournalOrderUpdateModel extends JournalOrderModel {
    journalOrderId: string;
    override  journalTransactions?: JournalTransactionUpdateModel[];
    constructor() {
        super();
        this.journalOrderId = '';
        this.journalTransactions = [];
    }
}
export class JournalOrderDto extends JournalOrderUpdateModel {
    override journalTransactions?: JournalTransactionDto[];
    constructor() {
        super();
        this.journalTransactions = [];
    }
}