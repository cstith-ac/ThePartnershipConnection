import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('onClick120DayElement') onClick120DayElement: ElementRef;
  @ViewChild('onClick90DayElement') onClick90DayElement: ElementRef;
  @ViewChild('onClickHighRMRElement') onClickHighRMRElement: ElementRef;
  @ViewChild('onClickPendingCancelElement') onClickPendingCancelElement: ElementRef;
  @ViewChild('onClick60DayElement') onClick60DayElement: ElementRef;
  @ViewChild('onClick30DayElement') onClick30DayElement: ElementRef;
  @ViewChild('onClickRMTElement') onClickRMTElement: ElementRef;
  @ViewChild('onClickAllCustomersElement') onClickAllCustomersElement: ElementRef;

  tpcPartnerAgingReport: TPCPartnerAgingReport[];
  public displayArr:any[] = []

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

  collectionSize: number;
  public toggle120 : boolean = false;
  public toggle90 : boolean = false;
  public toggleHigh : boolean = false;
  public togglePending : boolean = false;
  public toggle60 : boolean = false;
  public toggle30 : boolean = false;
  public toggleRMT : boolean = false;
  public toggleAll : boolean = false;

  public value=5;

  agingListForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private modalService: NgbModal,
    public jwtHelper: JwtHelperService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.agingListForm = this.fb.group({
      minimumAmountDue: 5
    })

    $("#wrapper").addClass("toggled");

    setTimeout(() => {

      let element120Day = this.onClick120DayElement.nativeElement;
      element120Day.classList.add('active');

      let element90Day = this.onClick90DayElement.nativeElement;
      element90Day.classList.add('active');

      // let elementHighRMR = this.onClickHighRMRElement.nativeElement;
      // elementHighRMR.classList.add('active');

      // let elementPendingCancel = this.onClickPendingCancelElement.nativeElement;
      // elementPendingCancel.classList.add('active');

      // let element60Day = this.onClick60DayElement.nativeElement;
      // element60Day.classList.add('active');

      // let element30Day = this.onClick30DayElement.nativeElement;
      // element30Day.classList.add('active');

      // let elementRMT = this.onClickRMTElement.nativeElement;
      // elementRMT.classList.add('active');

      // let elementAllCustomers = this.onClickAllCustomersElement.nativeElement;
      // elementAllCustomers.classList.add('active');

      // console.log(this.onClick120DayElement.nativeElement);
      // console.log(this.onClick90DayElement.nativeElement);
      // console.log(this.onClickHighRMRElement.nativeElement);
      // console.log(this.onClickPendingCancelElement.nativeElement);
      // console.log(this.onClick60DayElement.nativeElement);
      // console.log(this.onClick30DayElement.nativeElement);
      // console.log(this.onClickRMTElement.nativeElement);
      // console.log(this.onClickAllCustomersElement.nativeElement);
    }, 8);

    this.spinnerService.show();

    this.routeService.getTPCPartnerAgingReport().subscribe(
      res => {
        if(res) {
          this.spinnerService.hide()
        }

        this.tpcPartnerAgingReport = res;

        this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          // val.filterCategory.toLowerCase().includes('120' || '90' || 'high'))
          
          // val.filterCategory.toLowerCase().includes('120') || val.filterCategory.toLowerCase().includes('high'))

          val.filterCategory.toLowerCase().includes('over 120, high rmr') || val.filterCategory.toLowerCase().includes('over 120') || val.filterCategory.toLowerCase().includes('over 90'))
          this.collectionSize = this.tpcPartnerAgingReport.length;
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

  onClick120Day(value: string) {

    if(value !== '90' && value !== 'high') {
      //console.log('the value is: ' + value)
      
      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;

          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes('120'));
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )
      this.toggle120 = !this.toggle120;  

      // console.log(value)

      // let clickedElement = this.onClick120DayElement.nativeElement;
      // if(clickedElement === this.onClick120DayElement.nativeElement) {
      //   let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");

      //   if( isCertainButtonAlreadyActive ) {
      //     isCertainButtonAlreadyActive.classList.remove("active");
      //   }
      // }

      // clickedElement.className += " active";
      
    }
    
    // this.routeService.getTPCPartnerAgingReport().subscribe(
    //   res => {
    //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    //     val.filterCategory.toLowerCase().includes('120'));
    //     this.collectionSize = this.tpcPartnerAgingReport.length;
    //   }
    // )

    //check if another button is clicked
    // console.log(this.tpcPartnerAgingReport)
    // console.log(this.onClick120DayElement.nativeElement.value)
    // console.log(value)
    
  }

  onClick90Day(value: string) {
    if(value !== '120') {
      // console.log('the value is: ' + value)

      let element120Day = this.onClick120DayElement.nativeElement;
      element120Day.classList.remove('active');

      let elementHighRMR = this.onClickHighRMRElement.nativeElement;
      elementHighRMR.classList.remove('active');

      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;
          
          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes('90'));
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )

      this.toggle90 = !this.toggle90;

      // let clickedElement = this.onClick90DayElement.nativeElement;
      
      // console.log(clickedElement)
      // console.log(this.onClick90DayElement.nativeElement)
      
      // if(clickedElement === this.onClick90DayElement.nativeElement) {
      //   let isCertainButtonAlreadyActive = clickedElement.classList.contains("active");
      //   console.log(isCertainButtonAlreadyActive)
      //   // if( this.onClick90DayElement.nativeElement ) {
      //   //   this.onClick90DayElement.nativeElement.remove("active");
      //   // }

      //   clickedElement.className += " active";
      //   if(clickedElement.classList.contains("active")) {
      //     clickedElement.classList.remove("active")
      //   }
      // }

    }

    // this.routeService.getTPCPartnerAgingReport().subscribe(
    //   res => {
    //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    //   val.filterCategory.toLowerCase().includes('90'));
    //   this.collectionSize = this.tpcPartnerAgingReport.length;
    //     }
    //   )   
  }

  onClickHighRMR(value: string) {
    if(value !== '120') {
      // console.log('the value is: ' + value)

      // let element120Day = this.onClick120DayElement.nativeElement;
      // element120Day.classList.remove('active');

      // let element90Day = this.onClick90DayElement.nativeElement;
      // element90Day.classList.remove('active');
      
      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;
          
          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          // val.filterCategory.toLowerCase().includes('high'));
          val.filterCategory.toLowerCase().includes('over 120, high rmr') || val.filterCategory.toLowerCase().includes('over 120') || val.filterCategory.toLowerCase().includes('over 90'))
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )

      this.toggleHigh = !this.toggleHigh;
    }
    
    // this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    // val.filterCategory.toLowerCase().includes('high'));
    // this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  onClickPendingCancel(value: string) {
    if(value !== '120') {
      let element120Day = this.onClick120DayElement.nativeElement;
      element120Day.classList.remove('active');

      let element90Day = this.onClick90DayElement.nativeElement;
      element90Day.classList.remove('active');

      let elementHighRMR = this.onClickHighRMRElement.nativeElement;
      elementHighRMR.classList.remove('active');
      
      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;
          
          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes('pending'));
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )

      this.togglePending = !this.togglePending;
    }

    // this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    // val.filterCategory.toLowerCase().includes('pending'));
    // this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  onClick60Day(value: string) {
    if(value !== '120') {
      let element120Day = this.onClick120DayElement.nativeElement;
      element120Day.classList.remove('active');

      let element90Day = this.onClick90DayElement.nativeElement;
      element90Day.classList.remove('active');

      let elementHighRMR = this.onClickHighRMRElement.nativeElement;
      elementHighRMR.classList.remove('active');
      
      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;
          
          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes('60'));
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )

      this.toggle60 = !this.toggle60;
    }

    // this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    // val.filterCategory.toLowerCase().includes('60'));
    // this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  onClick30Day(value: string) {
    if(value !== '120') {
      let element120Day = this.onClick120DayElement.nativeElement;
      element120Day.classList.remove('active');

      let element90Day = this.onClick90DayElement.nativeElement;
      element90Day.classList.remove('active');

      let elementHighRMR = this.onClickHighRMRElement.nativeElement;
      elementHighRMR.classList.remove('active');
      
      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;
          
          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes('30'));
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )

      this.toggle30 = !this.toggle30;
    }

    // this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    // val.filterCategory.toLowerCase().includes('30'));
    // this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  onClickRMT(value: string) {
    if(value !== '30') {
      let element120Day = this.onClick120DayElement.nativeElement;
      element120Day.classList.remove('active');

      let element90Day = this.onClick90DayElement.nativeElement;
      element90Day.classList.remove('active');

      let elementHighRMR = this.onClickHighRMRElement.nativeElement;
      elementHighRMR.classList.remove('active');
      
      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;
          
          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes('rmt'));
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )

      this.toggleRMT = !this.toggleRMT;
    }

    // this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    // val.filterCategory.toLowerCase().includes('rmt'));
    // this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  onClickAllCustomers(value: string) {
    if(value !== '120' && value !== '30') {
      let element120Day = this.onClick120DayElement.nativeElement;
      element120Day.classList.remove('active');

      let element90Day = this.onClick90DayElement.nativeElement;
      element90Day.classList.remove('active');

      let elementHighRMR = this.onClickHighRMRElement.nativeElement;
      elementHighRMR.classList.remove('active');
      
      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;
          
          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes(''));
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )

      this.toggleAll = !this.toggleAll;
    }

    // this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    // val.filterCategory.toLowerCase().includes(''));
    // this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  search(value: string): void {
    console.log(value)
    this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    // val.activeRMR.toLowerCase().includes(value));
    val.filterCategory.toString().toLowerCase().includes(value));
    this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  searchMinimumAmountDue(value: string): void {
    console.log(value)
    this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    // val.activeRMR.toLowerCase().includes(value));
    val.pastDue.toString().toLowerCase().includes(value));
    this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  resetMinimumAmountDue() {
    this.tpcPartnerAgingReport;

      this.spinnerService.show();

      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }

          this.tpcPartnerAgingReport = res;
          
          this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes(''));
          this.collectionSize = this.tpcPartnerAgingReport.length;
        }
      )

      this.agingListForm.controls['minimumAmountDue'].setValue(5)
  }

  openComingSoonModal(comingSoon) {
    this.modalService.open(comingSoon,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class'
      });
  }
}
