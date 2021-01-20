import { Component, OnInit } from '@angular/core';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-partnerwindow',
  templateUrl: './partnerwindow.component.html',
  styleUrls: ['./partnerwindow.component.css']
})
export class PartnerwindowComponent implements OnInit {
  dashboardinfo: DashboardInfo[];

  constructor(
    public routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        this.dashboardinfo = res;
      }
    )
  }

}
