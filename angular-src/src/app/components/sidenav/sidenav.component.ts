import { Component, OnInit } from '@angular/core';
//import * as $ from 'jquery';
declare var $: any;
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RouteService } from '../../services/route.service';
import { PInformation } from 'src/app/models/pinformation';
import { PInformationNew } from 'src/app/models/pinformationnew';
import { ContactList } from 'src/app/models/contactlist';
import { ContactListAdditional } from 'src/app/models/contactlistadditional';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  user:any=Object;
  partnerInformation: PInformation[];
  partnerInformationNew: PInformationNew[];
  contactList: ContactList[];
  contactListAdditional: ContactListAdditional[];
  dashboardinfo: DashboardInfo[];

  activeTab: string = "tab-1"

  currentUser$ = this.currentUserService.data$;

  constructor(
    private currentUserService: UserService,
    public routeService: RouteService,
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {

    this.currentUserService.getCurrentUser();
    //console.log(this.currentUserService.getCurrentUser());
    
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

    // Customer Care x Service Notes Tabs
    $(function () {
      var $tabButtonItem = $('#tab-button-partner li'),
          $tabSelect = $('#tab-select-partner'),
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
    //console.log('load')

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        //console.log(JSON.parse(localStorage.getItem('user')))
      },
      err => {
        console.log(err);
      }
    )

    this.routeService.getPartnerInformation().subscribe(
      res => {
        //console.log(res);
        this.partnerInformation = res;
      }
    )

    this.routeService.getPartnerInformationNew().subscribe(
      res => {
        //console.log(res);
        this.partnerInformationNew = res;
      }
    )

    this.routeService.getPartnerContactList().subscribe(
      res => {
        //console.log(res);
        this.contactList = res;
      }
    )

    this.routeService.getPartnerContactListAdditional().subscribe(
      res => {
        //console.log(res);
        this.contactListAdditional = res;
      }
    )

    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        this.dashboardinfo = res;
      }
    )

  }

  toggleShow(newTab: string): void {
    //this.isShown = !this.isShown;
    this.activeTab = newTab;
  }

}
