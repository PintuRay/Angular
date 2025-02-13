import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.Service';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { Base } from '../../../model/base';
import { PaginationParams } from '../../../model/paginationParams';
import { FinancialYearModel, FinancialYearOperation, FinancialYearUpdateModel, RecoverFinancialYearOperation } from '../../../entity/financialYear';
import { FinancialYearMessageService } from './financial-year-messsage.service';
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
    private errorHandler: FinancialYearMessageService
  ) { }
  //#endregion

  //#region Api
  private handleApiError(error: HttpErrorResponse): Observable<never> {
    this.errorHandler.handleApiError(error);
    return throwError(() => error);
  }
  private buildHttpParams = (data: PaginationParams): HttpParams => {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString());

    if (data.searchTerm) {
      params = params.set('searchTerm', data.searchTerm);
    }
    return params;
  }
  private createHttpRequest<T>(methodType: string, endpointKey: string, data?: any, params?: HttpParams, id?: string): Observable<Base> {
    return this.configService.getEndpoint('devloper', endpointKey).pipe(
      switchMap(endpoint => {
        let url = endpoint;
        if (id) {
          url = `${endpoint}/${id}`;
        }
        switch (methodType) {
          case 'GET':
            return this.http.get<Base>(url, { params });
          case 'POST':
            return this.http.post<Base>(url, data);
          case 'PUT':
            return this.http.put<Base>(url, data || {});
          case 'PATCH':
            return this.http.patch<Base>(url, data);
          case 'DELETE':
            return this.http.delete<Base>(url, { body: data });
          default:
            throw new Error('Invalid HTTP method');
        }
      }),
      catchError(this.handleApiError.bind(this))
    );
  }

  public getAll = (): Observable<Base> => this.createHttpRequest('GET', 'getAllFinancialYears');
  public get = (data: PaginationParams): Observable<Base> => this.createHttpRequest('GET', 'getFinancialYears', null, this.buildHttpParams(data));
  public create = (data: FinancialYearModel): Observable<Base> => this.createHttpRequest('POST', 'createFinancialYear', data);
  public bulkCreate = (data: FinancialYearModel[]): Observable<Base> => this.createHttpRequest('POST', 'bulkCreateFinancialYear', data);
  public update = (data: FinancialYearUpdateModel): Observable<Base> => this.createHttpRequest('PATCH', 'updateFinancialYear', data);
  public bulkUpdate = (data: FinancialYearUpdateModel[]): Observable<Base> => this.createHttpRequest('PATCH', 'bulkUpdateFinancialYear', data);
  public remove = (id: string): Observable<Base> => this.createHttpRequest('PUT', 'removeFinancialYear', {}, undefined, id);
  public bulkRemove = (data: FinancialYearUpdateModel[]): Observable<Base> => this.createHttpRequest('PUT', 'bulkRemoveFinancialYear', data);
  public getRemoved = (data: PaginationParams): Observable<Base> => this.createHttpRequest('GET', 'getRemovedFinancialYears', null, this.buildHttpParams(data))
  public recover = (id: string): Observable<Base> => this.createHttpRequest('PUT', 'recoverFinancialYear', {}, undefined, id);
  public bulkRecover = (data: FinancialYearUpdateModel[]): Observable<Base> => this.createHttpRequest('PUT', 'bulkRecoverFinancialYear', data);
  public delete = (id: string): Observable<Base> => this.createHttpRequest('DELETE', 'deleteFinancialYear', null, undefined, id)
  public bulkDelete = (ids: string[]): Observable<Base> => this.createHttpRequest('DELETE', 'bulkDeleteFinancialYear', ids);
  //#endregion

  //#region component service
  public showRecoverDialog = () => this.changeRecoverVisibilitySubject.next(true);
  public hideRecoverDialog = () => this.changeRecoverVisibilitySubject.next(false);
  public setOperationType = (operationType: string) => this.operationTypeSubject.next(operationType);
  public getOperationType = (): Observable<string> => this.operationTypeSubject.asObservable();
  public setFinancialYear = (financialYearOperation: FinancialYearOperation): void => this.financialYearSubject.next(financialYearOperation);
  public getFinancialYear = (): Observable<FinancialYearOperation | null> => this.financialYearSubject.asObservable();
  public setRecoverFinancialYear = (recoverFinancialYearOperation: RecoverFinancialYearOperation): void => this.recoverFinancialYearSubject.next(recoverFinancialYearOperation);
  public getRecoverFinancialYear = (): Observable<RecoverFinancialYearOperation | null> => this.recoverFinancialYearSubject.asObservable();
  //#endregion
}
