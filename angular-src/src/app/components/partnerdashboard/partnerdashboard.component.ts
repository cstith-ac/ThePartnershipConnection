import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { Customer3GListing } from 'src/app/models/customer3glisting';
import { PartnerLandingPage } from 'src/app/models/partnerlandingpage';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-partnerdashboard',
  templateUrl: './partnerdashboard.component.html',
  styleUrls: ['./partnerdashboard.component.css']
})
export class PartnerdashboardComponent implements OnInit {
  customer3glisting: Customer3GListing[];
  partnerLandingPage: PartnerLandingPage[];
  // partnerLandingPage=[
  //   {
  //       "over30Count": 144,
  //       "over30Value": 16050.0300,
  //       "over60Count": 35,
  //       "over60Value": 3227.6100,
  //       "over90Count": 21,
  //       "over90Value": 1408.7200,
  //       "over120Count": 26,
  //       "over120Value": 3091.4900,
  //       "invoicesInProcess": 5,
  //       "invoicesInProcessValue": 0.0000,
  //       "invoicesOnHold": 0,
  //       "invoicesOnHoldValue": 0.0000,
  //       "invoicesApproved30days": 0,
  //       "invoicesApproved30daysValue": 0.0000,
  //       "invoicesPaid30days": 0,
  //       "invoicesPaid30daysValue": 0.0000,
  //       "pendingProspects": 44,
  //       "oldestProspect": "2018-10-16T00:00:00",
  //       "pendingCancels": 18,
  //       "rmrCancels": 648.8800,
  //       "pendingCancels7days": 0,
  //       "highRMRCancelPerson": "",
  //       "highRMRCancelValue": 0,
  //       "serviceTicketsPending": 199,
  //       "oldestInProgress": "2019-08-06T09:41:55.043",
  //       "attCount": 206,
  //       "verizonCount": 150,
  //       "sprintCount": 0,
  //       "tMobileCount": 0,
  //       "unknownCount": 0,
  //       "upgradesLastMonth": 0,
  //       "lifeTimeUpgrades": 0,
  //       "progressPercent": 20,
  //       "attritionLastMonth": 11,
  //       "attritionLast6Months": 0,
  //       "attritionLast12Months": 0
  //   }
  // ]; //use this to test
  user;
  firstName;
  // attritionValue=10;
  attritionValue;
  // attritionProgress="10%";
  attritionProgress;
  // threegConversionValue=78;
  threegConversionValue;
  // threegConversionprogress="78%";
  threegConversionprogress;

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
    // if(this.authService.isTestUser) {
    //   this.router.navigate(['/forbidden'])
    // }

    $("#wrapper").addClass("toggled");

    this.spinnerService.show();
    
    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        this.firstName = this.user.firstName
      },
      err => {
        console.log(err);
      }
    )

    /**Begin Test Progress Bar */
    // this.partnerLandingPage;
    // for(var i = 0;i < this.partnerLandingPage.length;i++) {
    //   this.threegConversionValue = this.partnerLandingPage[i].progressPercent;
    //   this.threegConversionprogress = this.partnerLandingPage[i].progressPercent.toString() + "%";

    //   this.attritionValue = this.partnerLandingPage[i].attritionLastMonth;
    //   this.attritionProgress = this.partnerLandingPage[i].attritionLastMonth.toString() + "%";
    // }
    /**End Test Progress Bar*/

    this.routeService.getPartnerLandingPage().subscribe(
      res => {
        // console.log(res)
        if(res) {
          this.spinnerService.hide()
        }
        this.partnerLandingPage = res;
        for(var i = 0; i < this.partnerLandingPage.length; i++) {
          console.log(this.partnerLandingPage[i].highRMRCancelPerson);
          // console.log(this.partnerLandingPage[i].progressPercent); //3G Conversion
          // console.log(this.partnerLandingPage[i].attritionLastMonth); //Attrition
          this.threegConversionValue = this.partnerLandingPage[i].progressPercent;
          this.attritionValue = this.partnerLandingPage[i].attritionLastMonth;

          this.threegConversionprogress = this.partnerLandingPage[i].progressPercent.toString() + "%";
          this.attritionProgress = this.partnerLandingPage[i].attritionLastMonth.toString() + "%";

          if(this.partnerLandingPage[i].highRMRCancelPerson == "") {
            console.log("nothing here")
          }
        }
      }
    )

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }
  }

  getBackgroundColor(progressPercent) {
    let backgroundColor = 'brown'
    if(this.threegConversionprogress<10){
      return 'success'
    }
    // console.log(item.progressPercent)
    // if(item.progressPercent < 10) {
    //   backgroundColor = '#5ABD78'
    // }
    // if(item.progressPercent > 10 && item.progressPercent < 15) {
    //   backgroundColor = 'turquoise'
    // }
    // if(item.progressPercent > 15) {
    //   backgroundColor = 'gold'
    // }
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

  routeToCallToActionListing() {
    this.router.navigate(["/call-to-action-listing"]);
  }

  routeToCancelQueueList() {
    this.router.navigate(["/cancel-queue-list"]);
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
