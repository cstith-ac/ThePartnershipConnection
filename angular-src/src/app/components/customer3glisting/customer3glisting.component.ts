import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Customer3GListing } from 'src/app/models/customer3glisting';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer3glisting',
  templateUrl: './customer3glisting.component.html',
  styleUrls: ['./customer3glisting.component.css']
})
export class Customer3glistingComponent implements OnInit {
  customer3glisting: Customer3GListing[];

  isShown: boolean = true ; // show by default

  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];

  constructor(
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 30000)

    this.routeService.getCustomer3GListing().subscribe(
      res => {
        this.customer3glisting = res;
      }
    )
  }

  load3GList() {
    this.routeService.getCustomer3GListing().subscribe(
      res => {
        this.customer3glisting = res;
      }
    )
  }

  onTableDataChange(event) {
    this.page = event;
    //this.load3GList();
    this.spinnerService.hide();
  }

  onTableSizeChange(event) {
    this.tableSize = event.target.value;
    this.page = 1;
    //this.load3GList();
    this.spinnerService.hide();
  }

  toggleShow() {

    this.isShown = !this.isShown;
    
    }

}
