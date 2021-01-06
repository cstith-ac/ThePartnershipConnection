import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { DashboardInfo } from 'src/app/models/dashboardinfo';

@Component({
  selector: 'app-customercaredashboardinfo',
  templateUrl: './customercaredashboardinfo.component.html',
  styleUrls: ['./customercaredashboardinfo.component.css']
})
export class CustomercaredashboardinfoComponent implements OnInit {
  user:any=Object;
  dashboardinfo: DashboardInfo[];

  constructor(
    private routeService: RouteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        //console.log(res);
        this.dashboardinfo = res;
        let customerRating = "";
        let customerRatingValue = "";

        this.dashboardinfo.forEach((u) => {
          customerRating += `<span>${u.customerRating}</span>`;
                  customerRatingValue += `<span>${u.customerRatingValue}</span>`;

                  if (u.customerRatingValue === 0) {
                    //console.log('The value is' + u.customerRatingValue)
                    document.getElementById("customerRating").style.color = "#000";
                    //document.getElementById("customerRating").style.fontWeight = 600;
                    document.getElementById("customerRatingBg").style.backgroundColor = "#AFF1EE";
                  } else if (u.customerRatingValue === 1) {
                    //console.log('The value is' + u.customerRatingValue)
                    document.getElementById("customerRating").style.color = "#D8D1D2";
                    //document.getElementById("customerRating").style.fontWeight = 600;
                    document.getElementById("customerRatingBg").style.backgroundColor = "#D8354B";
                  } else if (u.customerRatingValue === 2) {
                    //console.log('The value is' + u.customerRatingValue)
                    document.getElementById("customerRating").style.color = "#E6E991";
                    //document.getElementById("customerRating").style.fontWeight = 600;
                    document.getElementById("customerRatingBg").style.backgroundColor = "#3580D8";
                  } else if (u.customerRatingValue === 3) {
                    //console.log('The value is' + u.customerRatingValue)
                    document.getElementById("customerRating").style.color = "#FE0E3F";
                    //document.getElementById("customerRating").style.fontWeight = 600;
                    document.getElementById("customerRatingBg").style.backgroundColor = "#40D835";
                  }
                  document.getElementById("customerRating").innerHTML = customerRating;
        })
      },
      err => {
        console.log(err);
      }
    )
  }

}
