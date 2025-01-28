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
  
  export class PartyUpdateModel extends PartyModel {
    partyId: string = '';
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  export class PartyDto extends PartyUpdateModel {
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  