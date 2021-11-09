import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ListPartnerContacts } from 'src/app/models/listpartnercontacts';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-partnerviewlist',
  templateUrl: './partnerviewlist.component.html',
  styleUrls: ['./partnerviewlist.component.css']
})
export class PartnerviewlistComponent implements OnInit {
  listPartnerContacts: ListPartnerContacts[];
  partnerContactsSearchForm: FormGroup;
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  pageSize=10;
  collectionSize: number;

  partnerCode;
  sedonaContactEmail;
  partnerName;
  searchTerm: string;

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

    this.partnerContactsSearchForm = this.fb.group({
      SearchTerm: [""]
    })

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

        console.log(res);
        console.log(res.body);
        console.log(res.headers);
        console.log(res.status);

        this.listPartnerContacts = res.body;
        this.listPartnerContacts.sort((a, b) => a.partnerName.localeCompare(b.partnerName))
        
      }, (err: HttpErrorResponse) => {
        this.flashMessage.show('There was a problem with your requested data. Please contact an administrator', {
          cssClass: 'text-center alert-danger',
          timeout: 5000
        });
      }
    )
  }

  onClickOpenPartnerLandingPage(partnerCode:string, sedonaContactEmail: string, partnerName: string) {
    this.partnerCode = partnerCode;
    this.sedonaContactEmail = sedonaContactEmail;
    this.partnerName = partnerName;

    localStorage.setItem('sedonaContactEmail', this.sedonaContactEmail)
    localStorage.setItem('partnerName', this.partnerName);

    // for(var i = 0; i < this.listPartnerContacts.length; i++) {
    //   this.sedonaContactEmail = this.listPartnerContacts[i].sedonaContactEmail;
    //   console.log(this.listPartnerContacts[0].sedonaContactEmail)
    // }
    //return
    this.router.navigate(['partner-dashboard']);
    // this.routeService.getPartnerLandingPageX('cstith@alarmconnections.com','hugo@cloudsecurityalarms.com').subscribe(
    //   res => {
    //     console.log(res.body)
    //   }
    // )
  }

  search(value: string): void {
    this.listPartnerContacts = this.listPartnerContacts.filter((val) => 
      val.partnerName.toLowerCase().includes(value));

    // this.listPartnerContacts = this.listPartnerContacts.filter((val) => 
    // val.partnerName.toLowerCase().indexOf(value.toLowerCase()) !== 1);

    this.collectionSize = this.listPartnerContacts.length;

    // this.adminUserSearchForm.valueChanges.subscribe(
    //   res => {
    //     console.log(res)
    //   }
    // )
  }

  onChangeClearSearch(e){
    console.log(e.target.value)
    // this.partnerContactsSearchForm.valueChanges.subscribe(
    //   res => {
    //     console.log(res)
    //   }
    // )
    
    // this.listPartnerContacts.filter((s) => s.partnerName.toLowerCase())
    // this.collectionSize = this.listPartnerContacts.length
  }

  clearSearch() {
    console.log('clearSearch');
    this.routeService.getListPartnerContacts().subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
          this.flashMessage.show('Data refreshed', {
            cssClass: 'text-center alert-success',
            timeout: 1000
          });
        }

        this.listPartnerContacts = res.body;
        this.searchTerm = ''

        //ES6 version
        this.listPartnerContacts.sort((a, b) => a.partnerName.localeCompare(b.partnerName))
      }
    )
    // this.results = [];

  }

}
