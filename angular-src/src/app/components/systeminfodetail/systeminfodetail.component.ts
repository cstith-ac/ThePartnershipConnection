import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { CmsService } from '../../services/cms.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SystemInfo } from 'src/app/models/systeminfo';
import { ServiceTicketNotes } from 'src/app/models/serviceticketnotes';
import { CentralStationDataCMS } from 'src/app/models/centralstationdatacms';
import { SiteSystemNumbers } from 'src/app/models/sitesystemnumbers';
import { EventHistoryDate } from 'src/app/models/eventhistorydate';
import { switchMap, tap } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-systeminfodetail',
  templateUrl: './systeminfodetail.component.html',
  styleUrls: ['./systeminfodetail.component.css']
})
export class SysteminfodetailComponent implements OnInit {
  loading:boolean = true;
  //isValueNotPresent:boolean = false;
  accountInactiveText;
  accountNotFoundText;
  id;
  siteSystemNumbersData; // data returned from SiteSystemNumbers
  siteSystemDetailsData;
  contactListData;
  zonesData;
  eventHistoryDateData;
  sitestat_id;
  codeword1;
  codeword2;
  site_name;
  site_no;
  system_no;
  site_addr1;
  site_addr2;
  city_name;
  state_id;
  zip_code;
  phone1;
  ext1;
  phone2;
  ext2;

  /**Zones**/
  zone_id;
  comment50s;
  zonestate_descr;
  servtype_id;
  restore_reqd_flag2;
  restore_reqd_flag21;
  trouble_state_flag;
  trip_count;
  event_descr;
  cs_seqno;
  name;
  pin;
  contact_type_desc;
  relation_id;
  auth_id;
  phone_type_list;
  phn1;
  phn2;
  phn3;
  phn4;
  seqno;

  /**EventHistoryDate**/
  event_Date;
  event_Class;
  event;
  zone_Id;
  user_Id;
  userName;
  operator;
  phone;
  cS_Number;
  site_nameEventHistoryDate;
  scheduled_Date;
  comment;
  additional_Info;
  pascom;

  systemInfoArray: SystemInfo[];
  systemInfo: any = {};
  alarmAccount;
  lastServiceTicketId;
  serviceTicketInfo2;
  serviceTicketNotes: ServiceTicketNotes[];
  centralStationDataCMS: CentralStationDataCMS[];
  siteSystemNumbers: SiteSystemNumbers[];
  //foo: EventHistoryDate[];
  centralStation;

  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  pageSize=10;
  collectionSize: number;

