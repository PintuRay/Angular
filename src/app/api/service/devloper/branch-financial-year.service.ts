import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.Service';
import { Observable, switchMap } from 'rxjs';
import { Base } from '../../base';
import { PaginationParams } from '../../model/paginationParams';
import { BranchFinancialYearModel, BranchFinancialYearUpdateModel } from '../../entity/branchFinancialYear';

@Injectable()
export class BranchFinancialYearService {
   //#region Constructor
   constructor(
     private http: HttpClient,
     private configService: ConfigService,
   ) { }
   //#endregion
 
   //#region Api
   getAllBranchFinancialYears(): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'getAllBranchFinancialYears')
       .pipe(
         switchMap((endpoint) =>
           this.http.get<Base>(endpoint)
         )
       );
   }
   getBranchFinancialYears(data: PaginationParams): Observable<Base> {
     let params = new HttpParams()
       .set('pageNumber', data.pageNumber.toString())
       .set('pageSize', data.pageSize.toString())
 
     if (data.searchTerm !== null) {
       params = params.set('searchTerm', data.searchTerm);
     }
 
     return this.configService
       .getEndpoint('devloper', 'getBranchFinancialYears')
       .pipe(
         switchMap((endpoint) =>
           this.http.get<Base>(endpoint, { params })
         )
       );
   }
   createBranchFinancialYear(data: BranchFinancialYearModel): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'createBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.post<Base>(endpoint, data))
       );
   }
   bulkCreateBranchFinancialYear(data: BranchFinancialYearModel[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkCreateBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.post<Base>(endpoint, data))
       );
   }
   updateBranchFinancialYear(data: BranchFinancialYearUpdateModel): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'updateBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
       );
   }
   bulkUpdateBranchFinancialYear(data: BranchFinancialYearUpdateModel[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkUpdateBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
       );
   }
   removeBranchFinancialYear(id: string): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'removeBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
       );
   }
   bulkRemoveBranchFinancialYear(Ids: string[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkRemoveBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.put<Base>(endpoint, Ids))
       );
   }
   getRemovedBranchFinancialYears(data: PaginationParams): Observable<Base> {
     let params = new HttpParams()
       .set('pageNumber', data.pageNumber.toString())
       .set('pageSize', data.pageSize.toString())
     if (data.searchTerm !== null) {
       params = params.set('searchTerm', data.searchTerm);
     }
 
     return this.configService
       .getEndpoint('devloper', 'getRemovedBranchFinancialYears')
       .pipe(
         switchMap((endpoint) =>
           this.http.get<Base>(endpoint, { params })
         )
       );
   }
   recoverBranchFinancialYear(id: string): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'recoverBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
       );
   }
   bulkRecoverBranchFinancialYear(Ids: string[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkRecoverBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.put<Base>(endpoint, Ids))
       );
   }
   deleteBranchFinancialYear(Id: string): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'deleteBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.delete<Base>(`${endpoint}/${Id}`))
       );
   }
   bulkDeleteBranchFinancialYear(ids: string[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkDeleteBranchFinancialYear')
       .pipe(
         switchMap((endpoint) =>
           this.http.delete<Base>(endpoint, {
             body: ids
           })
         )
       );
   }
   //#endregion
}
