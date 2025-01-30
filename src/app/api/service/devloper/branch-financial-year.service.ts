import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.Service';

@Injectable()
export class BranchFinancialYearService {
   //#region Constructor
   constructor(
     private http: HttpClient,
     private configService: ConfigService,
   ) { }
   //#endregion
 
   //#region Api
 
   //#endregion
}