  p: number = 1;
  hasNoCentralStationData:boolean=false;

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
    private cmsService: CmsService,
    private router: Router
  ) { 
    this.route.params.subscribe(res => {
      this.id = res['id'];
      // this.routeService.getCustomerSystemInfo(this.id).subscribe(
      //   //res => this.systemInfo = [].concat(res)
      //   res => {
      //     console.log(res)
      //     this.systemInfo = res
      //   }
      // )
    })
  }

  ngOnInit() {
    $("#wrapper").addClass("toggled");

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.spinnerService.show();

    // concatMap vs mergeMap

    // START temp call
    this.routeService.getCustomerSystemInfo(this.id).subscribe(
      data => {
        if(data) {
          this.spinnerService.hide();
        }
        this.systemInfo = data;
        this.lastServiceTicketId = data.lastServiceTicketID;
        this.alarmAccount = data.alarmAccount;
        this.centralStation = data.monitoredBy;

        // if the alarm account contains a hyphen, remove the hyphen
        // if the alarm account contains the string '(inactive)', display the inactive text
        let hyphenatedAlarmAccount = this.alarmAccount.split('-').join('');
        if(hyphenatedAlarmAccount) {
          this.alarmAccount = this.alarmAccount.split('-').join('');
          //console.log(hyphenatedAlarmAccount)
        }

        //let inactiveAlarmAccount = this.alarmAccount.slice(0,-10);
        let inactiveAlarmAccount = this.alarmAccount.includes("(inactive)");
        if(inactiveAlarmAccount) {
          // console.log('this account is inactive');
          // console.log(inactiveAlarmAccount);
          // display the text Account not found at CMS
          this.accountInactiveText = 'This account is INACTIVE';
        }

        // check the centralStation variable
        // if the variable equals CMS, perform requests using CMS API
        // if the variable equals NMC, perform requests using NMC API
        if(this.centralStation === 'CMS') {

          this.cmsService.getSiteSystemNumbers(this.alarmAccount).subscribe(
            res => {
              // console.log(Object.values(res))
              for(let key in res) {
                // console.log(res[key])
                this.siteSystemNumbersData = res[key]
                this.site_no = this.siteSystemNumbersData.site_no;
                this.system_no = this.siteSystemNumbersData.system_no;

                if(this.site_no === "") {
                  console.log('there is no site no');
                  this.accountNotFoundText = 'Account not found at CMS';
                }
              }
              this.cmsService.getSiteSystemDetails(this.site_no).subscribe(res => {
                // console.log(res)
                for(let key in res) {
                  // console.log((res[key]));
                  this.loading = false;
                  this.siteSystemDetailsData = res[key];

                  if(!this.siteSystemDetailsData) {
                    console.log('there is no data from SiteSystemDetails available')
                  }

                  this.sitestat_id = this.siteSystemDetailsData.sitestat_id;
                  this.codeword1 = this.siteSystemDetailsData.codeword1;
                  this.codeword2 = this.siteSystemDetailsData.codeword2;
                  this.site_name = this.siteSystemDetailsData.site_name;
                  this.site_no = this.siteSystemDetailsData.site_no;
                  this.site_addr1 = this.siteSystemDetailsData.site_addr1;
                  this.site_addr2 = this.siteSystemDetailsData.site_addr2;
                  this.city_name = this.siteSystemDetailsData.city_name;
                  this.state_id = this.siteSystemDetailsData.state_id;
                  this.zip_code = this.siteSystemDetailsData.zip_code;
                  this.phone1 = this.siteSystemDetailsData.phone1;
                  this.ext1 = this.siteSystemDetailsData.ext1;
                  this.phone2 = this.siteSystemDetailsData.phone2;
                  this.ext2 = this.siteSystemDetailsData.ext2;
                }
              })
              this.cmsService.getContactList(this.site_no).subscribe(
                res => {
                  // console.log(res);
                  this.contactListData = res;
                }
              )
              this.cmsService.getEventHistoryDate().subscribe(
                res => {
                  console.log(res);
                  this.eventHistoryDateData = res;
                  this.eventHistoryDateData = this.eventHistoryDateData.sort((a, b) => b.event_Date.localeCompare(a.event_Date))
                  
                }
              )
              return this.cmsService.getZones(this.system_no).subscribe(
                res => {
                  //console.log(res);
                  this.zonesData = res;
                }
              )
            }
          )
        } else {
          console.log(`there's no alarm account available for ${this.centralStation}`);
          this.loading = false;
          this.hasNoCentralStationData = true;
        }
        
      }
    )
     // END temp call

    // this.routeService.getCustomerSystemInfo(this.id).subscribe(
    //   data => {
    //     if(data) {
    //       this.spinnerService.hide();
    //     }
    //     this.systemInfo = data;
    //     this.lastServiceTicketId = data.lastServiceTicketID;
    //     this.alarmAccount = data.alarmAccount;
    //   }
    // )


    // this.spinnerService.show();
    // this.cmsService.getCentralStationDataCMS().subscribe(
    //   res => {
    //     if(res.status === 200) {
    //       //console.log(res.body)
    //       this.spinnerService.hide();

    //       this.loading = false;

    //       this.centralStationDataCMS = res.body;

    //       this.cs_no = this.centralStationDataCMS.filter((val) => val.cs_no.includes(this.alarmAccount))
    //       for(var i = 0; i < this.cs_no.length; i++) {
    //         //console.log(this.cs_no[i].codeword1)
    //         this.sitestat_id = this.cs_no[i].sitestat_id;
    //         this.codeword1 = this.cs_no[i].codeword1;
    //         this.codeword2 = this.cs_no[i].codeword2;
    //         this.site_no = this.cs_no[i].site_no;
    //         this.site_addr1 = this.cs_no[i].site_addr1;
    //         this.site_addr2 = this.cs_no[i].site_addr2;
    //         this.city_name = this.cs_no[i].city_name;
    //         this.state_id = this.cs_no[i].state_id;
    //         this.zip_code = this.cs_no[i].zip_code;
    //         this.phone1 = this.cs_no[i].phone1;
    //         this.ext1 = this.cs_no[i].ext1;
    //         this.phone2 = this.cs_no[i].phone2;
    //         this.ext2 = this.cs_no[i].ext2;
    //       }
    //     }
    //   }
    // )
  }

  // firstPOSTCallGetCustomerSystemInfo() {
  //   this.routeService.getCustomerSystemInfo(this.id).subscribe(
  //     //res => this.systemInfo = [].concat(res)
  //     res => {
  //       console.log(res)
  //       if(res) {
  //         this.spinnerService.hide();
  //         this.systemInfo = res;
  //       }
  //       this.lastServiceTicketId = res.lastServiceTicketID;
  //       this.alarmAccount = res.alarmAccount;
  //     }
  //   )
  // }

  showLastServiceTicketModal() {
    console.log('showLastServiceTicketModal')
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
    //console.log("open service ticket notes")
    $("#lastServiceTicketNotesModal").modal("show");
    this.routeService.getServiceTicketNoteById(this.lastServiceTicketId).subscribe(
      res => {
        console.log(res);
        this.serviceTicketNotes = [].concat(res);
      }
    )
  }

  openEventHistoryDateDetails(event_Date:string, cS_Number:string, site_name: string, scheduled_Date: string, event: string, event_Class: string, zone_Id: string, user_Id: string, phone: string, userName: string, operator: string, comment: string, additional_Info: string, pascom: string) {
    $("#eventHistoryDateDetailsModal").modal("show");

    this.cS_Number = cS_Number.trim();
    this.site_name = site_name.trim();
    this.event_Date = event_Date.trim();
    this.scheduled_Date = scheduled_Date.trim();
    this.event = event.trim();
    this.event_Class = event_Class.trim();
    this.zone_Id = zone_Id.trim();
    this.user_Id = user_Id.trim();
    this.phone = phone.trim();
    this.userName = userName.trim();
    this.operator = operator.trim();
    this.comment = comment.trim();
    this.additional_Info = additional_Info.trim();
    this.pascom = pascom.trim();

    if(this.cS_Number.length == 0) {
      this.cS_Number = 'N/A';
    }
    if(this.site_name.length == 0) {
      this.site_name = 'N/A';
    }
    if(this.event_Date.length == 0) {
      this.event_Date = 'N/A';
    }
    if(this.scheduled_Date.length == 0) {
      this.scheduled_Date = 'N/A';
    }
    if(this.event.length == 0) {
      this.event = 'N/A';
    }
    if(this.event_Class.length === 0) {
      this.event_Class = 'N/A';
    }
    if(this.zone_Id.length == 0) {
      this.zone_Id = 'N/A';
    }
    if(this.user_Id.length == 0) {
      this.user_Id = 'N/A';
    }
    if(this.phone.length == 0) {
      this.phone = 'N/A';
    }
    if(this.userName.length == 0) {
      this.userName = 'N/A';
    }
    if(this.operator.length == 0) {
      this.operator = 'N/A';
    }
    if(this.comment.length === 0) {
      this.comment = 'N/A';
    }
    if(this.additional_Info.length === 0) {
      this.additional_Info = 'N/A';
    }
    if(this.pascom.length === 0) {
      this.pascom = 'N/A';
    }
  }

  open3GModal() {
    $("#threeGModal").modal("show");
    //console.log(this.basicUpgradeInfo);
  }

}
