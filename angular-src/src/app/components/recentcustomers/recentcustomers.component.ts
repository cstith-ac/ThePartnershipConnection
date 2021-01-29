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
  id:number;

  customer0;
  previousCustomer0;
  previousCustomer1;
  previousCustomer2;
  previousCustomer3;
  previousCustomer4;
  previousCustomer5;
  previousCustomer6;
  previousCustomer7;
  previousCustomer8;
  previousCustomer9;

  constructor(
    public routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.getCustomerAccessList10().subscribe(
      res => {
        this.customeraccesslist = res;
        let customerIdArray = this.customeraccesslist.map((x) => x.customerId);

        //map through array and get customerId from each object
        //console.log(customerIdArray);
        
        //assign each customerId in customerIdArray to a variable
        let customer0 = customerIdArray[0];
        console.log(customer0)
        let customer1 = customerIdArray[1];
        //console.log(customer1)
        let customer2 = customerIdArray[2];
        //console.log(customer2)
        let customer3 = customerIdArray[3];
        //console.log(customer3)
        let customer4 = customerIdArray[4];
        //console.log(customer4)
        let customer5 = customerIdArray[5];
        //console.log(customer5)
        let customer6 = customerIdArray[6];
        //console.log(customer6)
        let customer7 = customerIdArray[7];
        //console.log(customer7)
        let customer8 = customerIdArray[8];
        //console.log(customer8)
        let customer9 = customerIdArray[9];
        //console.log(customer9)

        this.id = customer0;

        this.routeService.getCustomerCareDashboardInfoById(this.id).subscribe(
          res => {
            console.log(res);
          }
        )
      }
    )

    // get dbo.CustomerCareDashboardInfo by CustomerID for each customer
    // this.routeService.getCustomerCareDashboardInfoById(this.id).subscribe(
    //   res => {
    //     console.log(res);
    //     let previousCustomer0 = this.customer0;
    //     console.log(previousCustomer0);
    //   }
    // )

  }

}
