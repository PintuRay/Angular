import { Branch } from './branch';
import { FinancialYear } from './financialYear';
import { JournalTransaction } from './journalTransaction';

export class JournalOrderModel {
    voucherNo: string;
    voucherDate: Date;
    narration: string;
    totalAmount: number;
    drCr: string;
    fk_BranchId: string;
    fk_FinancialYearId: string;
    journalTransactions?: JournalTransaction[];

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
export class JournalOrder extends JournalOrderModel {
    journalOrderId: string;
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    branch?: Branch;
    financialYear?: FinancialYear;

    constructor() {
        super();
        this.journalOrderId = '';
        this.isActive = true;
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.branch = new Branch();
        this.financialYear = new FinancialYear();
    }
}
