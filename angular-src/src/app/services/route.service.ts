import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
//import 'rxjs/add/operator/map';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SystemInfo } from '../models/systeminfo';
import { SummaryAdd } from '../models/summaryadd';
import { Incentive_ADD_Start } from '../models/incentiveaddstart';
import { Incentive_Add_Recurring } from '../models/incentiveaddrecurring';
import { Incentive_Add_Equipment } from '../models/incentiveaddequipment';
import { Incentive_Add_Labor } from '../models/incentiveaddlabor';
import { Customer_Document_ADD } from '../models/customerdocumentadd';
import { ResetPassword } from '../models/resetpassword';
import { SummaryUpdate } from '../models/summaryupdate';
import { Incentive_ADD_Finish } from '../models/incentiveaddfinish';
import { CustomerSearchMatch } from '../models/customersearchmatch';
import { PartnerAddNote } from '../models/partneraddnote';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  authToken: any;
  user: any;
  res: any;

  data: SummaryAdd[] = [];
  incentiveAddStart: Incentive_ADD_Start[] = [];
  incentiveAddRecurring: Incentive_Add_Recurring[] = [];
  incentiveAddEquipment: Incentive_Add_Equipment[] = [];
  incentiveAddLabor: Incentive_Add_Labor[] = [];
  //customerDocumentADD: Customer_Document_ADD[] = [];
  incentiveAddFinish: Incentive_ADD_Finish[] = [];

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  refreshList() {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization':'Bearer '+this.authToken })
    };
    this.http.get(`${this.baseUrl}/api/administration`, httpOptions);
  }

  getAllUsers(): Observable<any>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization':'Bearer '+this.authToken })
    };
    return this.http.get<any>(this.baseUrl + '/api/Administration', httpOptions);
  }

  //Similar to getCustomerCareDashboardInfoById()
  getUser(id: number): Observable<any>{
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/Administration/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  deleteUser(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.delete<any>(`${this.baseUrl}/api/Administration/` + id, httpOptions).pipe(
      catchError(this.errorHandler)
    )
  }

  // Admin and Super Admin Only - Currently used to update a password ONLY
  updatePassword(resetPassord: ResetPassword):  Observable<ResetPassword>{
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json', "Accept": "application/json", 'Authorization':'Bearer ' + this.authToken }) 
    };
    return this.http.post<ResetPassword>(this.baseUrl + '/api/Administration/ResetPassword',resetPassord , httpOptions);
  }

  //This will be used in the future by an admin or super admin to update an entire profile of a user
  // updateUser(id: number): Observable<any>{
  //   this.loadToken();
  //   let httpOptions = { 
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
  //   };
  //   return this.http.get<any>(`${this.baseUrl}/api/Administration/` + id, httpOptions).pipe(
  //     catchError(this.errorHandler)
  //   )
  // }

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
    return this.http.get<any>(this.baseUrl + '/api/CustomerAccessList10', httpOptions).pipe(
      catchError(this.errorHandler)
    );
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

  getCustomer3GListing(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(this.baseUrl + '/api/Customer3GListing', httpOptions).pipe(
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
    return this.http.get<any>(this.baseUrl + '/api/CCAssistant_Systems', httpOptions);
  }

  getPartnerInformation(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
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
    return this.http.post<SummaryAdd>(this.baseUrl + '/api/CallSummaryAdd',summaryAdd, httpOptions);
  }

  putCallSummaryUpdate(id:number, params: any): Observable<SummaryUpdate> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json', "Accept": "application/json", 'Authorization':'Bearer ' + this.authToken })
    };
    return this.http.put<SummaryUpdate>(`${this.baseUrl}/api/CallSummaryUpdate/${id}`, params, httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  getPartnerCallToActionButton(): Observable<HttpResponse<any>> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      }),
      observe: 'response' as 'body'
    };
    return this.http.get<any>(`${this.baseUrl}/api/PartnerCallToActionButton`, httpOptions);
  }

  getTPCCollectionsCallToActionButton(): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.get<any>(`${this.baseUrl}/api/TPCCollectionsCallToActionButton`, httpOptions);
  }

  getPartnerInvoiceListing(): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.get<any>(`${this.baseUrl}/api/PartnerInvoiceListing`, httpOptions);
  }

  getTPCPartnerAgingReport(): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.get<any>(`${this.baseUrl}/api/TPCPartnerAgingReport`, httpOptions);
  }

  getPartnerLandingPage(): Observable<HttpResponse<any>> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      }),
      observe: 'response' as 'body'
    };
    return this.http.get<any>(`${this.baseUrl}/api/PartnerLandingPage`, httpOptions);
  }

  postPartnerAddNote(partnerAddNote: PartnerAddNote): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.post<any>(`${this.baseUrl}/api/PartnerAddNote`, partnerAddNote, httpOptions);
  }

  getCancelQueueList(): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.get<any>(`${this.baseUrl}/api/CancelQueueList`, httpOptions);
  }

  getCancelQueueSiteList(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.get<any>(`${this.baseUrl}/api/CancelQueueSiteList/`+ id, httpOptions);
  }

  getPartnerServiceListing(): Observable<any>  {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.get<any>(`${this.baseUrl}/api/PartnerServiceListing`, httpOptions);
  }

  getPartnerServiceListingExtended(): Observable<any>  {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.get<any>(`${this.baseUrl}/api/PartnerServiceListingExtended`, httpOptions);
  }

  getCheckBoxIndex(): Observable<HttpResponse<any>> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      }),
      observe: 'response' as 'body'
    };
    return this.http.get<any>(`${this.baseUrl}/api/CheckBoxIndex`, httpOptions);
  }

  getListSystemTypes(): Observable<any> {
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken
      })
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListSystemTypes`, httpOptions);
  }

  getListPanelTypes(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListPanelTypes`, httpOptions);
  }

  getListCentralStations(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListCentralStations`, httpOptions);
  }

  getListSitesForCustomer(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListSitesForCustomer/`+ id, httpOptions);
  }

  getListSystemsForSite(id: number): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListSystemsForSite/`+ id, httpOptions);
  }

  getListRecurringItems(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListRecurringItems/`, httpOptions);
  }

  getListMaterialItems(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListMaterialItems/`, httpOptions);
  }

  getListLaborItems(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListLaborItems/`, httpOptions);
  }

  getCustomerSearchMatch(id: string): Observable<CustomerSearchMatch[]> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    console.log(`calling api with %c${id}`, 'font-weight:bold');
    return this.http.get<any>(`${this.baseUrl}/api/CustomerSearchMatch/`+ id, httpOptions);
  }

  getCustomerSearchList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerSearchList/`, httpOptions);
  }

  getCustomerSearchListSite(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerSearchListSite/`, httpOptions);
  }

  getCustomerSearchListCentralStation(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerSearchListCentralStation/`, httpOptions);
  }

  getListMultiples(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/ListMultiples/`, httpOptions);
  }

  getCustomerSystemInfoGetByID(id: number): Observable<any>{
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken }) 
    };
    return this.http.get<any>(`${this.baseUrl}/api/CustomerSystemInfoGet/`+ id, httpOptions);
  }

  postIncentiveADDStart(incentiveStart: Incentive_ADD_Start): Observable<any>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    };
    return this.http.post<Incentive_ADD_Start>(`${this.baseUrl}/api/Incentive_Add_Start`, incentiveStart, httpOptions)
  }

  postIncentive_Add_Recurring(params:any): Observable<any>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    };
    return this.http.post<Incentive_Add_Recurring>(`${this.baseUrl}/api/Incentive_Add_Recurring`, params, httpOptions)
  }

  postIncentive_Add_Equipment(params:any): Observable<any>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    }
    return this.http.post<Incentive_Add_Equipment>(`${this.baseUrl}/api/Incentive_Add_Equipment`, params, httpOptions);
  }

  postIncentive_Add_Labor(params:any): Observable<any>{
    this.loadToken();
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    }
    return this.http.post<Incentive_Add_Labor>(`${this.baseUrl}/api/Incentive_Add_Labor`, params, httpOptions);
  }

  // postCustomerDocumentADD(customerdocumentadd: Customer_Document_ADD): Observable<Customer_Document_ADD> {
  //   this.loadToken();
  //   let httpOptions = { 
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json', "Accept": "application/json", 'Authorization':'Bearer ' + this.authToken }) 
  //   };
  //   return this.http.post<Customer_Document_ADD>(this.baseUrl + '/api/Customer_Document_ADD',customerdocumentadd, httpOptions);
  // }

  postCustomerDocumentADD(customerdocumentadd: Customer_Document_ADD): Observable<HttpResponse<any>> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 
        //'Content-Type': 'multipart/form-data', 
        'Accept': '*/*',
        //"Accept": "application/json", 
        'Authorization':'Bearer ' + this.authToken 
      }),
      responseType:'json' as const,
      reportProgress: true,
      observe: 'response' as 'body' 
    };
    return this.http.post<any>(this.baseUrl + '/api/Customer_Document_ADD',customerdocumentadd, httpOptions);
  }

  postIncentive_ADD_Finish(params:any): Observable<HttpResponse<any>> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization':'Bearer ' + this.authToken 
      }),
      observe: 'response' as 'body' 
    };
    return this.http.post<any>(this.baseUrl + '/api/Incentive_ADD_Finish',params, httpOptions);
  }

  getInstallCompanyList(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    };
    return this.http.get<any>(`${this.baseUrl}/api/InstallCompanyList/`, httpOptions);
  }

  getInstallCompanyList2(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    };
    return this.http.get<any>(`${this.baseUrl}/api/InstallCompanyList2/`, httpOptions);
  }

  getCheckBoxIncompatible(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.authToken })
    };
    return this.http.get<any>(`${this.baseUrl}/api/CheckBoxIncompatible/`, httpOptions);
  }

  // exec dbo.CheckboxAutoInsertList
  postCheckboxAutoInsertList(params:any): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json', "Accept": "application/json", 'Authorization':'Bearer ' + this.authToken }) 
    };
    return this.http.post<any>(this.baseUrl + '/api/CheckboxAutoInsertList',params, httpOptions);
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
      //alert('Please contact an administrator')
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
