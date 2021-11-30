import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PartnerInvoiceListing } from 'src/app/models/partnerinvoicelisting';
declare var $: any;
import { filter, mergeMap, switchMap, pairwise } from 'rxjs/operators';
import { PermissionsUserMap } from 'src/app/models/permissionsusermap';
import { HttpErrorResponse } from '@angular/common/http';

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
  pageSize=10;

  clicked = false;//disables button after click
  sedonaContactEmail;
  partnerName;
  userName: any;

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
            console.log(data.statusText)
          }
          this.partnerInvoiceListing = data.body
        },(err:HttpErrorResponse) => {
          this.flashMessage.show('There was a problem with your requested data. Please contact an administrator', {
            cssClass: 'text-center alert-danger',
            timeout: 5000
          });
          this.spinnerService.hide();
        })
      }
    }, 4);

    // if(this.sedonaContactEmail) {
    //   this.userName = this.sedonaContactEmail;

    //   let params = {
    //     "EmailAddress": this.emailAddress,
    //     "Filter": 1,
    //     "StartDate": null,
    //     "EndDate": null,
    //     "AliasEmail": this.sedonaContactEmail
    //   }

    //   this.authService.getProfile().pipe(
    //     mergeMap((res:any) => this.routeService.postPartnerInvoiceListingX(params))
    //   ).subscribe(data => {
    //     if(data.status === 200) {
    //       this.spinnerService.hide();
    //       console.log(data.statusText)
    //     }
    //     this.partnerInvoiceListing = data.body
    //   },(err:HttpErrorResponse) => {
    //     this.flashMessage.show('There was a problem with your requested data. Please contact an administrator', {
    //       cssClass: 'text-center alert-danger',
    //       timeout: 5000
    //     });
    //     this.spinnerService.hide();
    //   })
    // }
    if(!this.sedonaContactEmail) {
      this.routeService.getPartnerInvoiceListing().subscribe(
        res => {
          if(res) {
            this.spinnerService.hide()
          }
          
          this.partnerInvoiceListing = [].concat(res);
          
        })
    }

    // this.routeService.getPartnerInvoiceListing().subscribe(
    // res => {
    //   if(res) {
    //     this.spinnerService.hide()
    //   }
      
    //   this.partnerInvoiceListing = [].concat(res);
      
    // })
    
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

  toggleShow(newTab: string): void {
    this.activeTab = newTab;
  }

  onOpenPartnerInvoiceListingModal(ticketID: number, incentiveID: number, vendorInvoiceNumber: string, invoiceAmount: string, invoiceDate: string, approvedAmount: string, dateEntered: string, heldReason: string, checkNumber: string, checkDate: string, amountPaid: string, creditAmount: string, creditDate: string, determination: string, customer_Number: string, customer_Name: string, relevantMemo: string, relevantComment: string, address_1: string, address_2: string, address_3: string, city: string, state: string, zipCode: string, ticketNumber: string, csAccount: string) {
    $("#detailsModal").modal("show");
    
    this.ticketID = ticketID;
    this.incentiveID = incentiveID;
    this.vendorInvoiceNumber = vendorInvoiceNumber;
    this.invoiceAmount = invoiceAmount;
    this.invoiceDate = invoiceDate;
    this.approvedAmount = approvedAmount;
    this.dateEntered = dateEntered;
    this.heldReason = heldReason;
    this.checkNumber = checkNumber;
    this.checkDate = checkDate;
    this.amountPaid = amountPaid;
    this.creditAmount = creditAmount;
    this.creditDate = creditDate;
    this.determination = determination;
    this.customer_Number = customer_Number;
    this.customer_Name = customer_Name;
    //this.relevantMemo = relevantMemo.replace(/^\s+|\s+$/g, '');
    this.relevantMemo = relevantMemo;
    this.relevantComment = relevantComment;
    this.address_1 = address_1;
    this.address_2 = address_2;
    this.address_3 = address_3;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.ticketNumber = ticketNumber;
    this.csAccount = csAccount;
    
    this.partnerInvoiceListingForm.controls["IncentiveID"].setValue(this.incentiveID);
    this.partnerInvoiceListingForm.controls["ServiceTicketID"].setValue(this.ticketID);

    //this.relevantMemo = relevantMemo.trim()
    console.log(this.relevantMemo)
    console.log(this.relevantMemo.trim());
    console.log(relevantMemo.replace(/^\s+|\s+$/g, ''));

    // for(var i = 0; i < this.partnerInvoiceListing.length; i++) {
    //   console.log(this.partnerInvoiceListing[0].relevantMemo)
    //   this.relevantMemo = this.partnerInvoiceListing[i].relevantMemo.trim();
    // }
  }

  onOpenMessageModal() {
    $("#messageModal").modal("show");
  }

  onSubmitMessage(form: FormGroup) {
    // console.log(this.partnerInvoiceListingForm.value);

    this.routeService.postPartnerAddNote(this.partnerInvoiceListingForm.value).subscribe(
      res => {
        //console.log(res)
        $("#detailsModal").modal("hide");
        $("#memoModal").modal("hide");
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
