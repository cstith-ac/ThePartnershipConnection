import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navlist',
  templateUrl: './navlist.component.html',
  styleUrls: ['./navlist.component.css']
})
export class NavlistComponent implements OnInit {
  user: any = Object;
  userRoleNav: any = Object;

  constructor(public authService: AuthService) { 
    this.userRoleNav = 
      [
        {
          partnerView: "partner view"
        },
        {
          recentCustomers: "recent customers"
        },
        {
          customerCareView: "customer care view"
        },
        {
          serviceView: "service view"
        },
        {
          collectionsView: "collections view"
        },
        {
          admin: "admin"
        },
        {
          register: "register"
        }
      ]
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        // if(this.authService.isEmployee) {
        //   console.log('display the userRoleNav')
        // } else {
        //   console.log('display another nav')
        // }
        if(this.authService.loadToken) {
          console.log('display the userRoleNav')
        } else {
          console.log('display another nav')
        }
      },
      err => {
        console.log(err);
      }
    )
  }

}
