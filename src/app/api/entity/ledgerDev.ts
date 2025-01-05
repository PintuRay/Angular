import { JournalTransaction } from "./journalTransaction";
import { LedgerBalance } from "./ledgerBalance";
import { LedgerGroup } from "./ledgerGroup";
import { LedgerSubGroupDev } from "./ledgerSubGroupDev";
import { Party } from "./Party";
import { PaymentTransaction } from "./paymentTransaction";
import { ReceiptTransaction } from "./receiptTransaction";
import { SubLedger } from "./subLedger";

export class LedgerDevModel {
    ledgerName: string = '';
    ledgerType: string = '';
    hasSubLedger: string = '';
    fk_LedgerGroupId: string = '';
    fk_LedgerSubGroupId?: string;
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LedgerDev extends LedgerDevModel {
    ledgerId: string = '';
    ledgerGroup: LedgerGroup = new LedgerGroup();
    ledgerSubGroup: LedgerSubGroupDev = new LedgerSubGroupDev();
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
  