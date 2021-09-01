import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PartnerServiceListing } from 'src/app/models/partnerservicelisting';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-partnerservicelisting',
  templateUrl: './partnerservicelisting.component.html',
  styleUrls: ['./partnerservicelisting.component.css']
})
export class PartnerservicelistingComponent implements OnInit {
  partnerServiceListing: PartnerServiceListing[];
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  pageSize=10;
  service_Ticket_Id;
  ticket_Number;
  creation_Date;
  problem_Code;
  contactName;
  contactPhone;
  acContact;
  sitePhone;
  acContactEmail;
  customer_Number;
  customer_Name;
  customerRMR;
  customer_Since;
  cancelStatus;
  business_Name;
  comResStatus;
  address_1;
  address_2;
  address_3;
  city;
  state;
  zipCode;
  status3G;
  csAccount;
  systemType;
  panelType;
  centralStation;
  panel_Location;

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
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    $("#wrapper").addClass("toggled");

    this.spinnerService.show();

    this.routeService.getPartnerServiceListing().subscribe(
    res => {
      if(res) {
        this.spinnerService.hide()
      }
      
      this.partnerServiceListing = [].concat(res);
      
    })
  }

  onOpenPartnerServiceListingModal(service_Ticket_Id: number, ticket_Number: number, creation_Date: Date, problem_Code: string, contactName: string, contactPhone: string, acContact: string, sitePhone: string, acContactEmail: string, customer_Number: string, customer_Name: string, customerRMR: number,  customer_Since: Date, cancelStatus: string, business_Name: string, comResStatus: string, address_1: string, address_2: string, address_3: string, city: string, state: string, zipCode: string, status3G: string, csAccount: string, systemType: string, panelType: string, centralStation: string, panel_Location: string) {
    $("#detailsModal").modal("show");

    this.service_Ticket_Id = service_Ticket_Id;
    this.ticket_Number = ticket_Number;
    this.creation_Date = creation_Date;
    this.problem_Code = problem_Code;
    this.contactName = contactName;
    this.contactPhone = contactPhone;
    this.acContact = acContact;
    this.sitePhone = sitePhone;
    this.acContactEmail = acContactEmail;
    this.customer_Number = customer_Number;
    this.customer_Name = customer_Name;
    this.customerRMR = customerRMR;
    this.customer_Since = customer_Since;
    this.cancelStatus = cancelStatus;
    this.business_Name = business_Name;
    this.comResStatus = comResStatus;
    this.address_1 = address_1;
    this.address_2 = address_2;
    this.address_3 = address_3;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.status3G = status3G;
    this.csAccount = csAccount;
    this.systemType = systemType;
    this.panelType = panelType;
    this.centralStation = centralStation;
    this.panel_Location = panel_Location;

    // this.incentiveID = incentiveID;

    console.log(this.service_Ticket_Id);
    console.log(this.creation_Date);
    console.log(this.problem_Code);
    console.log(this.contactName);
    console.log(this.contactPhone)
   
  }

  onOpenMemo() {
    console.log('open memo modal')
  }

  onAddDocument() {
    console.log('add doc')
  }

  openComingSoonModal(comingSoon) {
    this.modalService.open(comingSoon,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class'
      });
  }

}
