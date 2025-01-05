import { Branch } from './branch';
import { FinancialYear } from './financialYear';
import { JournalOrder } from './journalOrder';
import { Ledger } from './ledger';
import { LedgerDev } from './ledgerDev';
import { LedgerGroup } from './ledgerGroup';
import { SubLedger } from './subLedger';

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
export class JournalTransaction extends JournalTransactionModel {
    journalId: string;
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    ledgerGroup?: LedgerGroup;
    ledger?: Ledger;
    ledgerDev?: LedgerDev;
    subLedger?: SubLedger;
    branch?: Branch;
    financialYear?: FinancialYear;
    journalOrder?: JournalOrder;

    constructor() {
        super();
        this.journalId = '';
        this.isActive = true;
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.ledgerGroup = new LedgerGroup();
        this.ledger = new Ledger();
        this.ledgerDev = new LedgerDev();
        this.subLedger = new SubLedger();
        this.branch = new Branch();
        this.financialYear = new FinancialYear();
        this.journalOrder = new JournalOrder();
    }
}
