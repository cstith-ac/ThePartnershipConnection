import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
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

  constructor(
    private routeService: RouteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        //console.log(res);
        this.dashboardinfo = res;
        this.lastServiceTicketId = this.dashboardinfo.map(x => x.lastServiceTicketID);
        console.log(this.lastServiceTicketId);
      },
      err => {
        console.log(err);
      }
    )
  }

  refreshDashboard() {
    window.location.reload();
  }

  // getDimensionsByFilter(id) {
  //   return this.dashboardinfo.filter(x => x.lastServiceTicketId === this.lastServiceTicketId);
  // }

  showTicketInfoModal() {
    $("#ticketInfoModal").modal("show");
    this.routeService.getServiceTicketInfo2ById(this.lastServiceTicketId).subscribe(
      res => {
        //console.log(res);
        this.serviceTicketInfo2 = [].concat(res);
      }
    )
    // this.routeService.getServiceTicketInfoById(this.lastServiceTicketId).subscribe(
    //   res => {
    //     //console.log(res);
    //     this.serviceTicketInfo = [].concat(res);
    //     //console.log(this.serviceTicketInfo);
    //   }
    // )
  }

  openServiceTicketNotesModal() {
    console.log("open service ticket notes")
    $("#serviceTicketNotesModal").modal("show");
    this.routeService.getServiceTicketNoteById(this.lastServiceTicketId).subscribe(
      res => {
        console.log(res);
        this.serviceTicketNotes = [].concat(res);
      }
    )
  }

}
