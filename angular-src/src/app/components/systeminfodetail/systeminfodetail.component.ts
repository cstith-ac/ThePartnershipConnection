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

}
