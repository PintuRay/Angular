
export class LabourModel {
  labourName: string;
  fk_Labour_TypeId: string;
  fk_SubLedgerId: string;
  fk_BranchId: string;
  fk_AddressId: string;
  phone: string;
  reference: string;
  constructor() {
    this.labourName = '';
    this.fk_Labour_TypeId = '';
    this.fk_SubLedgerId = '';
    this.fk_BranchId = '';
    this.fk_AddressId = '';
    this.phone = '';
    this.reference = '';
  }
}
export class LabourUpdateModel extends LabourModel {
  labourId: string
  constructor() {
    super();
    this.labourId = '';
  }
}
export class LabourDto extends LabourUpdateModel{
  constructor() {
    super();
  }
}