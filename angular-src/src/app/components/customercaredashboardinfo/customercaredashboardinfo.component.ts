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

}
