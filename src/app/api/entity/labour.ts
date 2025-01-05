import { Branch } from "./branch";
import { DamageOrder } from "./damageOrder";
import { LabourOrder } from "./labourOrder";
import { LabourType } from "./labourType";
import { SubLedger } from "./subLedger";

export class LabourModel {
    labourName: string = '';
    fkLabourTypeId?: string;
    fkSubLedgerId: string = '';
    fkBranchId?: string;
    address: string = '';
    phone: string = '';
    reference: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  export class Labour extends LabourModel {
    labourId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    labourType: LabourType = new LabourType();
    branch: Branch = new Branch();
    subLedger: SubLedger = new SubLedger();
    labourOrders: LabourOrder[] = [];
    damageOrders: DamageOrder[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  