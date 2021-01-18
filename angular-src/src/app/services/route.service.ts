import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
//import 'rxjs/add/operator/map';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SystemInfo } from '../models/systeminfo';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  authToken: any;
  user: any;
  res: any;

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  getCustomerAccessList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/CustomerAccessList', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CustomerAccessList', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/CustomerAccessList', httpOptions);
  }

  getCustomerCareDashboardInfo(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/CustomerCareDashboardInfo', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CustomerCareDashboardInfo', httpOptions).pipe(
    //   catchError(this.errorHandler)
    // )
    return this.http.get<any>(this.baseUrl + '/api/CustomerCareDashboardInfo', httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  getSiteToSystemList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/SiteToSystemList', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/SiteToSystemList', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/SiteToSystemList', httpOptions);
  }

  getCustomerToSiteList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/CustomerToSiteList', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CustomerToSiteList', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/CustomerToSiteList', httpOptions);
  }

  getCustomerSystemInfo(id: number): Observable<any> {
    this.loadToken();
    // this.getCCAssistant_Systems().subscribe(
    //   (data) => {
    //     data.forEach(c => {
    //       console.log(c.customer_System_Id)
    //       fetch('https://localhost:44314/api/CustomerSystemInfo/'+ `${c.customer_System_Id}`)
    //     })
    //   }
    // );
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>(`https://localhost:44314/api/CustomerSystemInfo/{id}`, httpOptions);
    // return this.http.get<any>(`https://thepartnershipconnectionapi.azurewebsites.net/api/CustomerSystemInfo/{id}`, httpOptions);
    // return this.http.get<any>(this.baseUrl + '/api/CustomerSystemInfo/' + `81810`, httpOptions);
    // return this.http.get<SystemInfo>(`${this.baseUrl}/api/CustomerSystemInfo/${id}`, httpOptions);
    return this.http.get<any>(`${this.baseUrl}/api/CustomerSystemInfo/`+id, httpOptions);
  }

  getCCAssistant_Systems(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
      };
      console.log('getting all systems from the server')
    //return this.http.get<any>('https://localhost:44314/api/CCAssistant_Systems', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CCAssistant_Systems', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/CCAssistant_Systems', httpOptions);
  }

  getPartnerInformation(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/PartnerInformation', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/PartnerInformation', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/PartnerInformation', httpOptions);
  }

  getPartnerContactList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/PartnerContactList', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/PartnerContactList', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/PartnerContactList', httpOptions);
  }

  getCallSummaryClassList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/CallSummaryClassList', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CallSummaryClassList', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryClassList', httpOptions);
  }

  getCallSummaryProblems(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/CallSummaryProblems', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CallSummaryProblems', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryProblems', httpOptions);
  }

  getCallSummaryResolutions(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/CallSummaryResolutions', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CallSummaryResolutions', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryResolutions', httpOptions); 
  }

  getCallSummaryNextSteps(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.get<any>('https://localhost:44314/api/CallSummaryNextSteps', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CallSummaryNextSteps', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryNextSteps', httpOptions);
  }

  postCallSummaryAdd(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json', "Accept": "application/json", 'Authorization':'Bearer '+this.authToken }) 
      };
      //console.log(httpOptions)
    //return this.http.post<any>('https://localhost:44314/api/CallSummaryAdd', httpOptions);
    // return this.http.post<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CallSummaryAdd', httpOptions);
    return this.http.post<any>(this.baseUrl + '/api/CallSummaryAdd', httpOptions);
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      //Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
