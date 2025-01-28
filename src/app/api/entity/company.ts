export class CompanyModel {
    fk_BranchId: string;
    companyName: string;
    state: string;
    address: string;
    email: string;
    phoneNo: string;
    gstin: string;
    logo: File | null;
    logoPath: string;
    constructor() {
        this.fk_BranchId = '';
        this.companyName = '';
        this.state = '';
        this.address = '';
        this.email = '';
        this.phoneNo = '';
        this.gstin = '';
        this.logoPath = '';
        this.logo = new File([], '');
    }
}
export class CompanyUpdateModel extends CompanyModel {
    companyId: string;
    constructor() {
        super();
        this.companyId = '';
    }
}
export class CompanyDto extends CompanyUpdateModel {
    constructor() {
        super();
    }
}