import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.Service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Base } from '../../base';
import { PaginationParams } from '../../model/paginationParams';
import { BranchFinancialYearDto, BranchFinancialYearModel, BranchFinancialYearOperation, BranchFinancialYearUpdateModel, BulkBranchFinancialYearOperation } from '../../entity/branchFinancialYear';

@Injectable()
export class BranchFinancialYearService {
    //#region Property Declaration
    private addUpdateVisibilitySubject = new BehaviorSubject<boolean>(false);
    changeAddUpdateDialogVisibility$ = this.addUpdateVisibilitySubject.asObservable();
    private bulkAddUpdateVisibilitySubject = new BehaviorSubject<boolean>(false);
    changeBulkAddUpdateDialogVisibility$ = this.bulkAddUpdateVisibilitySubject.asObservable();
    private changeRecoverVisibilitySubject = new BehaviorSubject<boolean>(false);
    changeRecoverDialogVisibility$ = this.changeRecoverVisibilitySubject.asObservable();
    private branchFinancialYearSubject = new BehaviorSubject<BranchFinancialYearOperation | null>(null);
    private bulkBranchFinancialYearSubject = new BehaviorSubject<BulkBranchFinancialYearOperation | null>(null);
    private recoverBranchFinancialYearSubject = new BehaviorSubject<BranchFinancialYearOperation | null>(null);
    private bulkRecoverBranchFinancialYearSubject = new BehaviorSubject<BulkBranchFinancialYearOperation | null>(null);
    private operationTypeSubject = new BehaviorSubject<string>('');
    private bulkOperationTypeSubject = new BehaviorSubject<string>('');
    //#endregion
    
   //#region Constructor
   constructor(
     private http: HttpClient,
     private configService: ConfigService,
   ) { }
   //#endregion
 
   //#region Api
   getAll(): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'getAllBranchFinancialYears')
       .pipe(
         switchMap((endpoint) =>
           this.http.get<Base>(endpoint)
         )
       );
   }
   get(data: PaginationParams): Observable<Base> {
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
   create(data: BranchFinancialYearModel): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'createBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.post<Base>(endpoint, data))
       );
   }
   bulkCreate(data: BranchFinancialYearModel[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkCreateBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.post<Base>(endpoint, data))
       );
   }
   update(data: BranchFinancialYearUpdateModel): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'updateBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
       );
   }
   bulkUpdate(data: BranchFinancialYearUpdateModel[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkUpdateBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
       );
   }
   remove(id: string): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'removeBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
       );
   }
   bulkRemove(data: BranchFinancialYearDto[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkRemoveBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.put<Base>(endpoint, data))
       );
   }
   getRemoved(data: PaginationParams): Observable<Base> {
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
   recover(id: string): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'recoverBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
       );
   }
   bulkRecover(data: BranchFinancialYearDto[]): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'bulkRecoverBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.put<Base>(endpoint, data))
       );
   }
   delete(Id: string): Observable<Base> {
     return this.configService
       .getEndpoint('devloper', 'deleteBranchFinancialYear')
       .pipe(
         switchMap((endpoint) => this.http.delete<Base>(`${endpoint}/${Id}`))
       );
   }
   bulkDelete(ids: string[]): Observable<Base> {
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

 //#region component service
 showAddUpdatedDialog(){
  this.addUpdateVisibilitySubject.next(true);
 }
 hideAddUpdateDialog(){
  this.addUpdateVisibilitySubject.next(false);
 }
 showBulkAddUpdatedDialog(){
  this.bulkAddUpdateVisibilitySubject.next(true);
 }
 hidBulkeAddUpdateDialog(){
  this.bulkAddUpdateVisibilitySubject.next(false);
 }
  showRecoverDialog() {
    this.changeRecoverVisibilitySubject.next(true);
  }
  hideRecoverDialog() {
    this.changeRecoverVisibilitySubject.next(false);
  }
  setOperationType(operationType: string) {
    this.operationTypeSubject.next(operationType);
  }
  getOperationType(): Observable<string> {
    return this.operationTypeSubject.asObservable();
  }
  setBulkOperationType(operationType: string) {
    this.bulkOperationTypeSubject.next(operationType);
  }
  getBulkOperationType(): Observable<string> {
    return this.bulkOperationTypeSubject.asObservable();
  }
  setBranchFinanancialYear(financialYearOperation: BranchFinancialYearOperation): void {
    this.branchFinancialYearSubject.next(financialYearOperation);
  }
  getBranchFinanancialYear(): Observable<BranchFinancialYearOperation | null> {
    return this.branchFinancialYearSubject.asObservable();
  }
  setBulkBranchFinanancialYear(financialYearOperation: BulkBranchFinancialYearOperation): void {
    this.bulkBranchFinancialYearSubject.next(financialYearOperation);
  }
  getBulkBranchFinanancialYear(): Observable<BulkBranchFinancialYearOperation | null> {
    return this.bulkBranchFinancialYearSubject.asObservable();
  }
  setRecoverBranchFinanancialYear(financialYearOperation: BranchFinancialYearOperation): void {
    this.recoverBranchFinancialYearSubject.next(financialYearOperation);
  }
  getRecoverBranchFinanancialYear(): Observable<BranchFinancialYearOperation | null> {
    return this.recoverBranchFinancialYearSubject.asObservable();
  }
  setBulkRecoverBranchFinanancialYear(financialYearOperation: BulkBranchFinancialYearOperation): void {
    this.bulkRecoverBranchFinancialYearSubject.next(financialYearOperation);
  }
  getBulkRecoverBranchFinanancialYear(): Observable<BulkBranchFinancialYearOperation | null> {
    return this.bulkRecoverBranchFinancialYearSubject.asObservable();
  }
  //#endregion
  }
