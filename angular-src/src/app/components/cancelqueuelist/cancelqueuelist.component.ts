import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { filter, mergeMap, switchMap, pairwise } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from 'src/app/services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CancelQueueList } from 'src/app/models/cancelqueuelist';
import { CancelQueueSiteList } from 'src/app/models/cancelqueuesitelist';
import { PermissionsUserMap } from 'src/app/models/permissionsusermap';

import { DataStateChangeEvent, ExcelCommandDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { Workbook, WorkbookSheetColumn, WorkbookSheet, WorkbookSheetRow, WorkbookSheetRowCell, WorkbookSheetFilter, WorkbookOptions, workbookOptions } from '@progress/kendo-angular-excel-export';
import { saveAs } from "@progress/kendo-file-saver";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
declare var $: any;

@Component({
  selector: 'app-cancelqueuelist',
  templateUrl: './cancelqueuelist.component.html',
  styleUrls: ['./cancelqueuelist.component.css']
})
export class CancelqueuelistComponent implements OnInit {
  cancelQueueList: CancelQueueList[];
  cancelQueueSiteList: CancelQueueSiteList[];
  cancelQueueListForm: FormGroup;
  emailAddress;
  cancel_Queue_Id;
  customer_Number;
  customer_Name;
  rmR_Reason_Code;
  cancelledRMR;
  memo;
  notice_Date;
  effective_Date;
  e_Mail;
  full_Cancel;
  sedonaContactEmail;
  partnerName;
  userName: any;

  clicked = false;//disables button after click
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];

  public gridData: any[];
  public pageSize: number = 5;
  public fileName: string;
  public today = new Date().toDateString();
  public selectedKeys = [];

  @ViewChild("dateTime") dateTimeView: ElementRef;

  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    public jwtHelper: JwtHelperService,
    public datePipe: DatePipe
  ) {
    this.gridData = this.cancelQueueList;
    this.allData = this.allData.bind(this);
   }

  ngOnInit() {
    $("#wrapper").addClass("toggled");

    if(localStorage.getItem('sedonaContactEmail') && localStorage.getItem('partnerName')) {
      // console.log('this works')
      this.sedonaContactEmail = localStorage.getItem('sedonaContactEmail')
      this.partnerName = localStorage.getItem('partnerName')
    }

    this.spinnerService.show();

    if(this.sedonaContactEmail) {
      // console.log(this.sedonaContactEmail + ' is the alias user')
      this.userName = this.sedonaContactEmail;

      this.authService.getProfile().pipe(
        mergeMap((res:any) => this.routeService.getCancelQueueListX(res.userName,this.sedonaContactEmail))
      ).subscribe(data => {
        if(data.status === 200) {
          this.spinnerService.hide()
          console.log(data.statusText)
        }
        this.cancelQueueList = data.body;
        this.gridData = data.body;

        for(let i = 0; i < this.gridData.length; i++) {
          var formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
          });
          // console.log(this.gridData[i].cancelledRMR);
          // console.log(typeof this.gridData[i].cancelledRMR);

          this.gridData[i].cancelledRMR = formatter.format(this.gridData[i].cancelledRMR);
          this.gridData[i].balance_Of_Contract = formatter.format(this.gridData[i].balance_Of_Contract);
          this.gridData[i].effective_Date = this.datePipe.transform(this.gridData[i].effective_Date,'MMM dd, yyyy');
        }

      },(err:HttpErrorResponse) => {
        this.flashMessage.show('There was a problem with your requested data. Please contact an administrator', {
          cssClass: 'text-center alert-danger',
          timeout: 5000
        });
        this.spinnerService.hide();
      })
    }
    if(!this.sedonaContactEmail) {
      // console.log('use the regular stored procedure')
      this.routeService.getCancelQueueList().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide();
          }
          this.cancelQueueList = res;
          this.gridData = res;
  
          for(var i = 0; i < this.cancelQueueList.length; i++) {
            //console.log(this.cancelQueueList[i].full_Cancel)
            if(this.cancelQueueList[i].full_Cancel === 'Y') {
              this.cancelQueueList[i].full_Cancel = 'Full'
            }
            if(this.cancelQueueList[i].full_Cancel === 'N') {
              this.cancelQueueList[i].full_Cancel = 'Partial'
            }
          }
        }
      )
    }

    // this.routeService.getCancelQueueList().subscribe(
    //   res => {
    //     if(res) {
    //       this.spinnerService.hide();
    //     }
    //     this.cancelQueueList = res;

    //     for(var i = 0; i < this.cancelQueueList.length; i++) {
    //       //console.log(this.cancelQueueList[i].full_Cancel)
    //       if(this.cancelQueueList[i].full_Cancel === 'Y') {
    //         this.cancelQueueList[i].full_Cancel = 'Full'
    //       }
    //       if(this.cancelQueueList[i].full_Cancel === 'N') {
    //         this.cancelQueueList[i].full_Cancel = 'Partial'
    //       }
    //     }
    //   }
    // )

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.cancelQueueListForm = this.fb.group({
      EmailAddress: this.emailAddress = JSON.parse(localStorage.getItem('user')).email,
      NoteType: "Cancel",
      Memo: "",
      ServiceTicketID: 1,
      CustomerID: 1,
      IncentiveID: 1,
      CancelQueueID: "",
      ProspectID: 1,
      CustomerSystemID: 1
    })
  }

  public foo: State = {
    skip: 0,
    take: 5
  };

  public mySelection: number[] = [];

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
      }).data
    };

    return result;
  };

  openCancelQueueListDetailsModal(e, cancel_Queue_Id: number, customer_Number: string, customer_Name: string, rmR_Reason_Code: string, cancelledRMR: number, memo: string, notice_Date: Date, effective_Date: Date, e_Mail: string, full_Cancel: string) {
    $("#detailsModal").modal("show");

    e.selectedRows.forEach((x) => {
      console.log(x.dataItem.cancelledRMR);
      console.log(typeof x.dataItem.cancelledRMR);

      this.cancel_Queue_Id = x.dataItem.cancel_Queue_Id;
      this.customer_Number = x.dataItem.customer_Number;
      this.customer_Name = x.dataItem.customer_Name;
      this.rmR_Reason_Code = x.dataItem.rmR_Reason_Code;
      this.cancelledRMR = x.dataItem.cancelledRMR;
      this.notice_Date = x.dataItem.notice_Date;
      this.effective_Date = x.dataItem.effective_Date;
      this.e_Mail = x.dataItem.e_Mail;
      this.full_Cancel = x.dataItem.full_Cancel;
      this.memo = x.dataItem.memo;

      if(this.e_Mail === "") {
        this.e_Mail = "N/A";
      }

      this.cancelQueueListForm.controls["CancelQueueID"].setValue(this.cancel_Queue_Id);
    })

    // this.cancel_Queue_Id = cancel_Queue_Id;
    // this.customer_Number = customer_Number;
    // this.customer_Name = customer_Name;
    // this.rmR_Reason_Code = rmR_Reason_Code;
    // this.cancelledRMR = cancelledRMR;
    // this.notice_Date = notice_Date;
    // this.effective_Date = effective_Date;
    // this.e_Mail = e_Mail;
    // this.full_Cancel = full_Cancel;
    // this.memo = memo;

    // this.cancelQueueListForm.controls["CancelQueueID"].setValue(this.cancel_Queue_Id);

    this.routeService.getCancelQueueSiteList(this.cancel_Queue_Id).subscribe(
      res => {
        //console.log(res)
        this.cancelQueueSiteList = res;
      }
    )
  }

  onOpenMemo() {
    $("#memoModal").modal("show");
  }

  onSubmitMemo(form: FormGroup) {
    //console.log(this.cancelQueueListForm.value)
    this.routeService.postPartnerAddNote(this.cancelQueueListForm.value).subscribe(
      res => {
        //console.log(res)
        $("#detailsModal").modal("hide");
        $("#memoModal").modal("hide");
      },
      error => console.log('error: ', error)
    )
  }

  onChangeBusinessName(e) {
    console.log('name changed to: '+e.target)
  }
}
