import { AlternateUnit } from "./alternateUnit";
import { Product } from "./product";

export class UnitModel {
    unitName: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class Unit extends UnitModel {
    unitId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    products: Product[] = [];
    alternateUnits: AlternateUnit[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  