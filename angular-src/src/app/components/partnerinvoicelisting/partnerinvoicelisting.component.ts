import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { filter, mergeMap, switchMap, pairwise } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PartnerInvoiceListing } from 'src/app/models/partnerinvoicelisting';
import { PermissionsUserMap } from 'src/app/models/permissionsusermap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

import { DataStateChangeEvent, ExcelCommandDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, filterBy, orderBy, process, SortDescriptor, State } from '@progress/kendo-data-query';
import { Workbook, WorkbookSheetColumn, WorkbookSheet, WorkbookSheetRow, WorkbookSheetRowCell, WorkbookSheetFilter, WorkbookOptions, workbookOptions } from '@progress/kendo-angular-excel-export';
import { saveAs } from "@progress/kendo-file-saver";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
declare var $: any;

@Component({
  selector: 'app-partnerinvoicelisting',
  templateUrl: './partnerinvoicelisting.component.html',
  styleUrls: ['./partnerinvoicelisting.component.css']
})
export class PartnerinvoicelistingComponent implements OnInit {
  partnerInvoiceListing: PartnerInvoiceListing[];
  partnerInvoiceListingForm: FormGroup;

  emailAddress;
  user;
  firstName;
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  ticketID;
  incentiveID;
  vendorInvoiceNumber;
  invoiceAmount;
  invoiceDate;
  approvedAmount;
  dateEntered;
  heldReason;

  checkNumber;
  checkDate;
  amountPaid;
  creditAmount;
  creditDate;

  determination;
  customer_Number;
  customer_Name;
  relevantMemo;
  relevantComment;
  address_1;
  address_2;
  address_3;
  city;
  state;
  zipCode;
  ticketNumber;
  csAccount;
  activeTab: string = "tab-1"

  id:string;
  //pageSize=10;

  clicked = false;//disables button after click
  sedonaContactEmail;
  partnerName;
  userName: any;
  //fileName='testExcelSheet.xlsx';

  public gridData: any[];
  public pageSize: number = 5;
  public fileName: string;
  public today = new Date().toDateString();
  public selectedKeys = [];

  @ViewChild("dateTime") dateTimeView: ElementRef;

