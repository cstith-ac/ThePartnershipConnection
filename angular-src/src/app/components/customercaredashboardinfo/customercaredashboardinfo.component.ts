import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
declare var $: any;

@Component({
  selector: 'app-customercaredashboardinfo',
  templateUrl: './customercaredashboardinfo.component.html',
  styleUrls: ['./customercaredashboardinfo.component.css']
})
export class CustomercaredashboardinfoComponent implements OnInit {
  user:any=Object;
  dashboardinfo: DashboardInfo[];

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
      },
      err => {
        console.log(err);
      }
    )
  }

  refreshDashboard() {
    window.location.reload();
  }

  // showBOCModal() {
  //   $("#bocModal").modal("show");
  // }

  showTicketInfoModal() {
    $("#ticketInfoModal").modal("show");
  }

}
