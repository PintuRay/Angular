import { Labour } from "./labour";
import { LabourOrder } from "./labourOrder";

export class LabourTypeModel {
    labourType: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LabourType extends LabourTypeModel {
    labourTypeId: string = '';
    labours: Labour[] = [];
    labourOrders: LabourOrder[] = [];
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  