import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Model } from '../models/model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NmcService {
  authToken: any;
  baseUrl: '';

  constructor(
    private http: HttpClient, 
    public jwtHelper: JwtHelperService
  ) { }

  getAccountInfo(id:number): Observable<HttpResponse<any>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
    // return this.http.post<any>(`https://thepartnershipconnectionapi-nmc.azurewebsites.net/api/AccountInfo/${id}`, httpOptions);
    return this.http.post<any>(`http://localhost:5001/api/AccountInfo/${id}`,httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  getAccountContacts(id:number): Observable<HttpResponse<any>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
    // return this.http.post<any>(`https://thepartnershipconnectionapi-nmc.azurewebsites.net/api/AccountContacts/${id}`,httpOptions).pipe(
    //   catchError(this.errorHandler)
    // );
    return this.http.post<any>(`http://localhost:5001/api/AccountContacts/${id}`,httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  getAccountZones(id:number): Observable<HttpResponse<any>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
    // return this.http.post<any>(`https://thepartnershipconnectionapi-nmc.azurewebsites.net/api/AccountZones/${id}`,httpOptions).pipe(
    //   catchError(this.errorHandler)
    // );
    return this.http.post<any>(`http://localhost:5001/api/AccountZones/${id}`,httpOptions).pipe(
      catchError(this.errorHandler)
    );
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
