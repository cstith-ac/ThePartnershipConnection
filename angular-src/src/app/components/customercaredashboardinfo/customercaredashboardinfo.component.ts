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
      requirement1: "$5.00 RMR increase and $99 customer payment.",
      requirement2: "$5.00 RMR increase and $99 customer payment.", 
      requirement3: "Minimum $10.00 to $15.00 RMR increase and $199 to $399 customer payment.",
      requirement4: "Full system interactive upgrade. Site evaluation required to quote cost to customer."
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
