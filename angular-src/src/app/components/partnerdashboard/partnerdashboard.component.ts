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
import { PermissionsService } from 'src/app/services/permissions.service';
declare var $: any;
const moment = require('moment');
import { environment } from '../../../environments/environment';
import { mergeMap, switchMap } from 'rxjs/operators';
import { PermissionsUserMap } from 'src/app/models/permissionsusermap';

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
  show3GListingList = "Show 3G Conversion List";
  showPendingCancellationList = "Show Pending Cancellation List";
  showPartnerInvoiceListing = "Show Partner Invoice Listing";
  showTPCPartnerAgingReport = "Show Customer Aging List";
  showPartnerServiceListing = "Show Partner Service List";
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

  showSplash=true;

  userName;
  permissionsUserMap: PermissionsUserMap[];

  hide3GConversion: boolean = false;
  hidePendingCancellations: boolean = false;
  hideAging: boolean = false;
  hideAgingCTA: boolean = false;
  hideInvoices: boolean = false;
  hideService: boolean = false;
  hideSales: boolean = false;
  hideAttrition: boolean = false;
  hide3GExcelExport: boolean = false;
  hideCreateInvoice: boolean = false;

  constructor(
    public jwtHelper: JwtHelperService,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private authService: AuthService,
    private userService: UserService,
    public permissionService: PermissionsService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    // if(localStorage.getItem('removeSplash') === '1') {
    //   this.showSplash = false;
    // } else {
    //   this.showSplash;
    // }

    if(localStorage.getItem('InstructionsShown')) {
      this.showSplash = false;
    }
    
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

    // use SwitchMap to get profile then permissions user map
    this.authService.getProfile().pipe(
      mergeMap((res:any) => this.permissionService.getPermissionsUserMap(res.userName))
    ).subscribe(data => {
      //console.log(data)
      this.permissionsUserMap = data;

      //show/hide card or card and button base on hasPermission value of Y or N
      for(let i = 0; i < this.permissionsUserMap.length; i++) {
        // console.log(this.permissionsUserMap[i])
        // console.log(this.permissionsUserMap[i].permissionName)
        // console.log(this.permissionsUserMap[i].hasPermission)
        if(this.permissionsUserMap[i].permissionName === '3G Conversion' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hide3GConversion = true;
        }
        if(this.permissionsUserMap[i].permissionName === 'Pending Cancellations' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hidePendingCancellations = true;
        }
        if(this.permissionsUserMap[i].permissionName === 'Aging' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hideAging = true;
        }
        if(this.permissionsUserMap[i].permissionName === 'Aging-CTA' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hideAgingCTA = true;
        }
        if(this.permissionsUserMap[i].permissionName === 'Invoices' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hideInvoices = true;
        }
        if(this.permissionsUserMap[i].permissionName === 'Service' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hideService = true;
        }
        if(this.permissionsUserMap[i].permissionName === 'Sales' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hideSales = true;
        }
        if(this.permissionsUserMap[i].permissionName === 'Attrition' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hideAttrition = true;
        }
        if(this.permissionsUserMap[i].permissionName === '3G Excel Export' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hide3GExcelExport = true;
        }
        if(this.permissionsUserMap[i].permissionName === 'Create Invoice' && this.permissionsUserMap[i].hasPermission === 'Y'){
          this.hideCreateInvoice = true;
        }
      }
    })

    
    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        this.firstName = this.user.firstName;
        this.userName = this.user.userName;
      },
      err => {
        console.log(err);
      }
    )

    // // populate the dashboard 
    // // values based on hasPermission, show/hide card or card and button
    // setTimeout(() => {
    //   this.permissionService.getPermissionsUserMap(this.userName).subscribe(
    //     res => {
    //       this.permissionsUserMap = res;
    //     }
    //   )  
    // }, 400);
    

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
          // console.log(this.partnerLandingPage[i].highRMRCancelPerson);
          // console.log(this.partnerLandingPage[i].attritionLast6Months.toFixed(1))
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

  openAppSettingsModal(e) {
    e.preventDefault();
    console.log('openAppSettingsModal was called')

    // open a modal
    // display checkboxes, currently selected value checked and other available value
    // update change in localstorage
    // Show directions again if don't show directions again checkbox was checked 
  }

  getMonthDiff() {
    this.todaysDate = moment(moment(), 'DD-MM-YYYY')
    this.attSunsetDate = moment('22-02-2022', 'DD-MM-YYYY');
    this.verizonSunsetDate = moment('01-11-2022' ,'DD-MM-YYYY');

    this.monthDiffAtt = this.attSunsetDate.diff(this.todaysDate, 'months');
    this.monthDiffVerizon = this.verizonSunsetDate.diff(this.todaysDate, 'months');
    // console.log('Month: ' + this.monthDiffAtt);
    // console.log('Month: ' + this.monthDiffVerizon);
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
