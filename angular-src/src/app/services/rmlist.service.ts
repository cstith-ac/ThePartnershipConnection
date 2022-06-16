import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegionRelationshipContacts } from '../models/regionrelationshipcontacts';

@Injectable({
  providedIn: 'root'
})
export class RmlistService {
  regionRelationshipContacts: RegionRelationshipContacts[];

  authToken: any;
  userName: any;
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient, 
    public jwtHelper: JwtHelperService
  ) { }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  getAllRegionRelationshipContacts(): Observable<any>{
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(this.baseUrl + '/api/RegionRelationshipContacts', httpOptions);
  }

  getRegionRelationshipContactsById(id: number): Observable<HttpResponse<any>>{
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders(
        { 
          'Content-Type': 'application/json',
          'Authorization':'Bearer '+this.authToken 
        }),
        observe: 'response' as 'body'
    };
    return this.http.get<any>(`${this.baseUrl}/api/RegionRelationshipContacts/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  postRegionRelationshipContacts(regionRelationshipContacts: RegionRelationshipContacts): Observable<RegionRelationshipContacts>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.post<RegionRelationshipContacts>(`${this.baseUrl}/api/RegionRelationshipContacts`, regionRelationshipContacts, httpOptions);
  }

  updateRegionRelationshipContacts(id: number): Observable<HttpResponse<any>>{
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+ this.authToken 
      }),
      observe: 'response' as 'body'
    };
    return this.http.put<any>(`${this.baseUrl}/api/RegionRelationshipContacts/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  deleteRegionRelationshipContacts(id: number): Observable<any>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+ this.authToken
      })
    };
    return this.http.delete<any>(`${this.baseUrl}/api/RegionRelationshipContacts/` + id, httpOptions).pipe(
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
