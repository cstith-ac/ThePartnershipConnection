import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Model } from '../models/model';
import { catchError } from 'rxjs/operators';
import { EventHistoryDate } from '../models/eventhistorydate';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  authToken: any;
  baseUrl: '';

  constructor(
    private http: HttpClient, 
    public jwtHelper: JwtHelperService
  ) { }

  getCentralStationDataCMS(): Observable<HttpResponse<any>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
    return this.http.get<any>(`http://localhost:5000/api/CentralStationDataCMS`, httpOptions);
    //return this.http.get<any>(`https://thepartnershipconnectionapi-cms.azurewebsites.net/api/CentralStationDataCMS`, httpOptions);
  }

  getSiteSystemNumbers(id:number): Observable<HttpResponse<any>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/xml',
        'Accept': '*'
      }),
      observe: 'response' as 'body'
    };
    // return this.http.post<any>(`https://thepartnershipconnectionapi-cms.azurewebsites.net/api/SiteSystemNumbers/${id}`, httpOptions)
    // .pipe(
    //   catchError(this.errorHandler)
    // )
    return this.http.post<any>(`http://localhost:5000/api/SiteSystemNumbers/${id}`, httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getSiteSystemDetails(id:number): Observable<HttpResponse<any>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/xml',
        'Accept': '*'
      }),
      observe: 'response' as 'body'
    };
    // return this.http.post<any>(`https://thepartnershipconnectionapi-cms.azurewebsites.net/api/SiteSystemDetails/${id}`, httpOptions)
    // .pipe(
    //   catchError(this.errorHandler)
    // )
    return this.http.post<any>(`http://localhost:5000/api/SiteSystemDetails/${id}`, httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getContactList(id:number): Observable<HttpResponse<any>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/xml',
        'Accept': '*'
      }),
      observe: 'response' as 'body'
    };
    // return this.http.post<any>(`https://thepartnershipconnectionapi-cms.azurewebsites.net/api/ContactList/${id}`, httpOptions)
    //   .pipe(
    //     catchError(this.errorHandler)
    // )
    return this.http.post<any>(`http://localhost:5000/api/ContactList/${id}`, httpOptions)
      .pipe(
        catchError(this.errorHandler)
    )
  }

  getZones(id:number): Observable<HttpResponse<any>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/xml',
        'Accept': '*'
      }),
      observe: 'response' as 'body'
    };
    // return this.http.post<any>(`https://thepartnershipconnectionapi-cms.azurewebsites.net/api/Zones/${id}`, httpOptions)
    //   .pipe(
    //     catchError(this.errorHandler)
    // )
    return this.http.post<any>(`http://localhost:5000/api/Zones/${id}`, httpOptions)
      .pipe(
        catchError(this.errorHandler)
    )
  }

  getEventHistoryDate(): Observable<HttpResponse<EventHistoryDate[]>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/xml',
        'Accept': '*'
      }),
      observe: 'response' as 'body'
    };
    // return this.http.post<any>(`https://thepartnershipconnectionapi-cms.azurewebsites.net/api/EventHistoryDate`, httpOptions)
    //   .pipe(
    //     catchError(this.errorHandler)
    // )
    return this.http.post<any>(`http://localhost:5000/api/EventHistoryDate`, httpOptions)
      .pipe(
        catchError(this.errorHandler)
    )
  }

  errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      //Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      //alert('Please contact an administrator')
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
