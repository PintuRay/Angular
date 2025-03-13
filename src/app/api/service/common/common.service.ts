import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Base } from '../../model/base';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config.Service';
import { GenericMessageService } from '../generic-message.Service';
@Injectable({
    providedIn: 'root',
})
export class CommonService {
    /*-------------------------------Constructor----------------------------------*/
    constructor(private http: HttpClient, private configService: ConfigService, private errorHandler: GenericMessageService) { }
    /*-------------------------------Methods----------------------------------*/
    private handleApiError(error: HttpErrorResponse): Observable<never> {
        this.errorHandler.handleApiError(error);
        return throwError(() => error);
    }
    private createHttpRequest<T>(methodType: string, endpointKey: string, data?: any, params?: HttpParams, id?: string): Observable<Base> {
        return this.configService.getEndpoint('common', endpointKey).pipe(
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

    public getCountries = (): Observable<Base> => this.createHttpRequest('GET', 'getCountries');
    public getStates = (countryId: string): Observable<Base> => this.createHttpRequest('GET', 'getStates', {}, undefined, countryId);
    public getDists = (stateId: string): Observable<Base> => this.createHttpRequest('GET', 'getDists', {}, undefined, stateId);
    public getBranches = () => this.createHttpRequest('GET', 'getBranches');
    public getFinancialYears = (branchId: string) => this.createHttpRequest('GET', 'getFinancialYears', {}, undefined, branchId);
}