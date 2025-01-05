export class UserClaimModel {
    claimType: string;
    claimValue:string;
    isClaimSelected: boolean;
    constructor(){
        this.claimType ='';
        this.claimValue='';
        this.isClaimSelected =false;
    }
}