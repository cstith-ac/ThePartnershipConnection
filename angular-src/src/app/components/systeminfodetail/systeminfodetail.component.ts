import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SystemInfo } from 'src/app/models/systeminfo';
import { ServiceTicketNotes } from 'src/app/models/serviceticketnotes';
declare var $: any;

@Component({
  selector: 'app-systeminfodetail',
  templateUrl: './systeminfodetail.component.html',
  styleUrls: ['./systeminfodetail.component.css']
})
export class SysteminfodetailComponent implements OnInit {
  id;
  systemInfo: any={};
  lastServiceTicketId;
  serviceTicketInfo2;
  serviceTicketNotes: ServiceTicketNotes[];

  basicUpgradeInfo = [
    {
      upgradeOptions: "3G to LTE upgrade options",
      upgradeOption1: "Lowest Cost Upgrade with Basic Interactive-Alula BAT Connect​ ​",
      upgradeOption2: "(like for like) Existing manufacturer cell upgrade to LTE ",
      upgradeOption3: "Alula BAT Connect  with Slim-Line Touchpad",
      upgradeOption4: "Qolsys Interactive​ complete system upgrade",
      requirements: "Expected cost to customer requirements",
      requirement1: "$0 Down and Minimum $5.00 RMR increase ($7.00 Optimal) required OR  a $99 customer payment.",
      requirement2: "$0 Down and Minimum $5.00 RMR increase ($7.00 Optimal) required OR  a $99 customer payment.", 
      requirement3: "FREE Installation with a Minimum $7.00 RMR increase ($10.00 Optimal) AND 50% off for the Slim Line Keypad, a $399.00 Value for just $199.95",
      requirement4: "Onsite quote necessary"
    },
  ]
  
  constructor(
    private route: ActivatedRoute,
    public jwtHelper: JwtHelperService,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private router: Router
  ) { 
    this.route.params.subscribe(res => {
      this.id = res['id'];
      this.routeService.getCustomerSystemInfo(this.id).subscribe(
        res => this.systemInfo = res);
    })
  }

  ngOnInit() {

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.spinnerService.show();
    this.routeService.getCustomerSystemInfo(this.id).subscribe(
      res => {
        if(res) {
          this.spinnerService.hide();
        }
        this.lastServiceTicketId = res.lastServiceTicketID;
      }
    )
  }

  showLastServiceTicketModal() {
    $("#lastServiceTicketModal").modal("show");
    //get the service ticket using LastServiceTicketID
    this.routeService.getServiceTicketInfo2ById(this.lastServiceTicketId).subscribe(
      res => {
        //console.log(res);
        this.serviceTicketInfo2 = [].concat(res);
      }
    )
  }

  openServiceTicketNotesModal() {
    console.log("open service ticket notes")
    $("#lastServiceTicketNotesModal").modal("show");
    this.routeService.getServiceTicketNoteById(this.lastServiceTicketId).subscribe(
      res => {
        console.log(res);
        this.serviceTicketNotes = [].concat(res);
      }
    )
  }

  open3GModal() {
    $("#threeGModal").modal("show");
    console.log(this.basicUpgradeInfo);
  }

}
