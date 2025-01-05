import { Country } from "./country";
import { Dist } from "./dist";
import { LedgerDev } from "./ledgerDev";
import { State } from "./state";
import { SubLedger } from "./subLedger";

export class PartyModel {
    fk_PartyType: string = '';
    fk_SubledgerId: string = '';
    fk_StateId: string = '';
    fk_CityId: string = '';
    partyName: string = '';
    address: string = '';
    phone: string = '';
    email: string = '';
    gstNo: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class Party extends PartyModel {
    partyId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    country: Country = new Country();
    state: State = new State();
    city: Dist = new Dist();
    ledgerDev: LedgerDev = new LedgerDev();
    subLedger: SubLedger = new SubLedger();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  