  constructor(
    public fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private authService: AuthService,
    private userService: UserService,
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal
  ) { 
    this.gridData = this.partnerInvoiceListing;
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

    $("#wrapper").addClass("toggled");

    if(localStorage.getItem('sedonaContactEmail') && localStorage.getItem('partnerName')) {
      // console.log('this works')
      this.sedonaContactEmail = localStorage.getItem('sedonaContactEmail')
      this.partnerName = localStorage.getItem('partnerName')
    }

    this.spinnerService.show();

    setTimeout(() => {
      if(this.sedonaContactEmail) {
        this.userName = this.sedonaContactEmail;
  
        let params = {
          "EmailAddress": this.emailAddress,
          "Filter": 1,
          "StartDate": null,
          "EndDate": null,
          "AliasEmail": this.sedonaContactEmail
        }
  
        this.authService.getProfile().pipe(
          mergeMap((res:any) => this.routeService.postPartnerInvoiceListingX(params))
        ).subscribe(data => {
          if(data.status === 200) {
            this.spinnerService.hide();
          }
          this.partnerInvoiceListing = data.body;
          this.gridData = data.body;

          for(let i = 0; i < this.gridData.length; i++) {
            // console.log(this.gridData[i].invoiceAmount);
            var formatter = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2
            });
            this.gridData[i].invoiceAmount = formatter.format(this.gridData[i].invoiceAmount);

            if((this.gridData[i].approvedAmount !== 'Pending') && (this.gridData[i].approvedAmount !== 'On Hold')) {
              this.gridData[i].approvedAmount = formatter.format(this.gridData[i].approvedAmount);
            }
          }

          this.partnerInvoiceListing.some((item, idx) => 
          item.determination !== "Paid" && 
          this.partnerInvoiceListing.unshift( 
            // remove the found item, in-place (by index with splice), 
            // returns an array of a single item removed
            this.partnerInvoiceListing.splice(idx,1)[0] 
          ) );

          // if()
          this.partnerInvoiceListing.sort((a,b) => b.invoiceDate.localeCompare(a.invoiceDate));
          
        },(err:HttpErrorResponse) => {
          this.flashMessage.show('There was a problem with your requested data. Please contact an administrator'+err, {
            cssClass: 'text-center alert-danger',
            timeout: 5000
          });
          this.spinnerService.hide();
        })
      }
    }, 4);

    if(!this.sedonaContactEmail) {
      this.routeService.getPartnerInvoiceListing().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }
          this.partnerInvoiceListing = [].concat(res);
          this.gridData = [].concat(res);
        })
    }
    
    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        this.firstName = this.user.firstName
      },
      err => {
        console.log(err);
      }
    )

    $(function () {
      var $tabButtonItem = $('#tab-button li'),
          $tabSelect = $('#tab-select'),
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

    this.partnerInvoiceListingForm = this.fb.group({
      EmailAddress: this.emailAddress = JSON.parse(localStorage.getItem('user')).email,
      NoteType: "Invoice",
      Memo: "",
      ServiceTicketID: "",
      CustomerID: 1,
      IncentiveID: "",
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

  toggleShow(newTab: string): void {
    this.activeTab = newTab;
  }

  public onOpenPartnerInvoiceListingModal(e, ticketID: number, incentiveID: number, vendorInvoiceNumber: string, invoiceAmount: string, invoiceDate: string, approvedAmount: string, dateEntered: string, heldReason: string, checkNumber: string, checkDate: string, amountPaid: string, creditAmount: string, creditDate: string, determination: string, customer_Number: string, customer_Name: string, relevantMemo: string, relevantComment: string, address_1: string, address_2: string, address_3: string, city: string, state: string, zipCode: string, ticketNumber: string, csAccount: string) {
    console.log(e.deselectedRows)
    $("#detailsModal").modal("show");

    e.selectedRows.forEach((x) => {
      this.ticketID = x.dataItem.ticketID;
      this.incentiveID = x.dataItem.incentiveID;
      this.vendorInvoiceNumber = x.dataItem.vendorInvoiceNumber;
      this.invoiceAmount = x.dataItem.invoiceAmount;
      this.invoiceDate = x.dataItem.invoiceDate;
      this.approvedAmount = x.dataItem.approvedAmount;
      this.dateEntered = x.dataItem.dateEntered;
      this.heldReason = x.dataItem.heldReason;
      this.checkNumber = x.dataItem.checkNumber;
      this.checkDate = x.dataItem.checkDate;
      this.amountPaid = x.dataItem.amountPaid;
      this.creditAmount = x.dataItem.creditAmount;
      this.creditDate = x.dataItem.creditDate;
      this.determination = x.dataItem.determination;
      this.customer_Number = x.dataItem.customer_Number;
      this.customer_Name = x.dataItem.customer_Name;
      //this.relevantMemo = relevantMemo.replace(/^\s+|\s+$/g, '');
      this.relevantMemo = x.dataItem.relevantMemo;
      this.relevantComment = x.dataItem.relevantComment;
      this.address_1 = x.dataItem.address_1;
      this.address_2 = x.dataItem.address_2;
      this.address_3 = x.dataItem.address_3;
      this.city = x.dataItem.city;
      this.state = x.dataItem.state;
      this.zipCode = x.dataItem.zipCode;
      this.ticketNumber = x.dataItem.ticketNumber;
      this.csAccount = x.dataItem.csAccount;

      this.partnerInvoiceListingForm.controls["IncentiveID"].setValue(this.incentiveID);
      this.partnerInvoiceListingForm.controls["ServiceTicketID"].setValue(this.ticketID);
    })
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.gridData = filterBy(this.partnerInvoiceListing, filter);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridData = orderBy(this.partnerInvoiceListing, sort);
  }

  onOpenMessageModal() {
    $("#messageModal").modal("show");
  }

  onSubmitMessage(form: FormGroup) {
    this.routeService.postPartnerAddNote(this.partnerInvoiceListingForm.value).subscribe(
      res => {
        $("#detailsModal").modal("hide");
        $("#memoModal").modal("hide");

        this.partnerInvoiceListingForm.get('Memo').setValue('');
      },
      error => console.log('error: ', error)
    )
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

  exportexcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  }

}
