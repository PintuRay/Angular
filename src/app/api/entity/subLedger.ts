import { Branch } from "./branch";
import { JournalTransaction } from "./journalTransaction";
import { Labour } from "./labour";
import { Ledger } from "./ledger";
import { LedgerDev } from "./ledgerDev";
import { Party } from "./Party";
import { PaymentTransaction } from "./paymentTransaction";
import { PurchaseOrder } from "./purchaseOrder";
import { PurchaseReturnOrder } from "./purchaseReturnOrder";
import { ReceiptTransaction } from "./receiptTransaction";
import { SalesOrder } from "./salesOrder";
import { SalesReturnOrder } from "./salesReturnOrder";
import { SubLedgerBalance } from "./subLedgerBalance";

export class SubLedgerModel {
    fk_LedgerId: string = '';
    fk_BranchId?: string;
    subLedgerName: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class SubLedger extends SubLedgerModel {
    subLedgerId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    ledger: Ledger = new Ledger();
    ledgerDev: LedgerDev = new LedgerDev();
    branch: Branch = new Branch();
    subLedgerBalances: SubLedgerBalance[] = [];
    labours: Labour[] = [];
    parties: Party[] = [];
    journalTransactions: JournalTransaction[] = [];
    paymentTransactions: PaymentTransaction[] = [];
    receiptTransactions: ReceiptTransaction[] = [];
    salesOrders: SalesOrder[] = [];
    purchaseOrders: PurchaseOrder[] = [];
    salesReturnOrders: SalesReturnOrder[] = [];
    purchaseReturnOrders: PurchaseReturnOrder[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  