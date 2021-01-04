import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customercaredashboardinfo',
  templateUrl: './customercaredashboardinfo.component.html',
  styleUrls: ['./customercaredashboardinfo.component.css']
})
export class CustomercaredashboardinfoComponent implements OnInit {
  user:any=Object;

  constructor(
    private routeService: RouteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        console.log(res);
      }
    )
  }

}
