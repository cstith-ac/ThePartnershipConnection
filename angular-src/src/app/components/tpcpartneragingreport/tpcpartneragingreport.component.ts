import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TPCPartnerAgingReport } from 'src/app/models/tpcpartneragingreport';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;
const moment = require('moment');

@Component({
  selector: 'app-tpcpartneragingreport',
  templateUrl: './tpcpartneragingreport.component.html',
  styleUrls: ['./tpcpartneragingreport.component.css']
})
export class TpcpartneragingreportComponent implements OnInit {
  tpcPartnerAgingReport: TPCPartnerAgingReport[];

  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  pageSize=10;

  customer_Id;
  customer_Number;
  customer_Name;
  activeRMR;
  filterCategory;
  customerSince;
  lastPay;
  lastPayAmount;
  pastDue;
  bal_Current;
  totalDue;
  collectionQueue;
  pendingCancellation;
  commercialAccount;
  guaranteeStatus;
  address_1;
  address_2;
  address_3;
  city;
  state;
  zipCode;
  emailAddress;
  primaryPhone;
  alternatePhone;

  filter90Day="90Day";
  collectionSize: number;

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

    this.routeService.getTPCPartnerAgingReport().subscribe(
      res => {
        if(res) {
          this.spinnerService.hide()
        }

        this.tpcPartnerAgingReport = res;
      }
    )

  }

  onOpenPartnerAgingReportModal(customer_Id: number, customer_Number: string, customer_Name: string, activeRMR: number, filterCategory: string, customerSince: string, lastPay: string, lastPaymentAmount: number, pastDue: number, bal_Current: number, totalDue: number, collectionQueue: string, pendingCancellation: string, commercialAccount: string, guaranteeStatus: string, address_1: string, address_2: string, address_3: string, city: string, state: string, zipCode: string, emailAddress: string, primaryPhone: string, alternatePhone: string) {
    $("#detailsModal").modal("show");
    this.customer_Id = customer_Id;
    this.customer_Number = customer_Number;
    this.customer_Name = customer_Name;
    this.activeRMR = activeRMR;
    this.filterCategory = filterCategory;
    this.customerSince = customerSince;
    this.lastPay = lastPay;
    this.lastPayAmount = lastPaymentAmount;
    this.pastDue = pastDue;
    this.bal_Current = bal_Current;
    this.totalDue = totalDue;
    this.collectionQueue = collectionQueue;
    this.pendingCancellation = pendingCancellation;
    this.commercialAccount = commercialAccount;
    this.guaranteeStatus = guaranteeStatus;
    this.address_1 = address_1;
    this.address_2 = address_2;
    this.address_3 = address_3;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.emailAddress = emailAddress;
    this.primaryPhone = primaryPhone;
    this.alternatePhone = alternatePhone;

    if(this.commercialAccount == 'Y') {
      this.commercialAccount = 'Commercial'
    }
    if(this.commercialAccount == 'N') {
      this.commercialAccount = 'Residential'
    }
  }

  onSubmitMessage() {
    console.log('submit message');
  }

  onClickHighRMR(e) {
    console.log('high rmr');
  }

  onClick120Day(e) {
    console.log('120 day');
  }

  onClick90Day(e) {
    console.log('90 day');
  }

  search(value: string): void {
    console.log(value)
    this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    val.filterCategory.toLowerCase().includes(value));
    this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  onClickPendingCancel(e) {
    console.log('pending cancel');
  }

  onClick60Day(e) {
    console.log('60 day');
  }

  onClick30Day(e) {
    console.log('30 day');
  }

  onClickRMT(e) {
    console.log('RMT');
  }

  onClickAllCustomers(e) {
    console.log('all customers');
  }
}
