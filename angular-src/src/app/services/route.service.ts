import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  authToken: any;
  user: any;
  res: any;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  getCustomerAccessList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      console.log(httpOptions)
    return this.http.get<any>('https://localhost:44314/api/CustomerAccessList', httpOptions);
  }

  getCustomerCareDashboardInfo(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      console.log(httpOptions)
    return this.http.get<any>('https://localhost:44314/api/CustomerCareDashboardInfo', httpOptions);
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
}
