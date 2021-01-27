import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { UserProfile } from 'src/app/models/userprofile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  res: any;

  data: UserProfile[] = [];

  formData: UserProfile = new UserProfile();

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

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
    //return this.http.post<any>('https://localhost:44314/api/ApplicationUser/Register', user, httpOptions);
    // return this.http.post<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/ApplicationUser/Register', user, httpOptions);
    return this.http.post<any>(this.baseUrl + '/api/ApplicationUser/Register', user, httpOptions);
  }

  authenticateUser(user): Observable<any> {
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
      };
    //return this.http.post<any>('https://localhost:44314/api/ApplicationUser/Login', user, httpOptions);
    // return this.http.post<any>('https://thepartnershipconnectionapi.azurewebsites.net/api/ApplicationUser/Login',user, httpOptions);
    return this.http.post<any>(this.baseUrl + '/api/ApplicationUser/Login', user, httpOptions);
  }

  getProfile(): Observable<any> {
    this.loadToken();
    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/json','Authorization':this.authToken
    // })
    // console.log(headers)
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
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
}
