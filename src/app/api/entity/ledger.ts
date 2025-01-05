import { JournalTransaction } from "./journalTransaction";
import { LedgerBalance } from "./ledgerBalance";
import { LedgerGroup } from "./ledgerGroup";
import { LedgerSubGroup } from "./ledgerSubGroup";
import { Party } from "./Party";
import { PaymentTransaction } from "./paymentTransaction";
import { ReceiptTransaction } from "./receiptTransaction";
import { SubLedger } from "./subLedger";

export class LedgerModel {
    ledgerName: string = '';
    ledgerType: string = '';
    hasSubLedger: string = '';
    fk_LedgerGroupId: string = '';
    fk_LedgerSubGroupId?: string;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class Ledger extends LedgerModel {
    ledgerId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    ledgerGroup: LedgerGroup = new LedgerGroup();
    ledgerSubGroup: LedgerSubGroup = new LedgerSubGroup();
    subLedgers: SubLedger[] = [];
    ledgerBalances: LedgerBalance[] = [];
    parties: Party[] = [];
    journals: JournalTransaction[] = [];
    payments: PaymentTransaction[] = [];
    receipts: ReceiptTransaction[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  