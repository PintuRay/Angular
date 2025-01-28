export class UnitModel {
    unitName: string = '';
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class UnitUpdateModel extends UnitModel {
    unitId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class UnitDto extends UnitUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  