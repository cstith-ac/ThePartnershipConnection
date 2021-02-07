import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
//import 'rxjs/add/operator/map';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SystemInfo } from '../models/systeminfo';
import { SummaryAdd } from '../models/summaryadd';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  authToken: any;
  user: any;
  res: any;

  data: SummaryAdd[] = [];

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  getCustomerAccessList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
    return this.http.get<any>(this.baseUrl + '/api/CustomerAccessList', httpOptions);
  }

  getCustomerAccessList10(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
      };
    return this.http.get<any>(this.baseUrl + '/api/CustomerAccessList10', httpOptions);
  }

  getCustomerCareDashboardInfo(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(this.baseUrl + '/api/CustomerCareDashboardInfo', httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  getCustomerCareDashboardInfoById(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerCareDashboardInfo/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  getServiceTicketInfo2ById(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ServiceTicketInfo2/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  getServiceTicketInfoById(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ServiceTicketInfo/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  getServiceTicketNoteById(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
    return this.http.get<any>(`${this.baseUrl}/api/ServiceTicketNotes/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  getSiteToSystemList(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
      };
    return this.http.get<any>(`${this.baseUrl}/api/SiteToSystemList/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    );
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
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
      };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerSystemInfo/`+ id, httpOptions);
  }

  getCCAssistant_Systems(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
      };
      //console.log('getting all systems from the server')
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

  getPartnerInformationNew(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
      };
    return this.http.get<any>(this.baseUrl + '/api/PartnerInformationNew', httpOptions);
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

  getPartnerContactListAdditional(): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken })
    };
    return this.http.get<any>(this.baseUrl + '/api/PartnerContactListAdditional', httpOptions);
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

  //Customer Care
  getCallSummaryProblems(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryProblems', httpOptions);
  }

  //Incentives
  getCallSummaryProblemsIC(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryProblemsIC', httpOptions);
  }

  //Invoicing
  getCallSummaryProblemsIV(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryProblemsIV', httpOptions);
  }

  //Other
  getCallSummaryProblemsO(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryProblemsO', httpOptions);
  }

  //Service
  getCallSummaryProblemsS(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
      };
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryProblemsS', httpOptions);
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
    return this.http.get<any>(this.baseUrl + '/api/CallSummaryNextSteps', httpOptions);
  }

  getCustomerContractInfo(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerContractInfo`, httpOptions);
  }

  getCustomerContractNotes(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerContractNotes`, httpOptions);
  }

  getCustomerContractNotesById(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
      };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerContractNotes/`+ id, httpOptions);
  }

  postCallSummaryAdd(summaryAdd: SummaryAdd): Observable<SummaryAdd> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json', "Accept": "application/json", 'Authorization':'Bearer ' + this.authToken }) 
    };
    //console.log(httpOptions)
    //return this.http.post<any>('https://localhost:44314/api/CallSummaryAdd', httpOptions);
    // return this.http.post<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/CallSummaryAdd', httpOptions);
    return this.http.post<SummaryAdd>(this.baseUrl + '/api/CallSummaryAdd',summaryAdd, httpOptions);
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
