import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PartnerServiceListing } from 'src/app/models/partnerservicelisting';

import { DataStateChangeEvent, ExcelCommandDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, filterBy, orderBy, process, SortDescriptor, State } from '@progress/kendo-data-query';
import { Workbook, WorkbookSheetColumn, WorkbookSheet, WorkbookSheetRow, WorkbookSheetRowCell, WorkbookSheetFilter, WorkbookOptions, workbookOptions } from '@progress/kendo-angular-excel-export';
import { saveAs } from "@progress/kendo-file-saver";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
declare var $: any;

@Component({
  selector: 'app-partnerservicelisting',
  templateUrl: './partnerservicelisting.component.html',
  styleUrls: ['./partnerservicelisting.component.css']
})
export class PartnerservicelistingComponent implements OnInit {
  partnerServiceListing: PartnerServiceListing[];
  partnerServiceListingForm: FormGroup;
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  // pageSize=10;
  emailAddress;
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
  collectionQueue;
  cancelStatus;
  business_Name;
  comResStatus;
  address_1;
  address_2;
  address_3;
  city;
  state;
  zipCode;
  cityStateZipCode:string;
  status3G;
  csAccount;
  systemType;
  panelType;
  centralStation;
  panel_Location;
  customerComments;

  sedonaContactEmail;
  partnerName;
  userName: any;

  clicked = false;//disables button after click
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
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private flashMessage: FlashMessagesService,
    public jwtHelper: JwtHelperService,
    private modalService: NgbModal,
    public datePipe: DatePipe
  ) { 
    this.gridData = this.partnerServiceListing;
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
      this.sedonaContactEmail = localStorage.getItem('sedonaContactEmail')
      this.partnerName = localStorage.getItem('partnerName')
    }

    this.spinnerService.show();

    if(this.sedonaContactEmail) {
      // console.log('get x stored proc')
      this.userName = this.sedonaContactEmail;

      this.authService.getProfile().pipe(
        mergeMap((res:any) => this.routeService.getPartnerServiceListingX(this.emailAddress,this.sedonaContactEmail))
      ).subscribe(data => {
        if(data.status === 200) {
          this.spinnerService.hide()
          console.log(data.statusText)
        }
        this.partnerServiceListing = data.body;
        this.gridData = data.body;

        for(let i = 0; i < this.gridData.length; i++) {
          console.log(this.gridData[i].customerComments);
          // count the character length of the string
          // let customerCommentsLength = this.gridData[i].customerComments.length;

          this.gridData[i].creation_Date = this.datePipe.transform(this.gridData[i].creation_Date,'MMM dd, yyyy');
          // this.gridData[i].customerComments = this.gridData[i].customerComments.substr(0,3) + '\u2026';
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
      this.routeService.getPartnerServiceListingExtended().subscribe(
      res => {
        if(res) {
          this.spinnerService.hide()
        }

        this.partnerServiceListing = [].concat(res);
        this.gridData = [].concat(res);

        for(let i = 0; i < this.gridData.length; i++) {
          this.gridData[i].creation_Date = this.datePipe.transform(this.gridData[i].creation_Date,'MMM dd, yyyy');
        }
      }
    )
    }

    this.partnerServiceListingForm = this.fb.group({
      EmailAddress: this.emailAddress = JSON.parse(localStorage.getItem('user')).email,
      NoteType: "Service",
      Memo: "",
      ServiceTicketID: "",
      CustomerID: 1,
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

  onOpenPartnerServiceListingModal(e, service_Ticket_Id: number, ticket_Number: number, creation_Date: Date, problem_Code: string, contactName: string, contactPhone: string, acContact: string, sitePhone: string, acContactEmail: string, customer_Number: string, customer_Name: string, customerRMR: number,  customer_Since: Date, collectionQueue: string, cancelStatus: string, business_Name: string, comResStatus: string, address_1: string, address_2: string, address_3: string, city: string, state: string, zipCode: string, status3G: string, csAccount: string, systemType: string, panelType: string, centralStation: string, panel_Location: string,  customerComments:string) {
    $("#detailsModal").modal("show");
    console.log('show')

    e.selectedRows.forEach((x) => {
      this.service_Ticket_Id = x.dataItem.service_Ticket_Id;
      this.ticket_Number = x.dataItem.ticket_Number;
      this.creation_Date = x.dataItem.creation_Date;
      this.problem_Code = x.dataItem.problem_Code;
      this.contactName = x.dataItem.contactName;
      this.contactPhone = x.dataItem.contactPhone;
      this.acContact = x.dataItem.acContact;
      this.sitePhone = x.dataItem.sitePhone;
      this.acContactEmail = x.dataItem.acContactEmail;
      this.customer_Number = x.dataItem.customer_Number;
      this.customer_Name = x.dataItem.customer_Name;
      this.customerRMR = x.dataItem.customerRMR;
      this.customer_Since = x.dataItem.customer_Since;
      this.collectionQueue = x.dataItem.collectionQueue;
      this.cancelStatus = x.dataItem.cancelStatus;
      this.business_Name = x.dataItem.business_Name;
      this.comResStatus = x.dataItem.comResStatus;
      this.address_1 = x.dataItem.address_1;
      this.address_2 = x.dataItem.address_2;
      this.address_3 = x.dataItem.address_3;
      this.city = x.dataItem.city;
      this.state = x.dataItem.state;
      this.zipCode = x.dataItem.zipCode;
      this.status3G = x.dataItem.status3G;
      this.csAccount = x.dataItem.csAccount;
      this.systemType = x.dataItem.systemType;
      this.panelType = x.dataItem.panelType;
      this.centralStation = x.dataItem.centralStation;
      this.panel_Location = x.dataItem.panel_Location;
      this.customerComments = x.dataItem.customerComments;

      this.partnerServiceListingForm.controls["ServiceTicketID"].setValue(this.service_Ticket_Id);
    })
   
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.gridData = filterBy(this.partnerServiceListing, filter);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridData = orderBy(this.partnerServiceListing, sort);
  }

  onOpenMessageModal() {
    $("#messageModal").modal("show");
  }

  onSubmitMessage(form: FormGroup) {
    // console.log(this.partnerServiceListingForm.value)
    this.routeService.postPartnerAddNote(this.partnerServiceListingForm.value).subscribe(
      res => {
        //console.log(res)
        $("#detailsModal").modal("hide");
        $("#memoModal").modal("hide");

        this.partnerServiceListingForm.get('Memo').setValue('');
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

}
