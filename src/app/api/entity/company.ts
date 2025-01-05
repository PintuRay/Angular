import { Branch } from "./branch";

export class CompanyModel
{
    fk_BranchId: string; 
    companyName: string;
    state: string;
    address: string; 
    email: string;
    phoneNo: string;
    gstin: string;
    logo: string;

    constructor() {
        this.fk_BranchId = '';
        this.companyName = '';
        this.state = '';
        this.address = '';
        this.email = '';
        this.phoneNo = '';
        this.gstin = '';
        this.logo = '';
    }
}
export class  Company extends CompanyModel{
    companyId: string; 
    isActive?: boolean;
    createdDate?: Date; 
    modifyDate?: Date; 
    createdBy?: string; 
    modifyBy?: string; 
    branch?: Branch; 
    constructor() {
        super();
        this.companyId = '';
        this.isActive = true; 
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.branch = new Branch();
    }
}