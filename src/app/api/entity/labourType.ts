export class LabourTypeModel {
    labourType: string = '';
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class LabourTypeUpdateModel extends LabourTypeModel {
    labourTypeId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class LabourTypeDto extends LabourTypeUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  