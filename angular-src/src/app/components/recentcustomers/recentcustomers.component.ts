import { Component, OnInit } from '@angular/core';
import { CustomerAccessList } from 'src/app/models/customeraccesslist';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-recentcustomers',
  templateUrl: './recentcustomers.component.html',
  styleUrls: ['./recentcustomers.component.css']
})
export class RecentcustomersComponent implements OnInit {
  customeraccesslist: CustomerAccessList[];

  constructor(
    public routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.getCustomerAccessList10().subscribe(
      res => {
        this.customeraccesslist = res;
      }
    )
  }

}
