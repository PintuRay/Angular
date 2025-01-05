import { Country } from './country';
import { Dist } from './dist';
import { State } from './state';

export class AddressModel {
    fk_CountryId: string;
    fk_StateId: string;
    fk_DistId: string;
    at: string;
    post: string;
    city: string;
    pinCode: string;
    constructor() {
        this.fk_CountryId = '';
        this.fk_StateId = '';
        this.fk_DistId = '';
        this.at = '';
        this.post = '';
        this.city = '';
        this.pinCode = '';
    }
}
export class Address extends AddressModel {
    public userId: string;
    public addressId: string;
    public isActive?: boolean;
    public createdDate?: Date;
    public modifyDate?: Date;
    public createdBy?: string;
    public modifyBy?: string;
    public country?: Country;
    public state?: State;
    public dist?: Dist;
    constructor() {
        super();
        this.userId = '';
        this.addressId = '';
        this.isActive = false;
        this.createdDate = new Date();
        this.modifyDate = new Date();
        this.createdBy = '';
        this.modifyBy = '';
        this.country = new Country();
        this.state = new State();
        this.dist = new Dist();
    }
}
