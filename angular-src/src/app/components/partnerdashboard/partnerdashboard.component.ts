import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { Customer3GListing } from 'src/app/models/customer3glisting';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-partnerdashboard',
  templateUrl: './partnerdashboard.component.html',
  styleUrls: ['./partnerdashboard.component.css']
})
export class PartnerdashboardComponent implements OnInit {
  customer3glisting: Customer3GListing[];

  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];

  id:string;

  constructor(
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    public jwtHelper: JwtHelperService
  ) { }

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      console.log('your logged in')
    }
  }

  routeToCustomer3GList() {
    console.log('route')
    this.router.navigate(["/customer-3g-listing/"]);

    // this.spinnerService.show();
    // setTimeout(() => {
    //   this.spinnerService.hide();
    // }, 30000)

    // this.routeService.getCustomer3GListing().subscribe(
    //   res => {
    //     this.customer3glisting = res;
    //   }
    // )
  }

  routeToIncentiveEntry() {
    this.router.navigate(["/incentive-entry"]);
  }

  // onTableDataChange(event) {
  //   this.page = event;
  //   this.load3GList();
  //   this.spinnerService.hide();
  // }

  // onTableSizeChange(event) {
  //   this.tableSize = event.target.value;
  //   this.page = 1;
  //   this.load3GList();
  //   this.spinnerService.hide();
  // }

}
