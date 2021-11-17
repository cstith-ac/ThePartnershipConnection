import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-partnerwindow',
  templateUrl: './partnerwindow.component.html',
  styleUrls: ['./partnerwindow.component.css']
})
export class PartnerwindowComponent implements OnInit {
  @ViewChild("fatAdd") fatAdd: ElementRef;
  dashboardinfo: DashboardInfo[];

  currentRoute:string;
  removePartnerNameFromNav;

  constructor(
    public routeService: RouteService,
    public authService: AuthService,
    private elementRef: ElementRef,
    private route: Router
  ) { 
    this.route.events.subscribe(value => {
      //console.log('current route: ', route.url.toString())
      this.removePartnerNameFromNav = route.url.toString();

      if(route.url.toString() == "/incentive-dashboard") {
        setTimeout(() => {
          //console.log(this.elementRef.nativeElement)
          this.elementRef.nativeElement.style.display = 'none';
        }, 1)
      }

      if(route.url.toString() == "/incentive-entry" && this.authService.isEmployeeWithIncentiveAccess() && route.url.toString() !== "/dashboard") {
        setTimeout(() => {
          //console.log(this.elementRef.nativeElement)
          this.elementRef.nativeElement.style.display = 'none';
        }, 1)
      }

      if(route.url.toString() == "/partner-view-list") {
        setTimeout(() => {
          this.elementRef.nativeElement.style.display = 'none';
        }, 1);
      }

      if(route.url.toString() == "/partner-dashboard") {
        setTimeout(() => {
          this.elementRef.nativeElement.style.display = 'none';
        }, 1);
      }

      if(route.url.toString() == "/partner-service-list") {
        setTimeout(() => {
          this.elementRef.nativeElement.style.display = 'none';
        }, 1);
      }

    })
  }

  ngOnInit() {
    //get the customer care dashboard only if user is Super Admin (19), Admin (14) or Employee (9)
    if(this.authService.isEmployee()) {
      this.routeService.getCustomerCareDashboardInfo().subscribe(
        res => {
          this.dashboardinfo = res;
        }
      )
    }

    if(this.authService.isEmployeeWithIncentiveAccess()){
      console.log(this.route.url)     
    }

    if(this.authService.isPartner()) {
      setTimeout(() => {
        this.elementRef.nativeElement.style.display = 'none';
      }, 1)
    }

    if(this.authService.isTestUser()) {
      setTimeout(() => {
        console.log(this.elementRef.nativeElement)
        this.elementRef.nativeElement.style.display = 'none';
      }, 1)
    }
  }

}
