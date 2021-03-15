import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SystemInfo } from 'src/app/models/systeminfo';
import { RouteService } from '../../services/route.service';
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
      requirement1: "$99 customer payment and/or an RMR increase of a minimum of $5.00 a month RMR. ",
      requirement2: "$99 customer payment and/or an RMR increase of a minimum of $5.00 a month RMR. ", 
      requirement3: "$199-to-$399 customer payment and an RMR increase of $10.00 to $15.00 a month RMR.",
      requirement4: "This option will justify a substantial upfront payment and increase in RMR to cover installation costs & new services."
    },
  ]
  
  constructor(
    private route: ActivatedRoute,
    private routeService: RouteService) { 
    this.route.params.subscribe(res => {
      this.id = res['id'];
      this.routeService.getCustomerSystemInfo(this.id).subscribe(
        res => this.systemInfo = res);
    })
  }

  ngOnInit() {
    //console.log('hello')
    this.routeService.getCustomerSystemInfo(this.id).subscribe(
      res => {
        //console.log(res.lastServiceTicketID)
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
