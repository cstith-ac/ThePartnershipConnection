import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Customer3GListing } from 'src/app/models/customer3glisting';
import { PartnerLandingPage } from 'src/app/models/partnerlandingpage';
import { PartnerInvoiceListing } from 'src/app/models/partnerinvoicelisting';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;
const moment = require('moment');

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
  partnerInvoiceListing: PartnerInvoiceListing[];
  user;
  firstName;
  // attritionValue=10;
  // attritionProgress="10%";
  // threegConversionValue=78;
  // threegConversionprogress="78%";
  attritionValue;
  attritionProgress;
  threegConversionValue;
  threegConversionprogress;
  showPendingCancellationList = "Show Pending Cancellation List";
  showPartnerInvoiceListing = "Show Partner Invoice Listing";
  createAnInvoice = "Create an invoice";
  closeResult = '';
  todaysDate;
  attSunsetDate;
  verizonSunsetDate;
  monthDiffAtt;
  monthDiffVerizon;
  // attSunsetDate = new Date("February 22, 2022 00:00:00");
  // verizonSunsetDate = new Date("November 1, 2022 00:00:00");

  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];

  id:string;
  pageSize=10;


  constructor(
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private modalService: NgbModal,
    public jwtHelper: JwtHelperService
  ) { }

  ngOnInit() {
    // if(this.authService.isTestUser) {
    //   this.router.navigate(['/forbidden'])
    // }
    this.getMonthDiff();

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

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
          console.log(this.partnerLandingPage[i].attritionLast6Months.toFixed(1))
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
  }

  getMonthDiff() {
    this.todaysDate = moment(moment(), 'DD-MM-YYYY')
    this.attSunsetDate = moment('22-02-2022', 'DD-MM-YYYY');
    this.verizonSunsetDate = moment('01-11-2022' ,'DD-MM-YYYY');

    this.monthDiffAtt = this.attSunsetDate.diff(this.todaysDate, 'months');
    this.monthDiffVerizon = this.verizonSunsetDate.diff(this.todaysDate, 'months');
    console.log('Month: ' + this.monthDiffAtt);
    console.log('Month: ' + this.monthDiffVerizon);
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

  // openPartnerInvoiceListingModal() {
  //   $("#partnerInvoiceListingModal").modal("show");

  //   this.spinnerService.show();

  //   this.routeService.getPartnerInvoiceListing().subscribe(
  //     res => {
  //       if(res) {
  //         this.spinnerService.hide()
  //       }
        
  //       this.partnerInvoiceListing = [].concat(res);
        
  //     }
  //   )
  // }

  openPartnerInvoiceListingModal(content) {
    this.modalService.open(content, 
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class',
      });

      this.spinnerService.show();

      this.routeService.getPartnerInvoiceListing().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }
          this.partnerInvoiceListing = [].concat(res);
          // for(var i = 0; i < this.partnerInvoiceListing.length; i++) {
          //   this.incentiveID = this.partnerInvoiceListing[i].incentiveID
          // }
          // this.partnerInvoiceListing.forEach((x) => {
          //   this.incentiveID = x.incentiveID
          // })
          
        }
      )
  }

  openComingSoonModal(comingSoon) {
    this.modalService.open(comingSoon,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class'
      });
  }

  routeToPartnerInvoiceListing() {
    this.router.navigate(["/partner-invoice-listing/"]);
  }

  onOpenNoteModal(incentiveID:number) {
    //$("#memoModal").modal("show");
    console.log(incentiveID)
    // this.customer_Id = customer_Id;
    // this.callToActionListingMemoForm.controls["CustomerID"].setValue(this.customer_Id);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
