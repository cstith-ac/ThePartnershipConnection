import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from '../../services/route.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PartnerInvoiceListing } from 'src/app/models/partnerinvoicelisting';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-partnerinvoicelisting',
  templateUrl: './partnerinvoicelisting.component.html',
  styleUrls: ['./partnerinvoicelisting.component.css']
})
export class PartnerinvoicelistingComponent implements OnInit {
  partnerInvoiceListing: PartnerInvoiceListing[];
  user;
  firstName;
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  incentiveID;
  vendorInvoiceNumber;
  invoiceDate;
  approvedAmount;
  dateEntered;
  heldReason;
  determination;
  customer_Number;
  customer_Name;
  relevantMemo;
  relevantComment;
  activeTab: string = "tab-1"

  id:string;
  pageSize=10;

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

    this.routeService.getPartnerInvoiceListing().subscribe(
    res => {
      if(res) {
        this.spinnerService.hide()
      }
      
      this.partnerInvoiceListing = [].concat(res);
      
    })
    
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
  }

  toggleShow(newTab: string): void {
    //this.isShown = !this.isShown;
    this.activeTab = newTab;
  }

  onOpenPartnerInvoiceListingModal(incentiveID: number, vendorInvoiceNumber: string, invoiceDate: string, approvedAmount: string, dateEntered: string, heldReason: string, determination: string, customer_Number: string, customer_Name: string, relevantMemo: string, relevantComment: string) {
    $("#detailsModal").modal("show");
    
    this.incentiveID = incentiveID;
    this.vendorInvoiceNumber = vendorInvoiceNumber;
    this.invoiceDate = invoiceDate;
    this.approvedAmount = approvedAmount;
    this.dateEntered = dateEntered;
    this.heldReason = heldReason;
    this.determination = determination;
    this.customer_Number = customer_Number;
    this.customer_Name = customer_Name;
    this.relevantMemo = relevantMemo;
    this.relevantComment = relevantComment;
    // console.log(this.incentiveID)
  }

  onOpenMemo() {
    console.log('open memo modal')
  }

  onAddDocument() {
    console.log('add doc')
  }

}
