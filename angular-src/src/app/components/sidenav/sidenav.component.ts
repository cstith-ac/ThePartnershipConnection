import { Component, OnInit } from '@angular/core';
//import * as $ from 'jquery';
declare var $: any;
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouteService } from '../../services/route.service';
import { PInformation } from 'src/app/models/pinformation';
import { ContactList } from 'src/app/models/contactlist';
import { DashboardInfo } from 'src/app/models/dashboardinfo';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  user:any=Object;
  partnerInformation: PInformation[];
  contactList: ContactList[];
  dashboardinfo: DashboardInfo[];

  constructor(
    public routeService: RouteService,
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        console.log(JSON.parse(localStorage.getItem('user')))
      },
      err => {
        console.log(err);
      }
    )

    this.routeService.getPartnerInformation().subscribe(
      res => {
        console.log(res);
        this.partnerInformation = res;
      }
    )

    this.routeService.getPartnerContactList().subscribe(
      res => {
        //console.log(res);
        this.contactList = res;
      }
    )

    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        this.dashboardinfo = res;
      }
    )

  }

  ngAfterViewInit() {
    //console.log('update user')
  }

  onLogoutClick() {
    this.authService.logout();
    //implementing this workaround until the JS in the auth service is fixed
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.flashMessage.show('You are logged out', {
      cssClass:'alert-success',
      timeout: 3000
    });
    this.router.navigate(['/login']);
    return false;
  }

  showPartnerWindowModal() {
    $("#partnerWindowModal").modal("show");
  }

}
