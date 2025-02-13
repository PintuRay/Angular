import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.Service';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { Base } from '../../../model/base';
import { PaginationParams } from '../../../model/paginationParams';
import { BranchFinancialYearDto, BranchFinancialYearModel, BranchFinancialYearOperation, BranchFinancialYearUpdateModel, BulkBranchFinancialYearOperation } from '../../../entity/branchFinancialYear';
import { BranchFinancialYearMessageService } from './branch-financial-year-message.service';

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
  constructor(private http: HttpClient, private configService: ConfigService, private errorHandler: BranchFinancialYearMessageService) { }
  //#endregion

  //#region Api
  private handleApiError = (error: HttpErrorResponse): Observable<never> => {
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

  public getAll = (): Observable<Base> => this.createHttpRequest('GET', 'getAllBranchFinancialYears');
  public get = (data: PaginationParams): Observable<Base> => this.createHttpRequest('GET', 'getBranchFinancialYears', null, this.buildHttpParams(data));
  public create = (data: BranchFinancialYearModel): Observable<Base> => this.createHttpRequest('POST', 'createBranchFinancialYear', data);
  public bulkCreate = (data: BranchFinancialYearModel[]): Observable<Base> => this.createHttpRequest('POST', 'bulkCreateBranchFinancialYear', data);
  public update = (data: BranchFinancialYearUpdateModel): Observable<Base> => this.createHttpRequest('PATCH', 'updateBranchFinancialYear', data);
  public bulkUpdate = (data: BranchFinancialYearUpdateModel[]): Observable<Base> => this.createHttpRequest('PATCH', 'bulkUpdateBranchFinancialYear', data);
  public remove = (id: string): Observable<Base> => this.createHttpRequest('PUT', 'removeBranchFinancialYear', {}, undefined, id);
  public bulkRemove = (data: BranchFinancialYearDto[]): Observable<Base> => this.createHttpRequest('PUT', 'bulkRemoveBranchFinancialYear', data);
  public getRemoved = (data: PaginationParams): Observable<Base> => this.createHttpRequest('GET', 'getRemovedBranchFinancialYears', null, this.buildHttpParams(data));
  public recover = (id: string): Observable<Base> => this.createHttpRequest('PUT', 'recoverBranchFinancialYear', {}, undefined, id);
  public bulkRecover = (data: BranchFinancialYearDto[]): Observable<Base> => this.createHttpRequest('PUT', 'bulkRecoverBranchFinancialYear', data);
  public delete = (id: string): Observable<Base> => this.createHttpRequest('DELETE', 'deleteBranchFinancialYear', null, undefined, id);
  public bulkDelete = (ids: string[]): Observable<Base> => this.createHttpRequest('DELETE', 'bulkDeleteBranchFinancialYear', ids);
  //#endregion

  //#region component service
  public showAddUpdatedDialog = () => this.addUpdateVisibilitySubject.next(true);
  public hideAddUpdateDialog = () => this.addUpdateVisibilitySubject.next(false);
  public showBulkAddUpdatedDialog = () => this.bulkAddUpdateVisibilitySubject.next(true);
  public hideBulkAddUpdateDialog = () => this.bulkAddUpdateVisibilitySubject.next(false);
  public showRecoverDialog = () => this.changeRecoverVisibilitySubject.next(true);
  public hideRecoverDialog = () => this.changeRecoverVisibilitySubject.next(false);
  public setOperationType = (operationType: string) => this.operationTypeSubject.next(operationType);
  public getOperationType = (): Observable<string> => this.operationTypeSubject.asObservable();
  public setBulkOperationType = (operationType: string) => this.bulkOperationTypeSubject.next(operationType);
  public getBulkOperationType = (): Observable<string> => this.bulkOperationTypeSubject.asObservable();
  public setBranchFinancialYear = (financialYearOperation: BranchFinancialYearOperation): void => this.branchFinancialYearSubject.next(financialYearOperation);
  public getBranchFinancialYear = (): Observable<BranchFinancialYearOperation | null> => this.branchFinancialYearSubject.asObservable();
  public setBulkBranchFinancialYear = (financialYearOperation: BulkBranchFinancialYearOperation): void => this.bulkBranchFinancialYearSubject.next(financialYearOperation);
  public getBulkBranchFinancialYear = (): Observable<BulkBranchFinancialYearOperation | null> => this.bulkBranchFinancialYearSubject.asObservable();
  public setRecoverBranchFinancialYear = (financialYearOperation: BranchFinancialYearOperation): void => this.recoverBranchFinancialYearSubject.next(financialYearOperation);
  public getRecoverBranchFinancialYear = (): Observable<BranchFinancialYearOperation | null> => this.recoverBranchFinancialYearSubject.asObservable();
  public setBulkRecoverBranchFinancialYear = (financialYearOperation: BulkBranchFinancialYearOperation): void => this.bulkRecoverBranchFinancialYearSubject.next(financialYearOperation);
  public getBulkRecoverBranchFinancialYear = (): Observable<BulkBranchFinancialYearOperation | null> => this.bulkRecoverBranchFinancialYearSubject.asObservable();
  //#endregion
}
