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

}
