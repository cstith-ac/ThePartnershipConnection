import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ListPartnerContacts } from 'src/app/models/listpartnercontacts';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-partnerviewlist',
  templateUrl: './partnerviewlist.component.html',
  styleUrls: ['./partnerviewlist.component.css']
})
export class PartnerviewlistComponent implements OnInit {
  listPartnerContacts: ListPartnerContacts[];
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  pageSize=10;

  constructor(
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    $("#wrapper").addClass("toggled");

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('removeSplash');
      
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.spinnerService.show();
    this.routeService.getListPartnerContacts().subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
          this.flashMessage.show('Your requested data is displayed below', {
            cssClass: 'text-center alert-success',
            timeout: 1000
          });
        }

        console.log(res)
        console.log(res.body)
        console.log(res.headers)
        console.log(res.status)
        this.listPartnerContacts = res.body;
        
      }, (err: HttpErrorResponse) => {
        this.flashMessage.show('There was a problem with your requested data. Please contact an administrator', {
          cssClass: 'text-center alert-danger',
          timeout: 5000
        });
      }
    )
  }

  onClickOpenPartnerLandingPage() {
    console.log('open Partner Landing Page')
  }

}
