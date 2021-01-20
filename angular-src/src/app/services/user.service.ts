import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

const INIT_DATA = {};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authToken: any;
  user: any;
  res: any;

  baseUrl = environment.baseUrl;

  private DataStore = new BehaviorSubject(INIT_DATA);
  data$: Observable<any> = this.DataStore.asObservable();

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  getCurrentUser() {
    this.loadToken();
    let httpOptions = { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+this.authToken }) 
    };
    this.http.get(`${this.baseUrl}/api/UserProfile`,httpOptions)
      .pipe(map(res => res))
      .subscribe(data => {
        //console.log(typeof(data))
        this.DataStore.next(data);
      })
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
}
