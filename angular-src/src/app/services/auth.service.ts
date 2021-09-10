import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { UserProfile } from 'src/app/models/userprofile';
import { FlashMessagesService } from 'angular2-flash-messages';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  companyName: any;
  partnerCode: any;
  totalEquipMatCalc: any;
  totalRecurringCalc: any;
  res: any;

  superAdmin: any;

  data: UserProfile[] = [];

  formData: UserProfile = new UserProfile();

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient, 
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService
    ) { }

  registerUser(user): Observable<any> {
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
    };
    return this.http.post<any>(this.baseUrl + '/api/ApplicationUser/Register', user, httpOptions);
  }

  authenticateUser(user): Observable<any> {
    // let httpOptions = { 
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json',observe:'response', 'Access-Control-Allow-Origin': '*' }) 
    // };
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json',observe:'response' }) 
    };
    return this.http.post<any>(this.baseUrl + '/api/ApplicationUser/Login', user, httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  getProfile(): Observable<any> {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.get<any>(this.baseUrl + '/api/UserProfile', httpOptions);
  }

  updateUserProfile(user: UserProfile): Observable<UserProfile> {
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization':'Bearer '+this.authToken }) 
    };
    return this.http.put<UserProfile>(`${this.baseUrl}/api/UserProfile/${user.id}`, user, httpOptions);
  }

  //not working. token and user are set from login component
  storeUserData(res, token) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user',  JSON.stringify(res));
    this.authToken = token;
    this.user = res;
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  loggedIn() {
    const token: any = localStorage.getItem('token');
    if(token === null || token === undefined) {
      this.jwtHelper.isTokenExpired()
      return false;
    } else {
      !this.jwtHelper.isTokenExpired()
      return true;
    }
  }

  isAuthorizedToRegister() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    //console.log(user.username)

    if(user.afaRole === 14 || user.afaRole === 19) {
      return true;
    } else {
      this.flashMessage.show('You do not have authorization to register a user', 
      {
        cssClass: 'alert-danger',
        timeout: 3000
      });
      return false;
    }
  }

  isSuperAdmin() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    //Super Admin = 19
    if(user.afaRole == 19) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    //Admin = 14
    if(user.afaRole === 14) {
      return true;
    } else {
      return false;
    }
  }

  isAdminOrSuperAdmin() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    //Admin = 14, Super Admin = 19
    if(user.afaRole === 14 || user.afaRole === 19) {
      return true;
    } else {
      return false;
    }
  }

  isEmployee() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    //Employee = 9, Super Admin = 19, Admin = 14
    if(user.afaRole === 9 || user.afaRole === 19 || user.afaRole === 14) {
      return true;
    } else {
      return false;
    }
  }

  isPartner() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    //Partner = 5
    if(user.afaRole === 5) {
      return true;
    } else {
      return false;
    }
  }

  isEmployeeWithIncentiveAccess() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    //Partner = 5, Employee = 9, Super Admin = 19, Admin = 14, Employee with Incentive Entry Access = 10
    console.log('isEmployeeWithIncentiveAccess was called')
    if(user.afaRole === 5 || user.afaRole === 9 || user.afaRole === 19 || user.afaRole === 14 || user.afaRole === 10) {
      return true;
    } else {
      return false;
    }
  }

  isTestUser() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    if(user.username === 'testuser@alarmfundingassociates.com') {
      return true;
    } else {
      return false;
    }
  }

  //this is not working, working code is in sidenav component
  logout() {
    this.authToken = null;
    this.user = null;
    this.companyName = null;
    this.partnerCode = null;
    this.totalEquipMatCalc = null;
    this.totalRecurringCalc = null;
    localStorage.clear;
  }

  //  storeUserData(token, user): Observable<any> {
  //    localStorage.setItem('token', res.token);
  //   localStorage.setItem('user',  JSON.stringify(res));
  //   this.authToken = token;
  //   this.user = res;
  //    return;
  //  }

  errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      //Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      alert('There has been an error. Please contact an administrator')
      // this.flashMessage.show('An error has been encountered. Please contact an administrator', 
      // {
      //   cssClass: 'alert-danger',
      //   timeout: 3000
      // });
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
