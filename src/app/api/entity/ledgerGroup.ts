import { JournalTransaction } from "./journalTransaction";
import { Ledger } from "./ledger";
import { LedgerDev } from "./ledgerDev";
import { LedgerSubGroup } from "./ledgerSubGroup";
import { LedgerSubGroupDev } from "./ledgerSubGroupDev";
import { PaymentTransaction } from "./paymentTransaction";
import { ReceiptTransaction } from "./receiptTransaction";

export class LedgerGroupModel {
    groupName: string = '';
    groupAlias: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LedgerGroup extends LedgerGroupModel {
    ledgerGroupId: string = '';
    ledgerSubGroups: LedgerSubGroup[] = [];
    ledgerSubGroupsDev: LedgerSubGroupDev[] = [];
    ledgers: Ledger[] = [];
    ledgersDev: LedgerDev[] = [];
    journalTransactions: JournalTransaction[] = [];
    paymentTransactions: PaymentTransaction[] = [];
    receiptTransactions: ReceiptTransaction[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  