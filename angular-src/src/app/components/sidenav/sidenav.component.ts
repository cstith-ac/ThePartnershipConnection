import { Component, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
//import * as $ from 'jquery';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';
import { Router, UrlSegment } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouteService } from '../../services/route.service';
import { PInformation } from 'src/app/models/pinformation';
import { PInformationNew } from 'src/app/models/pinformationnew';
import { ContactList } from 'src/app/models/contactlist';
import { ContactListAdditional } from 'src/app/models/contactlistadditional';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { UserService } from 'src/app/services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @ViewChild("userDropdown") userDropdown: ElementRef;

  @Input() message: string;

  currentApplicationVersion = environment.appVersion;

  user:any=Object;
  partnerInformation: PInformation[];
  partnerInformationNew: PInformationNew[];
  contactList: ContactList[];
  contactListAdditional: ContactListAdditional[];
  dashboardinfo: DashboardInfo[];

  activeTab: string = "tab-1"

  currentUser$ = this.currentUserService.data$;

  baseUrl = environment.baseUrl;

  // showSplash=true;

  constructor(
    private currentUserService: UserService,
    private spinnerService: NgxSpinnerService,
    public routeService: RouteService,
    public authService: AuthService,
    private router: Router,
    private elementRef: ElementRef,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    // this.showSplash;

    this.currentUserService.getCurrentUser();
    //console.log(this.currentUser$);
    
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

    // Customer Care x Service Notes Tabs
    $(function () {
      var $tabButtonItem = $('#tab-button-partner li'),
          $tabSelect = $('#tab-select-partner'),
          $tabContents = $('.tab-contents'),
          activeClass = 'is-active';

      $tabButtonItem.first().addClass(activeClass);
      $tabContents.not(':first').hide();

      $tabButtonItem.find('a').on('click', function (e) {
        var target = $(this).attr('href');

        $tabButtonItem.removeClass(activeClass);
        $(this).parent().addClass(activeClass);
        $tabSelect.val(target);
        $tabContents.hide();
        $(target).show();
        e.preventDefault();
       
      });

      $tabSelect.on('change', function () {
        var target = $(this).val(),
            targetSelectNum = $(this).prop('selectedIndex');

        $tabButtonItem.removeClass(activeClass);
        $tabButtonItem.eq(targetSelectNum).addClass(activeClass);
        $tabContents.hide();
        $(target).show();
      });
    });

    // if(this.authService.isTestUser()) {
    //   setTimeout(() => {
    //     console.log(this.elementRef.nativeElement)
    //     $('.testUserHide').hide()
    //   }, 1)
    // }
    this.currentUser$.subscribe(res => {
      // console.log(res.userName)
      // let user = JSON.stringify(res.userName);
      // console.log(user)
      // let firstInitial = String(user).charAt(0).toUpperCase();
      // console.log(firstInitial)
    })

    // let user = localStorage.getItem('userName');
    // console.log(user)
  }

  ngAfterViewInit() {
    //console.log('update user')
  }

  onLogoutClick() {
    this.authService.logout();

    const user: any = JSON.parse(localStorage.getItem('user'));
    console.log(user.afaRole);
    if(user.afaRole == 5) {
      // if live
      if(location.hostname === 'www.thepartnershipconnection.com') {
        window.location.href = 'https://www.alarmconnections.com/current-partners/'
      }
      // if test from alarm connections staging
      if(location.hostname === 'partnercon-test-staging.azurewebsites.net') {
        // window.location.href = 'https://dev-alarm-connections.pantheonsite.io/'
        window.location.href = 'https://partnercon-test-staging.azurewebsites.net' 
      }
      // if test from localhost
      if(location.hostname === 'localhost') {
        //window.location.href = 'https://dev-alarm-connections.pantheonsite.io/' 
        this.router.navigate(['/login']);
      }
    } else if(user.afaRole == 19 || user.afaRole == 14 || user.afaRole == 9) {
      this.router.navigate(['/login']);
    }
    //return false;

    //implementing this workaround until the JS in the auth service is fixed
    localStorage.clear();
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // localStorage.removeItem('companyName');
    // localStorage.removeItem('partnerCode');
    // localStorage.removeItem('installCompanyID');
    // localStorage.removeItem('totalRecurringCalc');
    // localStorage.removeItem('totalEquipMatCalc');
    // localStorage.removeItem('totalLaborChargesCalc');
    // localStorage.removeItem('invoiceDate');
    // localStorage.removeItem('invoiceNumber');
    // localStorage.removeItem('invoiceTotal');
    // localStorage.removeItem('recurringentry');
    // localStorage.removeItem('equipmatentry');
    // localStorage.removeItem('laborchargesentry');
    // localStorage.removeItem('invoice');
    // localStorage.removeItem('subscriberForm');
    // localStorage.removeItem('subscriberFormName');
    // localStorage.removeItem('siteVisit');
    // localStorage.removeItem('siteVisitName');
    // localStorage.removeItem('otherDocument1');
    // localStorage.removeItem('otherDocument1Name');
    // localStorage.removeItem('contract');
    // localStorage.removeItem('contractName');
    // localStorage.removeItem('otherDocument2');
    // localStorage.removeItem('otherDocument2Name');
    // localStorage.removeItem('invoiceName');
    // localStorage.removeItem('invoiceFileSize');
    // localStorage.removeItem('contractDate');
    // localStorage.removeItem('contractTerm');
    // localStorage.removeItem('serviceIncluded');
    // localStorage.removeItem('customerId');
    // localStorage.removeItem('customerName');
    // localStorage.removeItem('customerSiteName');
    // localStorage.removeItem('customerSystemInformation');
    // localStorage.removeItem('alarmAccount');
    // localStorage.removeItem('systemType');
    // localStorage.removeItem('panelType');
    // localStorage.removeItem('panelLocation');
    // localStorage.removeItem('centralStationID');
    // localStorage.removeItem('customerSiteId');
    // localStorage.removeItem('renewal');
    // localStorage.removeItem('tax');
    // localStorage.removeItem('partnerTaxAmount');
    // localStorage.removeItem('additionalInfo');
    // localStorage.removeItem('partnerComments');
    // localStorage.removeItem('signalsTested');
    // localStorage.removeItem('siteName');
    // localStorage.removeItem('checkBoxAutoInsertList');
    // localStorage.removeItem('results');
    // localStorage.removeItem('removeSplash');
    // localStorage.removeItem('InstructionsShown');
    // localStorage.removeItem('customer_Id');
    // localStorage.removeItem('customer_Site_Id');
    // localStorage.removeItem('customer_System_Id');
    // localStorage.removeItem('ticket_Number');
    // localStorage.removeItem("customer_Number");
    // localStorage.removeItem("customer_Name");
    // localStorage.removeItem("business_Name");
    // localStorage.removeItem("address_1");
    // localStorage.removeItem("systemType");
    // localStorage.removeItem("csAccount");
    // localStorage.removeItem("panel_Location");
    // localStorage.removeItem("centralStation");
    // localStorage.removeItem("central_Station_ID");
    // localStorage.removeItem("panel_Type_Id");

    this.flashMessage.show('You are logged out', {
      cssClass:'alert-success',
      timeout: 3000
    });

    // const user: any = JSON.parse(localStorage.getItem('user'));
    // console.log(user.afaRole);
    // if(user.afaRole == 5) {
    //   window.location.href = 'https://www.alarmconnections.com/current-partners/'
    // } else if(user.afaRole == 19) {
    //   this.router.navigate(['/login']);
    // }
    return false;
  }

  showPartnerWindowModal() {
    $("#partnerWindowModal").modal("show");
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 2000)

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        //console.log(JSON.parse(localStorage.getItem('user')))
      },
      err => {
        console.log(err);
      }
    )

    this.routeService.getPartnerInformation().subscribe(
      res => {
        //console.log(res);
        this.partnerInformation = res;
      }
    )

    this.routeService.getPartnerInformationNew().subscribe(
      res => {
        //console.log(res);
        this.partnerInformationNew = res;
      }
    )

    this.routeService.getPartnerContactList().subscribe(
      res => {
        //console.log(res);
        this.contactList = res;
      }
    )

    this.routeService.getPartnerContactListAdditional().subscribe(
      res => {
        //console.log(res);
        this.contactListAdditional = res;
      }
    )

    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        this.dashboardinfo = res;
      }
    )

  }

  toggleShow(newTab: string): void {
    //this.isShown = !this.isShown;
    this.activeTab = newTab;
  }

  removeDashboardData() {
    $("#wrapper").toggleClass("toggled");
    
    localStorage.removeItem('installCompanyID');
    localStorage.removeItem('totalRecurringCalc');
    localStorage.removeItem('totalEquipMatCalc');
    localStorage.removeItem('totalLaborChargesCalc');
    localStorage.removeItem('invoiceDate');
    localStorage.removeItem('invoiceNumber');
    localStorage.removeItem('invoiceTotal');
    localStorage.removeItem('recurringentry');
    localStorage.removeItem('equipmatentry');
    localStorage.removeItem('laborchargesentry');
    localStorage.removeItem('invoice');
    localStorage.removeItem('subscriberForm');
    localStorage.removeItem('siteVisit');
    localStorage.removeItem('otherDocument1');
    localStorage.removeItem('contract');
    localStorage.removeItem('otherDocument2');
    localStorage.removeItem('contractDate');
    localStorage.removeItem('contractTerm');
    localStorage.removeItem('serviceIncluded');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerSiteName');
    localStorage.removeItem('customerSystemInformation');
    localStorage.removeItem('alarmAccount');
    localStorage.removeItem('systemType');
    localStorage.removeItem('panelType');
    localStorage.removeItem('panelLocation');
    localStorage.removeItem('centralStationID');
    localStorage.removeItem('customerSiteId');
    localStorage.removeItem('renewal');
    localStorage.removeItem('tax');
    localStorage.removeItem('additionalInfo');
    localStorage.removeItem('partnerComments');
    localStorage.removeItem('signalsTested');
  }

  automaticallyCloseNav() {
    $("#wrapper").toggleClass("toggled");
  }

}
