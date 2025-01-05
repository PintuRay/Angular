import { Branch } from "./branch";
import { Ledger } from "./ledger";
import { LedgerGroup } from "./ledgerGroup";

export class LedgerSubGroupModel {
    fk_LedgerGroupId: string = '';
    fk_BranchId: string = '';
    subGroupName: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LedgerSubGroup extends LedgerSubGroupModel {
    ledgerSubGroupId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    ledgerGroup: LedgerGroup = new LedgerGroup();
    branch: Branch = new Branch();
    ledgers: Ledger[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  