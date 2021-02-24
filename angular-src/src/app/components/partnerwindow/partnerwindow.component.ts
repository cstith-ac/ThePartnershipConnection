import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-partnerwindow',
  templateUrl: './partnerwindow.component.html',
  styleUrls: ['./partnerwindow.component.css']
})
export class PartnerwindowComponent implements OnInit {
  @ViewChild("fatAdd") fatAdd: ElementRef;
  dashboardinfo: DashboardInfo[];

  constructor(
    public routeService: RouteService,
    public authService: AuthService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        this.dashboardinfo = res;
      }
    )

    if(this.authService.isPartner()) {
      setTimeout(() => {
        console.log(this.elementRef.nativeElement)
        this.elementRef.nativeElement.style.display='none';
      }, 1)
    }
  }

}
