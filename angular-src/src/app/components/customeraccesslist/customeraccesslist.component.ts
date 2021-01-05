import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { CustomerAccessList } from 'src/app/models/customeraccesslist';

@Component({
  selector: 'app-customeraccesslist',
  templateUrl: './customeraccesslist.component.html',
  styleUrls: ['./customeraccesslist.component.css']
})
export class CustomeraccesslistComponent implements OnInit {
  user:any=Object;
  accesslist: CustomerAccessList[]

  constructor(
    private routeService: RouteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeService.getCustomerAccessList().subscribe(
      res => {
        console.log(res);
      }
    )
  }

}
