import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CustomerAccessList } from 'src/app/models/customeraccesslist';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { DashboardInfo1 } from 'src/app/models/dashboardinfo1';
import { DashboardInfo2 } from 'src/app/models/dashboardinfo2';
import { DashboardInfo3 } from 'src/app/models/dashboardinfo3';
import { DashboardInfo4 } from 'src/app/models/dashboardinfo4';
import { DashboardInfo5 } from 'src/app/models/dashboardinfo5';
import { DashboardInfo6 } from 'src/app/models/dashboardinfo6';
import { DashboardInfo7 } from 'src/app/models/dashboardinfo7';
import { DashboardInfo8 } from 'src/app/models/dashboardinfo8';
import { DashboardInfo9 } from 'src/app/models/dashboardinfo9';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-recentcustomers',
  templateUrl: './recentcustomers.component.html',
  styleUrls: ['./recentcustomers.component.css']
})
export class RecentcustomersComponent implements OnInit {
  customeraccesslist: CustomerAccessList[];
  dashboardInfo:any;
  //dashboardInfo: DashboardInfo[];
  dashboardInfo1: DashboardInfo1[];
  dashboardInfo2: DashboardInfo2[];
  dashboardInfo3: DashboardInfo3[];
  dashboardInfo4: DashboardInfo4[];
  dashboardInfo5: DashboardInfo5[];
  dashboardInfo6: DashboardInfo6[];
  dashboardInfo7: DashboardInfo7[];
  dashboardInfo8: DashboardInfo8[];
  dashboardInfo9: DashboardInfo9[];

  id:number;

  // customer0;
  // customer1;
  // customer2;
  // customer3;
  // customer4;
  // customer5;
  // customer6;
  // customer4

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

        const apiCalls = [];

        //map through array and get customerId from each object
        console.log(customerIdArray);

        // for(const id of customerIdArray) {
        //   apiCalls.push(this.routeService.getCustomerCareDashboardInfoById(id).subscribe(
        //     res => {
        //       console.log(res);
        //     }
        //   )); 
        // }
        
        //assign each customerId in customerIdArray to a variable
        let previousCustomer0 = customerIdArray[0];
        let previousCustomer1 = customerIdArray[1];
        let previousCustomer2 = customerIdArray[2];
        let previousCustomer3 = customerIdArray[3];
        let previousCustomer4 = customerIdArray[4];
        let previousCustomer5 = customerIdArray[5];
        let previousCustomer6 = customerIdArray[6];
        let previousCustomer7 = customerIdArray[7];
        let previousCustomer8 = customerIdArray[8];
        let previousCustomer9 = customerIdArray[9];

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer0).subscribe(
          res0 => {
            this.dashboardInfo = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer1).subscribe(
          res0 => {
            this.dashboardInfo1 = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer2).subscribe(
          res0 => {
            this.dashboardInfo2 = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer3).subscribe(
          res0 => {
            this.dashboardInfo3 = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer4).subscribe(
          res0 => {
            this.dashboardInfo4 = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer5).subscribe(
          res0 => {
            this.dashboardInfo5 = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer6).subscribe(
          res0 => {
            this.dashboardInfo6 = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer7).subscribe(
          res0 => {
            this.dashboardInfo7 = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer8).subscribe(
          res0 => {
            this.dashboardInfo8 = [].concat(res0);
          }
        )

        this.routeService.getCustomerCareDashboardInfoById(previousCustomer9).subscribe(
          res0 => {
            this.dashboardInfo9 = [].concat(res0);
          }
        )

        //console.log(customer0)
        //let customer1 = customerIdArray[1];
        //console.log(customer1)
        //let customer2 = customerIdArray[2];
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

        // this.id = customer0;

        // this.routeService.getCustomerCareDashboardInfoById(this.id).subscribe(
        //   res => {
        //     console.log(res);

        //     let customerRatingArray = this.dashboardInfo.map((x) => x.customerRating);
        //     customerRatingValueArray
        //   }
        // )
      }
    )

    //get dbo.CustomerCareDashboardInfo by CustomerID for each customer
    this.routeService.getCustomerCareDashboardInfoById(this.id).subscribe(
      res => {
        console.log(res);
        //customerRatingValueArray
      }
    )

  }

}
