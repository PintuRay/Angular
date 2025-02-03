import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.Service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Base } from '../../base';
import { PaginationParams } from '../../model/paginationParams';
import { FinancialYearDto, FinancialYearModel, FinancialYearOperation, FinancialYearUpdateModel, RecoverFinancialYearOperation } from '../../entity/financialYear';
@Injectable()
export class FinancialYearService {
  //#region Property Declaration
  private changeRecoverVisibilitySubject = new BehaviorSubject<boolean>(false);
  changeRecoverDialogVisibility$ = this.changeRecoverVisibilitySubject.asObservable();
  private operationTypeSubject = new BehaviorSubject<string>('');
  private financialYearSubject = new BehaviorSubject<FinancialYearOperation | null>(null);
  private recoverFinancialYearSubject = new BehaviorSubject<RecoverFinancialYearOperation | null>(null);
  //#endregion

  //#region Constructor
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) { }
  //#endregion

  //#region Api
  getAllFinancialYears(): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'getAllFinancialYears')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint)
        )
      );
  }
  getFinancialYears(data: PaginationParams): Observable<Base> {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())

    if (data.searchTerm !== null) {
      params = params.set('searchTerm', data.searchTerm);
    }

    return this.configService
      .getEndpoint('devloper', 'getFinancialYears')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint, { params })
        )
      );
  }
  createFinancialYear(data: FinancialYearModel): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'createFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.post<Base>(endpoint, data))
      );
  }
  bulkCreateFinancialYear(data: FinancialYearModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkCreateFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.post<Base>(endpoint, data))
      );
  }
  updateFinancialYear(data: FinancialYearUpdateModel): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'updateFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
      );
  }
  bulkUpdateFinancialYear(data: FinancialYearUpdateModel[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkUpdateFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, data))
      );
  }
  removeFinancialYear(id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'removeFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
      );
  }
  bulkRemoveFinancialYear(Ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkRemoveFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(endpoint, Ids))
      );
  }
  getRemovedFinancialYears(data: PaginationParams): Observable<Base> {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())
    if (data.searchTerm !== null) {
      params = params.set('searchTerm', data.searchTerm);
    }

    return this.configService
      .getEndpoint('devloper', 'getRemovedFinancialYears')
      .pipe(
        switchMap((endpoint) =>
          this.http.get<Base>(endpoint, { params })
        )
      );
  }
  recoverFinancialYear(id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'recoverFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(`${endpoint}/${id}`, {}))
      );
  }
  bulkRecoverFinancialYear(Ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkRecoverFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.put<Base>(endpoint, Ids))
      );
  }
  deleteFinancialYear(Id: string): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'deleteFinancialYear')
      .pipe(
        switchMap((endpoint) => this.http.delete<Base>(`${endpoint}/${Id}`))
      );
  }
  bulkDeleteFinancialYear(ids: string[]): Observable<Base> {
    return this.configService
      .getEndpoint('devloper', 'bulkDeleteFinancialYear')
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
  setfinancialYear(financialYearOperation: FinancialYearOperation): void {
    this.financialYearSubject.next(financialYearOperation);
  }
  getFinanancialYear(): Observable<FinancialYearOperation | null> {
    return this.financialYearSubject.asObservable();
  }
  setRecoverfinancialYear( recoverFinancialYearOperation: RecoverFinancialYearOperation): void {
    this.recoverFinancialYearSubject.next(recoverFinancialYearOperation);
  }
  getRecoverFinanancialYear(): Observable<RecoverFinancialYearOperation | null> {
    return this.recoverFinancialYearSubject.asObservable();
  }
  //#endregion
}
