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
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-partnerdashboard',
  templateUrl: './partnerdashboard.component.html',
  styleUrls: ['./partnerdashboard.component.css']
})
export class PartnerdashboardComponent implements OnInit {
  customer3glisting: Customer3GListing[];
  partnerLandingPage: PartnerLandingPage[];
  partnerInvoiceListing: PartnerInvoiceListing[];
  user;
  firstName;
  attritionValue;
  attritionProgress;
  threegConversionValue;
  threegConversionprogress;
  showPendingCancellationList = "Show Pending Cancellation List";
  showPartnerInvoiceListing = "Show Partner Invoice Listing";
  showTPCPartnerAgingReport = "Show Customer Aging List";
  showPartnerServiceListing = "Show Partner Service List"
  createAnInvoice = "Create an invoice";
  info = "The Partnership Connection, Version: " + environment.appVersion;
  closeResult = '';
  todaysDate;
  attSunsetDate;
  verizonSunsetDate;
  monthDiffAtt;
  monthDiffVerizon;

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

  routeToTPCPartnerAgingReport() {
    this.router.navigate(["/tpc-partner-aging-report"]);
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

  routeToPartnerServiceListing() {
    this.router.navigate(["/partner-service-list"]);
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
