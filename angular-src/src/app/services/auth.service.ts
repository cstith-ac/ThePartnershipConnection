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

  // registerUser(user) {
  //   let headers = new Headers();
  //   headers.append('Content-Type','application/json');
  //   return this.http.post('http://localhost:3000/users/register', user, {headers: headers})
  //     .map(res => res.json());
  // }
  registerUser(user): Observable<any> {
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
    };
    return this.http.post<any>(this.baseUrl + '/api/ApplicationUser/Register', user, httpOptions);
  }

  authenticateUser(user): Observable<any> {
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
    };
    return this.http.post<any>(this.baseUrl + '/api/ApplicationUser/Login', user, httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  getProfile(): Observable<any> {
    this.loadToken();
    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/json','Authorization':this.authToken
    // })
    // console.log(headers)
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Authorization':'Bearer '+this.authToken }) 
    };
    //return this.http.get<any>('https://localhost:44314/api/UserProfile', httpOptions);
    // return this.http.get<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/UserProfile', httpOptions);
    return this.http.get<any>(this.baseUrl + '/api/UserProfile', httpOptions);
  }

  updateUserProfile(user: UserProfile): Observable<UserProfile> {
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization':'Bearer '+this.authToken }) 
      };
    //return this.http.put<any>('https://localhost:44314/api/ApplicationUser/UserProfile', user, httpOptions);
    // return this.http.put<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/ApplicationUser/UserProfile', user, httpOptions);
    // return this.http.put<UserProfile>(this.baseUrl + '/api/ApplicationUser/UserProfile', user, httpOptions);
    return this.http.put<UserProfile>(`${this.baseUrl}/api/UserProfile/${user.id}`, user, httpOptions);
  }

  // getProfile(){
  //   let headers = new HttpHeaders();
  //   this.loadToken();
  //   headers.append('Authorization', this.authToken);
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.get('https://localhost:44314/api/UserProfile',{headers: headers});
  // }

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

    if(user.afaRole === 19) {
      console.log('this user IS a superadmin and is allowed to registered a user')
      return true;
    } else {
      console.log('this user IS NOT a superadmin and is allowed to registered a user')
      //alert('You do not have authorization to register a user')
      this.flashMessage.show('You do not have authorization to register a user', 
      {
        cssClass: 'alert-danger',
        timeout: 3000
      });
      return false;
    }
  }

  isEmployee() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    if(user.afaRole === 9 || user.afaRole == 19) {
      console.log('this is an employee');
      return true;
    } else {
      console.log('this is NOT an employee')
      return false;
    }
  }

  isPartner() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    if(user.afaRole === 5) {
      console.log('this is a partner')
      return true;
    } else {
      console.log('this is not a partner')
      // this.flashMessage.show('You are not a partner', 
      // {
      //   cssClass: 'alert-danger',
      //   timeout: 3000
      // });
      return false;
    }
  }

  //this is not working, working code is in sidenav component
  logout() {
    this.authToken = null;
    this.user = null;
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
