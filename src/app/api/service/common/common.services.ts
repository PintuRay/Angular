import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Base } from '../../base';
import { HttpClient } from '@angular/common/http';
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
            .getEndpoint('common', 'getCountries')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint)
                )
            );
    }
    getStates(countryId: string): Observable<Base> {
        return this.configService
            .getEndpoint('common', 'getStates')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(`${endpoint}/${countryId}`)
                )
            );
    }
    getDists(stateId: string): Observable<Base> {
        return this.configService
            .getEndpoint('common', 'getDists')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(`${endpoint}/${stateId}`)
                )
            );
    }
}