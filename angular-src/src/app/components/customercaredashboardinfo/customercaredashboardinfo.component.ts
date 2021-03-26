import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { ServiceTicketInfo } from 'src/app/models/serviceticketinfo';
import { ServiceTicketInfo2 } from 'src/app/models/serviceticketinfo2';
import { ServiceTicketNotes } from 'src/app/models/serviceticketnotes';
declare var $: any;

@Component({
  selector: 'app-customercaredashboardinfo',
  templateUrl: './customercaredashboardinfo.component.html',
  styleUrls: ['./customercaredashboardinfo.component.css']
})
export class CustomercaredashboardinfoComponent implements OnInit {
  user:any=Object;
  dashboardinfo: DashboardInfo[];
  serviceTicketInfo: ServiceTicketInfo[];
  serviceTicketInfo2: ServiceTicketInfo2[];
  serviceTicketNotes: ServiceTicketNotes[];

  lastServiceTicketId;

  displayElement = false;

  view = {
    columnA: '3G to LTE upgrade options',
    columnB: 'Expected cost to customer requirements',
    dateRangeText:'date RangeText 🔥🔥',
    data : 'data ⚡'
  }

  basicUpgradeInfo = [
    {
      upgradeOptions: "3G to LTE upgrade options",
      upgradeOption1: "Lowest Cost Upgrade with Basic Interactive-Alula BAT Connect​ ​",
      upgradeOption2: "(like for like) Existing manufacturer cell upgrade to LTE ",
      upgradeOption3: "Alula BAT Connect  with Slim-Line Touchpad",
      upgradeOption4: "Qolsys Interactive​ complete system upgrade",
      requirements: "Expected cost to customer requirements",
      requirement1: "$0 Down and Minimum $5.00 RMR increase ($7.00 Optimal) required OR  a $99 customer payment.",
      requirement2: "$0 Down and Minimum $5.00 RMR increase ($7.00 Optimal) required OR  a $99 customer payment.", 
      requirement3: "FREE Installation with a Minimum $7.00 RMR increase ($10.00 Optimal) AND 50% off for the Slim Line Keypad, a $399.00 Value for just $199.95",
      requirement4: "Onsite quote necessary"
    },
  ]

  constructor(
    private routeService: RouteService,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 2000)
    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        this.dashboardinfo = res;
        this.lastServiceTicketId = this.dashboardinfo.map(x => x.lastServiceTicketID);
        //console.log(this.lastServiceTicketId);
        //this.spinnerService.hide();
      },
      err => {
        console.log(err);
      }
    )
  }

  // ngOnDestroy() {
  //   console.log('destroyed')
  //   if(localStorage.getItem('token') === null) {
  //     console.log('remove navlist')
  //   }
  // }

  refreshDashboard() {
    window.location.reload();
  }

  showTicketInfoModal() {
    $("#ticketInfoModal").modal("show");
    this.routeService.getServiceTicketInfo2ById(this.lastServiceTicketId).subscribe(
      res => {
        this.serviceTicketInfo2 = [].concat(res);
      }
    )
  }

  openServiceTicketNotesModal() {
    $("#serviceTicketNotesModal").modal("show");
    this.routeService.getServiceTicketNoteById(this.lastServiceTicketId).subscribe(
      res => {
        this.serviceTicketNotes = [].concat(res);
      }
    )
  }

  open3GModal() {
    $("#threeGModal").modal("show");
    console.log(this.basicUpgradeInfo);
  }

}
