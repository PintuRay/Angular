import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.Service';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { Base } from '../../../model/base';
import { PaginationParams } from '../../../model/paginationParams';
import { BranchModel, BranchOperation, BranchUpdateModel, BulkBranchOperation } from '../../../entity/branch';
import { BranchMessageService } from './branch-message.service';

@Injectable()
export class BranchService {

  //#region Property Declaration
  private branchSubject = new BehaviorSubject<BranchOperation | null>(null);
  private bulkBranchSubject = new BehaviorSubject<BulkBranchOperation | null>(null);
  private operationTypeSubject = new BehaviorSubject<string>('');
  private bulkOperationTypeSubject = new BehaviorSubject<string>('');
  //#endregion

  //#region Constructor
  constructor(private http: HttpClient, private configService: ConfigService, private errorHandler: BranchMessageService) { }
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

  public getAll = (): Observable<Base> => this.createHttpRequest('GET', 'getAllBranches');
  public get = (data: PaginationParams): Observable<Base> => this.createHttpRequest('GET', 'getBranches', null, this.buildHttpParams(data));
  public create = (data: BranchModel): Observable<Base> => this.createHttpRequest('POST', 'createBranch', data);
  public bulkCreate = (data: BranchModel[]): Observable<Base> => this.createHttpRequest('POST', 'bulkCreateBranch', data);
  public update = (data: BranchUpdateModel): Observable<Base> => this.createHttpRequest('PATCH', 'updateBranch', data);
  public bulkUpdate = (data: BranchUpdateModel[]): Observable<Base> => this.createHttpRequest('PATCH', 'bulkUpdateBranch', data);
  public remove = (id: string): Observable<Base> => this.createHttpRequest('PUT', 'removeBranch', {}, undefined, id);
  public bulkRemove = (data: BranchUpdateModel[]): Observable<Base> => this.createHttpRequest('PUT', 'bulkRemoveBranch', data);
  public getRemoved = (data: PaginationParams): Observable<Base> => this.createHttpRequest('GET', 'getRemovedBranches', null, this.buildHttpParams(data));
  public recover = (id: string): Observable<Base> => this.createHttpRequest('PUT', 'recoverBranch', {}, undefined, id);
  public  bulkRecover = (data: BranchUpdateModel[]): Observable<Base> => this.createHttpRequest('PUT', 'bulkRecoverBranch', data);
  public delete = (id: string): Observable<Base> => this.createHttpRequest('DELETE', 'deleteBranch', null, undefined, id);
  public bulkDelete = (ids: string[]): Observable<Base> => this.createHttpRequest('DELETE', 'bulkDeleteBranch', ids);
  //#endregion

  //#region component  service
  public setOperationType = (operationType: string) => this.operationTypeSubject.next(operationType);
  public getOperationType = (): Observable<string> => this.operationTypeSubject.asObservable();
  public setBulkOperationType = (operationType: string) => this.bulkOperationTypeSubject.next(operationType);
  public getBulkOperationType = (): Observable<string> => this.bulkOperationTypeSubject.asObservable();
  public setBranch = (branchOperation: BranchOperation): void => this.branchSubject.next(branchOperation);
  public getBranch = (): Observable<BranchOperation | null> => this.branchSubject.asObservable();
  public setBulkBranch = (bulkBranchOperation: BulkBranchOperation): void => this.bulkBranchSubject.next(bulkBranchOperation);
  public getBulkBranch = (): Observable<BulkBranchOperation | null> => this.bulkBranchSubject.asObservable();
  //#endregion

}
