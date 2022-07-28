import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';
import { RmlistService } from 'src/app/services/rmlist.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DashboardInfo } from 'src/app/models/dashboardinfo';
import { DashboardInfoS } from 'src/app/models/dashboardinfos';
import { ServiceTicketInfo } from 'src/app/models/serviceticketinfo';
import { ServiceTicketInfo2 } from 'src/app/models/serviceticketinfo2';
import { ServiceTicketNotes } from 'src/app/models/serviceticketnotes';
declare var $: any;

@Component({
  selector: 'app-customercaredashboardinfo',
  templateUrl: './customercaredashboardinfo.component.html',
  styleUrls: ['./customercaredashboardinfo.component.css']
})
export class CustomercaredashboardinfoComponent implements OnInit {
  user:any = Object;
  dashboardinfo: DashboardInfo[];
  dashboardinfoS: DashboardInfoS[];
  serviceTicketInfo: ServiceTicketInfo[];
  serviceTicketInfo2: ServiceTicketInfo2[];
  serviceTicketNotes: ServiceTicketNotes[];

  lastServiceTicketId;
  rmName;
  rmid;
  allRegionRelationshipContacts;

  currentId;
  currentPhone;
  currentPSS;
  currentRegion;
  currentRM;
  currentRMID;
  currentRSM;

  displayElement = false;

  view = {
    columnA: '3G to LTE upgrade options',
    columnB: 'Expected cost to customer requirements',
    dateRangeText:'date RangeText 🔥🔥',
    data : 'data ⚡'
  }

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

  eastRegionRelationshipContact = [
    {
      rm: 'Cara Davidson',
      rsm: 'Debbie DeAngelis',
      pss: 'Karen Benner',
      phone: '855-839-9277'
    }
  ]
  southEastRegionRelationshipContact = [
    {
      rm: 'Kevin Keenan',
      rsm: 'Debbie DeAngelis',
      pss: 'Karen Santayana',
      phone: '877-348-0936'
    }
  ]
  centralRegionRelationshipContact = [
    {
      rm: 'Colby Monachino',
      rsm: 'Bruna Johnson',
      pss: 'Charlene Schreiner',
      phone: '800-538-9808'
    }
  ]
  westRegionRelationshipContact = [
    {
      rm: 'Taylor Reilly',
      rsm: 'Staci Yoder',
      pss: 'Charlene Schreiner',
      phone: '855-839-9281'
    }
  ]

  constructor(
    private routeService: RouteService,
    private authService: AuthService,
    public rmlistService: RmlistService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    // setTimeout(() => {
    //   this.spinnerService.hide();
    // }, 2000)
    this.routeService.getCustomerCareDashboardInfoS().subscribe(
      res => {
        if(res) {
          this.spinnerService.hide();
        }
        this.dashboardinfoS = res;
        this.lastServiceTicketId = this.dashboardinfoS.map(x => x.lastServiceTicketID);
        this.rmName = this.dashboardinfoS.map(x => x.rmName);
        this.rmid = this.dashboardinfoS.map(x => x.rmid);

        this.rmName = this.rmName[0];
        this.rmid = this.rmid[0];

        //console.log(this.lastServiceTicketId); //object
      },
      err => {
        console.log(err);
      }
    )
  }

  refreshDashboard() {
    window.location.reload();
  }

  showTicketInfoModal() {
    $("#ticketInfoModal").modal("show");
    this.routeService.getServiceTicketInfo2ById(this.lastServiceTicketId).subscribe(
      res => {
        this.serviceTicketInfo2 = [].concat(res);
      }
    )
  }

  openServiceTicketNotesModal() {
    $("#serviceTicketNotesModal").modal("show");
    this.routeService.getServiceTicketNoteById(this.lastServiceTicketId).subscribe(
      res => {
        this.serviceTicketNotes = [].concat(res);
      }
    )
  }

  open3GModal() {
    $("#threeGModal").modal("show");
    console.log(this.basicUpgradeInfo);
  }

  showRegionRelationshipContact() {
    $("#regionRelationshipContactModal").modal("show");
    console.log('open showRegionRelationshipContact modal')
  }

  openRegionRelationshipContactModal(regionRelationshipContactContent) {
    this.modalService.open(regionRelationshipContactContent, 
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950',
      });

      //console.log(this.rmid)
      this.rmlistService.getAllRegionRelationshipContacts().subscribe(
        res => {
          //console.log(res)
          this.allRegionRelationshipContacts = res;
          let currentRegionRelationshipContact = this.allRegionRelationshipContacts.filter(x => x.rmid === this.rmid);
          this.currentRMID = currentRegionRelationshipContact.map(x => x.rmid);
          this.currentId = currentRegionRelationshipContact.map(x => x.id);
          this.currentRM = currentRegionRelationshipContact.map(x => x.rm);
          this.currentRSM = currentRegionRelationshipContact.map(x => x.rsm);
          this.currentPSS = currentRegionRelationshipContact.map(x => x.pss);
          this.currentPhone = currentRegionRelationshipContact.map(x => x.phone);
          this.currentRegion = currentRegionRelationshipContact.map(x => x.region);
          console.log(currentRegionRelationshipContact);
          console.log(this.currentRMID[0]);
          console.log(this.currentId[0]);
          console.log(this.currentRM[0]);
          console.log(this.currentRSM[0]);
          console.log(this.currentPSS[0]);
          console.log(this.currentPhone[0]);
          console.log(this.currentRegion[0]);

          // for(let i = 0; i < this.allRegionRelationshipContacts.length; i++) {
          //   console.log(this.allRegionRelationshipContacts[i])
          // }
        }
      )
      // this.rmlistService.getRegionRelationshipContactsById(this.id).subscribe(res => {
      //   console.log(res);
      // })
  }

}
