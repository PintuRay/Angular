import { Branch } from "./branch";
import { LedgerDev } from "./ledgerDev";
import { LedgerGroup } from "./ledgerGroup";

export class LedgerSubGroupDevModel {
    fk_LedgerGroupId: string = '';
    fk_BranchId: string = '';
    subGroupName: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LedgerSubGroupDev extends LedgerSubGroupDevModel {
    ledgerSubGroupId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    ledgerGroup: LedgerGroup = new LedgerGroup();
    branch: Branch = new Branch();
    ledgersDev: LedgerDev[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  