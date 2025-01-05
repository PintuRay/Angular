import { BranchFinancialYear } from "./branchFinancialYear";
import { DamageOrder } from "./damageOrder";
import { DamageTransaction } from "./damageTransaction";
import { InwardSupplyOrder } from "./inwardSupplyOrder";
import { InwardSupplyTransaction } from "./inwardSupplyTransaction";
import { JournalOrder } from "./journalOrder";
import { JournalTransaction } from "./journalTransaction";
import { LabourOrder } from "./labourOrder";
import { LabourRate } from "./labourRate";
import { LabourTransaction } from "./labourTransaction";
import { LedgerBalance } from "./ledgerBalance";
import { OutwardSupplyOrder } from "./outwardSupplyOrder";
import { OutwardSupplyTransaction } from "./outwardSupplyTransaction";
import { PaymentOrder } from "./paymentOrder";
import { PaymentTransaction } from "./paymentTransaction";
import { PurchaseOrder } from "./purchaseOrder";
import { PurchaseReturnOrder } from "./purchaseReturnOrder";
import { PurchaseReturnTransaction } from "./purchaseReturnTransaction";
import { PurchaseTransaction } from "./purchaseTransaction";
import { ReceiptOrder } from "./receiptOrder";
import { ReceiptTransaction } from "./receiptTransaction";
import { SalesOrder } from "./salesOrder";
import { SalesReturnOrder } from "./salesReturnOrder";
import { SalesReturnTransaction } from "./salesReturnTransaction";
import { SalesTransaction } from "./salesTransaction";
import { Stock } from "./stock";
import { SubLedgerBalance } from "./subLedgerBalance";

export class FinancialYearModel
{
    financial_Year: string;
    startDate: Date;
    endDate: Date;

    constructor() {
        this.financial_Year = '';
        this.startDate = new Date();
        this.endDate = new Date();
    }
}
export class  FinancialYear extends FinancialYearModel{
    financialYearId: string; 
    isActive?: boolean; 
    createdDate?: Date; 
    modifyDate?: Date; 
    createdBy?: string; 
    modifyBy?: string; 
    branchFinancialYears?: BranchFinancialYear[]; 
    stocks?: Stock[]; 
    labourRates?: LabourRate[]; 
    labourOrders?: LabourOrder[]; 
    labourTransactions?: LabourTransaction[]; 
    ledgerBalances?: LedgerBalance[]; 
    subLedgerBalances?: SubLedgerBalance[]; 
    journalOrders?: JournalOrder[]; 
    journalTransactions?: JournalTransaction[];
    paymentOrders?: PaymentOrder[]; 
    paymentTransactions?: PaymentTransaction[]; 
    receiptOrders?: ReceiptOrder[]; 
    receiptTransactions?: ReceiptTransaction[]; 
    purchaseOrders?: PurchaseOrder[]; 
    salesOrders?: SalesOrder[]; 
    purchaseTransactions?: PurchaseTransaction[]; 
    salesTransactions?: SalesTransaction[]; 
    salesReturnOrders?: SalesReturnOrder[]; 
    purchaseReturnOrders?: PurchaseReturnOrder[]; 
    salesReturnTransactions?: SalesReturnTransaction[]; 
    purchaseReturnTransactions?: PurchaseReturnTransaction[]; 
    inwardSupplyOrders?: InwardSupplyOrder[]; 
    outwardSupplyOrders?: OutwardSupplyOrder[]; 
    inwardSupplyTransactions?: InwardSupplyTransaction[]; 
    outwardSupplyTransactions?: OutwardSupplyTransaction[]; 
    damageOrders?: DamageOrder[]; 
    damageTransactions?: DamageTransaction[]; 

    constructor() {
        super();
        this.financialYearId = '';
        this.isActive = true; 
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = ''; 
        this.modifyBy = ''; 
        this.branchFinancialYears = [];
        this.stocks = [];
        this.labourRates = [];
        this.labourOrders = [];
        this.labourTransactions = [];
        this.ledgerBalances = [];
        this.subLedgerBalances = [];
        this.journalOrders = [];
        this.journalTransactions = [];
        this.paymentOrders = [];
        this.paymentTransactions = [];
        this.receiptOrders = [];
        this.receiptTransactions = [];
        this.purchaseOrders = [];
        this.salesOrders = [];
        this.purchaseTransactions = [];
        this.salesTransactions = [];
        this.salesReturnOrders = [];
        this.purchaseReturnOrders = [];
        this.salesReturnTransactions = [];
        this.purchaseReturnTransactions = [];
        this.inwardSupplyOrders = [];
        this.outwardSupplyOrders = [];
        this.inwardSupplyTransactions = [];
        this.outwardSupplyTransactions = [];
        this.damageOrders = [];
        this.damageTransactions = [];
    }
}