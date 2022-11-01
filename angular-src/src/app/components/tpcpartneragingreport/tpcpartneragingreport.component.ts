import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TPCPartnerAgingReport } from 'src/app/models/tpcpartneragingreport';
import * as XLSX from 'xlsx';
import { DataStateChangeEvent, ExcelCommandDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, filterBy, orderBy, process, SortDescriptor, State } from '@progress/kendo-data-query';
import { Workbook, WorkbookSheetColumn, WorkbookSheet, WorkbookSheetRow, WorkbookSheetRowCell, WorkbookSheetFilter, WorkbookOptions, workbookOptions } from '@progress/kendo-angular-excel-export';
import { saveAs } from "@progress/kendo-file-saver";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
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
  @ViewChild("dateTime") dateTimeView: ElementRef;

  tpcPartnerAgingReport: TPCPartnerAgingReport[];
  public displayArr:any[] = [];
  tpcPartnerAgingReportForm: FormGroup;

  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  //pageSize=10;

  userEmailAddress;

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
  availableCredit;
  availableCash;
  totalDue;
  collectionQueue;
  pendingCancellation;
  commercialAccount;
  bucket_1;
  bucket_2;
  bucket_3;
  bucket_4;
  bucket_5;
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

  public value = 5;

  agingListForm: FormGroup;
  clicked = false;//disables button after click
  sedonaContactEmail;
  partnerName;
  userName: any;

  public gridData: any[];
  public pageSize: number = 10;
  public fileName: string;
  public today = new Date().toDateString();
  public selectedKeys = [];

  constructor(
    public fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private modalService: NgbModal,
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService,
    private renderer: Renderer2,
    public datePipe: DatePipe
  ) { 
    this.gridData = this.tpcPartnerAgingReport;
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    if(localStorage.getItem('sedonaContactEmail') && localStorage.getItem('partnerName')) {
      this.sedonaContactEmail = localStorage.getItem('sedonaContactEmail')
      this.partnerName = localStorage.getItem('partnerName')
    }

    this.agingListForm = this.fb.group({
      minimumAmountDue: 5
    })

    $("#wrapper").addClass("toggled");

    this.spinnerService.show();

    if(this.sedonaContactEmail) {
      this.userName = this.sedonaContactEmail;

      this.authService.getProfile().pipe(
        mergeMap((res:any) => this.routeService.getTPCPartnerAgingReportX(res.userName,this.sedonaContactEmail))
      ).subscribe(data => {
        if(data.status === 200) {
          this.spinnerService.hide()
          console.log(data.statusText)
        }
        this.tpcPartnerAgingReport = data.body;
        this.gridData = data.body;

        for(let i = 0; i < this.gridData.length; i++) {
          this.gridData[i].customer_Since = this.datePipe.transform(this.gridData[i].customer_Since, 'MMM dd, yyyy');

          var formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
          });
          this.gridData[i].pastDue = formatter.format(this.gridData[i].pastDue);
          this.gridData[i].totalDue = formatter.format(this.gridData[i].totalDue);
        }

        this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
          val.filterCategory.toLowerCase().includes('over 120, high rmr') || 
          val.filterCategory.toLowerCase().includes('over 120') || 
          val.filterCategory.toLowerCase().includes('over 90'))
          this.collectionSize = this.tpcPartnerAgingReport.length;
      })
    }
    if(!this.sedonaContactEmail) {
      //console.log('use the regular stored procedure');
      this.routeService.getTPCPartnerAgingReport().subscribe(
        res => {
          this.spinnerService.hide();
          this.tpcPartnerAgingReport = res;
          //this.tpcPartnerAgingReport = res.body;
          this.gridData = res;
        }
      )
    }

    this.tpcPartnerAgingReportForm = this.fb.group({
      EmailAddress: this.userEmailAddress = JSON.parse(localStorage.getItem('user')).email,
      NoteType: "Collections",
      Memo: "",
      ServiceTicketID: 1,
      CustomerID: "",
      IncentiveID: 1,
      CancelQueueID: 1,
      ProspectID: 1,
      CustomerSystemID: 1
    })
  }

  public foo: State = {
    skip: 0,
    take: 5
  };

  public filter: CompositeFilterDescriptor;
  public sort: SortDescriptor[];

  public mySelection: number[] = [];

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        filter: this.filter,
        sort: this.sort,
      }).data,
    };

    return result;
  }

  onOpenPartnerAgingReportModal(e, customer_Id: number, customer_Number: string, customer_Name: string, activeRMR: number, filterCategory: string, customerSince: string, lastPay: string, lastPaymentAmount: number, pastDue: number, bal_Current: number, availableCredit: string, availableCash: string, totalDue: number, collectionQueue: string, pendingCancellation: string, commercialAccount: string, bucket_1: string, bucket_2: string, bucket_3: string, bucket_4: string, bucket_5: string, guaranteeStatus: string, address_1: string, address_2: string, address_3: string, city: string, state: string, zipCode: string, emailAddress: string, primaryPhone: string, alternatePhone: string) {
    $("#detailsModal").modal("show");

    e.selectedRows.forEach((x) => {
      this.customer_Id = x.dataItem.customer_Id;
      this.customer_Number = x.dataItem.customer_Number;
      this.customer_Name = x.dataItem.customer_Name;
      this.activeRMR = x.dataItem.activeRMR;
      this.filterCategory = x.dataItem.filterCategory;
      this.customerSince = x.dataItem.customerSince;
      this.lastPay = x.dataItem.lastPay;
      this.lastPayAmount = x.dataItem.lastPaymentAmount;
      this.pastDue = x.dataItem.pastDue;
      this.bal_Current = x.dataItem.bal_Current;
      this.availableCredit = x.dataItem.availableCredit;
      this.availableCash = x.dataItem.availableCash;
      this.totalDue = x.dataItem.totalDue;
      this.collectionQueue = x.dataItem.collectionQueue;
      this.pendingCancellation = x.dataItem.pendingCancellation;
      this.commercialAccount = x.dataItem.commercialAccount;
      this.bucket_1 = x.dataItem.bucket_1;
      this.bucket_2 = x.dataItem.bucket_2;
      this.bucket_3 = x.dataItem.bucket_3;
      this.bucket_4 = x.dataItem.bucket_4;
      this.bucket_5 = x.dataItem.bucket_5;
      this.guaranteeStatus = x.dataItem.guaranteeStatus;
      this.address_1 = x.dataItem.address_1;
      this.address_2 = x.dataItem.address_2;
      this.address_3 = x.dataItem.address_3;
      this.city = x.dataItem.city;
      this.state = x.dataItem.state;
      this.zipCode = x.dataItem.zipCode;
      this.emailAddress = x.dataItem.emailAddress;
      this.primaryPhone = x.dataItem.primaryPhone;
      this.alternatePhone = x.dataItem.alternatePhone;
    })
    // this.customer_Id = customer_Id;
    // this.customer_Number = customer_Number;
    // this.customer_Name = customer_Name;
    // this.activeRMR = activeRMR;
    // this.filterCategory = filterCategory;
    // this.customerSince = customerSince;
    // this.lastPay = lastPay;
    // this.lastPayAmount = lastPaymentAmount;
    // this.pastDue = pastDue;
    // this.bal_Current = bal_Current;
    // this.totalDue = totalDue;
    // this.collectionQueue = collectionQueue;
    // this.pendingCancellation = pendingCancellation;
    // this.commercialAccount = commercialAccount;
    // this.guaranteeStatus = guaranteeStatus;
    // this.address_1 = address_1;
    // this.address_2 = address_2;
    // this.address_3 = address_3;
    // this.city = city;
    // this.state = state;
    // this.zipCode = zipCode;
    // this.emailAddress = emailAddress;
    // this.primaryPhone = primaryPhone;
    // this.alternatePhone = alternatePhone;

    if(this.commercialAccount == 'Y') {
      this.commercialAccount = 'Commercial'
    }
    if(this.commercialAccount == 'N') {
      this.commercialAccount = 'Residential'
    }

    this.tpcPartnerAgingReportForm.controls["CustomerID"].setValue(this.customer_Id);
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.gridData = filterBy(this.tpcPartnerAgingReport, filter);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridData = orderBy(this.tpcPartnerAgingReport, sort);
  }

  onOpenMessageModal() {
    $("#messageModal").modal("show");
  }

  onSubmitMessage(form: FormGroup) {
    // console.log(this.tpcPartnerAgingReportForm.value);

    this.routeService.postPartnerAddNote(this.tpcPartnerAgingReportForm.value).subscribe(
      res => {
        //console.log(res)
        $("#detailsModal").modal("hide");
        $("#memoModal").modal("hide");

        this.tpcPartnerAgingReportForm.get('Memo').setValue('');
      },
      error => console.log('error: ', error)
    )
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
    
  }

  onClick90Day(value: string) {
    if(value !== '120') {

      let element120Day = this.onClick120DayElement.nativeElement;
      element120Day.classList.remove('active');

      let elementHighRMR = this.onClickHighRMRElement.nativeElement;
      elementHighRMR.classList.remove('active');

      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      if(this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReportX(this.userEmailAddress,this.sedonaContactEmail).subscribe(
          res => {
            if(res.status===200) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res.body;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes('90'));
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      if(!this.sedonaContactEmail) {
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
      }

      // this.routeService.getTPCPartnerAgingReport().subscribe(
      //   res => {
      //     if(res) {
      //       this.spinnerService.hide()
      //     }

      //     this.tpcPartnerAgingReport = res;
          
      //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
      //     val.filterCategory.toLowerCase().includes('90'));
      //     this.collectionSize = this.tpcPartnerAgingReport.length;
      //   }
      // )

      this.toggle90 = !this.toggle90;

    } 
  }

  onClickHighRMR(value: string) {
    if(value !== '120') {
      
      this.tpcPartnerAgingReport;

      this.spinnerService.show();

      if(this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReportX(this.userEmailAddress,this.sedonaContactEmail).subscribe(
          res => {
            if(res.status===200) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res.body;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes('over 120, high rmr') || val.filterCategory.toLowerCase().includes('over 120') || val.filterCategory.toLowerCase().includes('over 90'))
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      if(!this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReport().subscribe(
          res => {
            if(res) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes('over 120, high rmr') || val.filterCategory.toLowerCase().includes('over 120') || val.filterCategory.toLowerCase().includes('over 90'))
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      // this.routeService.getTPCPartnerAgingReport().subscribe(
      //   res => {
      //     if(res) {
      //       this.spinnerService.hide()
      //     }

      //     this.tpcPartnerAgingReport = res;
          
      //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
      //     val.filterCategory.toLowerCase().includes('over 120, high rmr') || val.filterCategory.toLowerCase().includes('over 120') || val.filterCategory.toLowerCase().includes('over 90'))
      //     this.collectionSize = this.tpcPartnerAgingReport.length;
      //   }
      // )

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

      if(this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReportX(this.userEmailAddress,this.sedonaContactEmail).subscribe(
          res => {
            if(res.status===200) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res.body;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes('pending'));
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      if(!this.sedonaContactEmail) {
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
      }

      // this.routeService.getTPCPartnerAgingReport().subscribe(
      //   res => {
      //     if(res) {
      //       this.spinnerService.hide()
      //     }

      //     this.tpcPartnerAgingReport = res;
          
      //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
      //     val.filterCategory.toLowerCase().includes('pending'));
      //     this.collectionSize = this.tpcPartnerAgingReport.length;
      //   }
      // )

      this.togglePending = !this.togglePending;
    }
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

      if(this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReportX(this.userEmailAddress,this.sedonaContactEmail).subscribe(
          res => {
            if(res.status===200) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res.body;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes('60'));
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      if(!this.sedonaContactEmail) {
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
      }

      // this.routeService.getTPCPartnerAgingReport().subscribe(
      //   res => {
      //     if(res) {
      //       this.spinnerService.hide()
      //     }

      //     this.tpcPartnerAgingReport = res;
          
      //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
      //     val.filterCategory.toLowerCase().includes('60'));
      //     this.collectionSize = this.tpcPartnerAgingReport.length;
      //   }
      // )

      this.toggle60 = !this.toggle60;
    }
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

      if(this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReportX(this.userEmailAddress,this.sedonaContactEmail).subscribe(
          res => {
            if(res.status===200) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res.body;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes('30'));
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      if(!this.sedonaContactEmail) {
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
      }

      // this.routeService.getTPCPartnerAgingReport().subscribe(
      //   res => {
      //     if(res) {
      //       this.spinnerService.hide()
      //     }

      //     this.tpcPartnerAgingReport = res;
          
      //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
      //     val.filterCategory.toLowerCase().includes('30'));
      //     this.collectionSize = this.tpcPartnerAgingReport.length;
      //   }
      // )

      this.toggle30 = !this.toggle30;
    }
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

      if(this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReportX(this.userEmailAddress,this.sedonaContactEmail).subscribe(
          res => {
            if(res.status===200) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res.body;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes('rmt'));
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      if(!this.sedonaContactEmail) {
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
      }

      // this.routeService.getTPCPartnerAgingReport().subscribe(
      //   res => {
      //     if(res) {
      //       this.spinnerService.hide()
      //     }

      //     this.tpcPartnerAgingReport = res;
          
      //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
      //     val.filterCategory.toLowerCase().includes('rmt'));
      //     this.collectionSize = this.tpcPartnerAgingReport.length;
      //   }
      // )

      this.toggleRMT = !this.toggleRMT;
    }
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

      if(this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReportX(this.userEmailAddress,this.sedonaContactEmail).subscribe(
          res => {
            if(res.status===200) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res.body;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes(''));
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      if(!this.sedonaContactEmail) {
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
      }

      // this.routeService.getTPCPartnerAgingReport().subscribe(
      //   res => {
      //     if(res) {
      //       this.spinnerService.hide()
      //     }

      //     this.tpcPartnerAgingReport = res;
          
      //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
      //     val.filterCategory.toLowerCase().includes(''));
      //     this.collectionSize = this.tpcPartnerAgingReport.length;
      //   }
      // )

      this.toggleAll = !this.toggleAll;
    }
  }

  search(value: string): void {
    console.log(value)
    this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    val.filterCategory.toString().toLowerCase().includes(value));
    this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  searchMinimumAmountDue(value: string): void {
    console.log(value)
    this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    val.pastDue.toString().toLowerCase().includes(value));
    this.collectionSize = this.tpcPartnerAgingReport.length;
  }

  resetMinimumAmountDue() {
    this.tpcPartnerAgingReport;

      this.spinnerService.show();

      if(this.sedonaContactEmail) {
        this.routeService.getTPCPartnerAgingReportX(this.userEmailAddress,this.sedonaContactEmail).subscribe(
          res => {
            if(res.status===200) {
              this.spinnerService.hide()
            }
  
            this.tpcPartnerAgingReport = res.body;
            
            this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
            val.filterCategory.toLowerCase().includes(''));
            this.collectionSize = this.tpcPartnerAgingReport.length;
          }
        )
      }
      if(!this.sedonaContactEmail) {
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
      }

      // this.routeService.getTPCPartnerAgingReport().subscribe(
      //   res => {
      //     if(res) {
      //       this.spinnerService.hide()
      //     }

      //     this.tpcPartnerAgingReport = res;
          
      //     this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
      //     val.filterCategory.toLowerCase().includes(''));
      //     this.collectionSize = this.tpcPartnerAgingReport.length;
      //   }
      // )

      this.agingListForm.controls['minimumAmountDue'].setValue(5)
  }

  onChangeResetMinAmtDue() {
    console.log('changed')
  }

  openComingSoonModal(comingSoon) {
    this.modalService.open(comingSoon,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class'
      });
  }

  exportexcel() {
    this.tpcPartnerAgingReport = this.tpcPartnerAgingReport.filter((val) => 
    val.filterCategory.toLowerCase().includes('over 120'));
    
    this.collectionSize = this.tpcPartnerAgingReport.length;

    //return
    let element = document.getElementById('excel-table');
    // let foo = this.partnerInvoiceListing.forEach((x) => {
    //   x.vendorInvoiceNumber;
    // });
    // console.log(foo);
    // return
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tpcPartnerAgingReport);
    //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  }
}
