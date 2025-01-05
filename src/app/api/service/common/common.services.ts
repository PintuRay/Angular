import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Base } from '../../base';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../service/config.Service';
@Injectable({
    providedIn: 'root',
})
export class CommonService {
    /*-------------------------------Constructor----------------------------------*/
    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }
    /*-------------------------------Methods----------------------------------*/
    getCountries(): Observable<Base> {
        return this.configService
            .getEndpoint('common', 'GetCountries')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint)
                )
            );
    }
    getStates(countryId: string, token: string): Observable<Base> {
        const params = new HttpParams().set('CountryId', countryId).set('token', token);
        return this.configService
            .getEndpoint('common', 'getStates')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
    getDists(stateId: string, token: string): Observable<Base> {
        const params = new HttpParams().set('StateId', stateId).set('token', token);
        return this.configService
            .getEndpoint('common', 'getDists')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
}