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
  }

  onOpenPartnerInvoiceListingModal(incentiveID: number) {
    $("#detailsModal").modal("show");
  }

  onOpenMemo() {
    console.log('open memo modal')
  }

}
