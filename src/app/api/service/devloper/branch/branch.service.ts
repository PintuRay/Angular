import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.Service';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { Base } from '../../../base';
import { PaginationParams } from '../../../model/paginationParams';
import { BranchModel, BranchOperation, BranchUpdateModel, BulkBranchOperation } from '../../../entity/branch';
import { BranchMessageService } from '../branch/branch-message.Service ';

@Injectable()
export class BranchService {

  //#region Property Declaration
  private branchSubject = new BehaviorSubject<BranchOperation | null>(null);
  private bulkBranchSubject = new BehaviorSubject<BulkBranchOperation | null>(null);
  private operationTypeSubject = new BehaviorSubject<string>('');
  private bulkOperationTypeSubject = new BehaviorSubject<string>('');
  //#endregion

  //#region Constructor
  constructor( private http: HttpClient, private configService: ConfigService, private errorHandler: BranchMessageService ) { }
  //#endregion

  //#region Api
  private handleApiError(error: HttpErrorResponse): Observable<never> {
    this.errorHandler.handleApiError(error);
    return throwError(() => error);
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

  getAll(): Observable<Base> {
    return this.createHttpRequest('GET', 'getAllBranches');
  }
  get(data: PaginationParams): Observable<Base> {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())
    if (data.searchTerm !== null) {
      params = params.set('searchTerm', data.searchTerm);
    }
    return this.createHttpRequest('GET', 'getBranches', null, params);
  }
  create(data: BranchModel): Observable<Base> {
    return this.createHttpRequest('POST', 'createBranch', data);
  }
  bulkCreate(data: BranchModel[]): Observable<Base> {
    return this.createHttpRequest('POST', 'bulkCreateBranch', data);
  }
  update(data: BranchUpdateModel): Observable<Base> {
    return this.createHttpRequest('PATCH', 'updateBranch', data);
  }
  bulkUpdate(data: BranchUpdateModel[]): Observable<Base> {
    return this.createHttpRequest('PATCH', 'bulkUpdateBranch', data);
  }
  remove(id: string): Observable<Base> {
    return this.createHttpRequest('PUT', 'removeBranch', {}, undefined, id);
  }
  bulkRemove(data: BranchUpdateModel[]): Observable<Base> {
    return this.createHttpRequest('PUT', 'bulkRemoveBranch', data);
  }
  getRemoved(data: PaginationParams): Observable<Base> {
    let params = new HttpParams()
      .set('pageNumber', data.pageNumber.toString())
      .set('pageSize', data.pageSize.toString())
    if (data.searchTerm !== null) {
      params = params.set('searchTerm', data.searchTerm);
    }
    return this.createHttpRequest('GET', 'getRemovedBranches', null, params)
  }
  recover(id: string): Observable<Base> {
    return this.createHttpRequest('PUT', 'recoverBranch', {}, undefined, id);
  }
  bulkRecover(data: BranchUpdateModel[]): Observable<Base> {
    return this.createHttpRequest('PUT', 'bulkRecoverBranch', data)
  }
  delete(id: string): Observable<Base> {
    return this.createHttpRequest('DELETE', 'deleteBranch', null, undefined, id)
  }
  bulkDelete(ids: string[]): Observable<Base> {
    return this.createHttpRequest('DELETE', 'bulkDeleteBranch', ids);
  }
  //#endregion

  //#region component  service
  //single
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
  setBranch(branchOperation: BranchOperation): void {
    this.branchSubject.next(branchOperation);
  }
  getBranch(): Observable<BranchOperation | null> {
    return this.branchSubject.asObservable();
  }
  setBulkBranch(bulkBranchOperation: BulkBranchOperation): void {
    this.bulkBranchSubject.next(bulkBranchOperation);
  }
  getBulkBranch(): Observable<BulkBranchOperation | null> {
    return this.bulkBranchSubject.asObservable();
  }
  //#endregion

}
