import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PermissionsUserMap } from '../models/permissionsusermap';
import { PermissionAdd } from '../models/permissionadd';
import { PermissionDelete } from '../models/permissiondelete';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  permissionAdd: PermissionAdd[] = [];
  permissionDelete: PermissionDelete[] = [];

  authToken: any;
  userName: any;
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient, 
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService
  ) { }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  getASPNetPermissions(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(this.baseUrl + '/api/AspnetPermissions', httpOptions);
  }

  getASPNetPermissionsMap(): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(this.baseUrl + '/api/ASPNetPermissionsMap', httpOptions)
  }

  getPermissionsUserMap(id:string): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    // console.log(`calling api with %c${id}`, 'font-weight:bold');
    return this.http.get<any>(`${this.baseUrl}/api/PermissionsUserMap/`+ id, httpOptions);
  }

  postPermissionAdd(permissionAdd: PermissionAdd): Observable<PermissionAdd>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    };
    return this.http.post<PermissionAdd>(`${this.baseUrl}/api/PermissionAdd`, permissionAdd, httpOptions)
  }

  postPermissionDelete(permissionDelete: PermissionDelete): Observable<PermissionDelete>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    };
    return this.http.post<PermissionDelete>(`${this.baseUrl}/api/PermissionDelete`, permissionDelete, httpOptions)
  }
}
