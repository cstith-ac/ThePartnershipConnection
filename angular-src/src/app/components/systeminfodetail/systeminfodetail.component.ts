import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { CmsService } from '../../services/cms.service';
import { NmcService } from 'src/app/services/nmc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SystemInfo } from 'src/app/models/systeminfo';
import { ServiceTicketNotes } from 'src/app/models/serviceticketnotes';
import { CentralStationDataCMS } from 'src/app/models/centralstationdatacms';
import { SiteSystemNumbers } from 'src/app/models/sitesystemnumbers';
import { EventHistoryDate } from 'src/app/models/eventhistorydate';
import { switchMap, tap } from 'rxjs/operators';
//import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-systeminfodetail',
  templateUrl: './systeminfodetail.component.html',
  styleUrls: ['./systeminfodetail.component.css']
})
export class SysteminfodetailComponent implements OnInit {
  loading:boolean = true;
  accountInactiveText:boolean = false;
  showScheduled_Date: boolean = false;
  //isActive: boolean = false;

  accountNotFoundText: boolean = false;
  err_msg;
  err_msgContactList;
  err_msgZoneList;
  err_msgSignals;
  id;
  siteSystemNumbersData; // data returned from SiteSystemNumbers
  siteSystemDetailsData;
  contactListData;
  zonesData;
  eventHistoryDateData;
  accountInfoData;
  signalHistoryData;
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
  sig_date;

  systemInfoArray: SystemInfo[];
  systemInfo: any = {};
  alarmAccount;
  lastServiceTicketId;
  serviceTicketInfo2;
  serviceTicketNotes: ServiceTicketNotes[];
  centralStationDataCMS: CentralStationDataCMS[];
  siteSystemNumbers: SiteSystemNumbers[];
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
    private nmcService: NmcService,
    private router: Router
  ) { 
    this.route.params.subscribe(res => {
      this.id = res['id'];
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

        //***********This needs it's own method
        // if the alarm account contains any whitespace, remove it
        this.alarmAccount = this.alarmAccount.replace(/ /g,'');
        // if the alarm account contains a hyphen, remove the hyphen
        // if the alarm account contains the string '(inactive)', display the inactive text
        let hyphenatedAlarmAccount = this.alarmAccount.split('-').join('');
        if(hyphenatedAlarmAccount) {
          this.alarmAccount = this.alarmAccount.split('-').join('');
        }

        //let inactiveAlarmAccount = this.alarmAccount.slice(0,-10);
        let inactiveAlarmAccount = this.alarmAccount.includes("(inactive)");
        if(inactiveAlarmAccount) {
          // display the text Account not found at CMS
          this.accountInactiveText = true;

          //this removes the text (inactive) that's appended to the alarmaccount
          //this.alarmAccount=this.alarmAccount.slice(0, -10)
        }

        // check the centralStation variable
        // if the variable equals CMS, perform requests using CMS API
        // if the variable equals NMC, perform requests using NMC API
        if(this.centralStation === 'CMS') {
          this.getAccountDetails();
        } else if(this.centralStation === 'NMC') {
          this.getAccountDetails();
        } else if (this.centralStation === 'COPS') {
          console.log(`there's no alarm account available for ${this.centralStation}`);
          this.loading = false;
          this.hasNoCentralStationData = true;
        } else {
          console.log(`there's no alarm account available for ${this.centralStation}`);
          this.loading = false;
          this.hasNoCentralStationData = true;
        }
        
      }
    )
  }

  getAccountDetails() {
    if(this.centralStation === 'CMS') {
      this.cmsService.getSiteSystemNumbers(this.alarmAccount).subscribe(
        res => {
          for(let key in res) {
            this.siteSystemNumbersData = res[key]
            this.site_no = this.siteSystemNumbersData.site_no;
            this.system_no = this.siteSystemNumbersData.system_no;

            if(this.site_no === "") {
              console.log('there is no site no');
              //this.accountNotFoundText = 'Account not found at CMS';
              this.accountNotFoundText = true;
            }
          }
          this.cmsService.getSiteSystemDetails(this.site_no).subscribe(res => {
            for(let key in res) {
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
        }
      )
    } else if(this.centralStation === 'NMC') {
      this.nmcService.getAccountInfo(this.alarmAccount).subscribe(
        res => {
          let emptyObj = Object.keys(res).length;
          console.log(emptyObj)
          if(emptyObj === 0) {
            this.loading = false;
            //this.accountNotFoundText = 'Account not found at NMC';
            this.accountNotFoundText = true;
          }
          
          for(let key in res) {
            //console.log(res[key]);
            this.loading = false;
            this.accountInfoData = res[key];
  
            if(!this.accountInfoData) {
              console.log('There is no data from AccountInfo available')
            }

            this.err_msg = this.accountInfoData.err_msg;
  
            this.codeword1 = this.accountInfoData.codeword1;
            this.site_name = this.accountInfoData.site_name;
            this.site_addr1 = this.accountInfoData.site_addr1;
            this.city_name = this.accountInfoData.city_name;
            this.sitestat_id = this.accountInfoData.sitestat_id;
            this.state_id = this.accountInfoData.state_id;
            this.zip_code = this.accountInfoData.zip_code;
            this.phone1 = this.accountInfoData.phone1;
            this.ext1 = this.accountInfoData.ext1;
            this.ext2 = this.accountInfoData.ext2;
          }
        }
      )
    }
  }

  onClickGetContactList() {
    // this.isActive = true;
    this.loading = true;
    //return
    if(this.centralStation === 'CMS') {
      if(this.site_no === "") {
        console.log('there is no site no');
        //this.accountNotFoundText = 'Account not found at CMS';
        this.accountNotFoundText = true;
      } else if(this.site_no) {
        this.cmsService.getContactList(this.site_no).subscribe(
          res => {
            // console.log(res);
            this.loading = false;
            this.contactListData = res;
            
            // order by sequence #
            //if the cs_seqno is an empty string, it should be after the cs_seqno without an empty string
  
            this.contactListData = this.contactListData.sort((a, b) => a ? b ? a ? b: b.cs_seqno.localeCompare(b) : -1 : 1); //this sorts by number correctly but places numbers at top but not in numerical order
            
            this.contactListData.sort((a,b) => a.name.localeCompare(a.name));
  
            // list by sequence no 1st, then those without sequence no
            this.contactListData.sort(this.alphabetically(true))
          }
        )
      }
    } else if (this.centralStation === 'NMC') {
      this.nmcService.getAccountContacts(this.alarmAccount).subscribe(
        res => {
          this.loading = false;
          this.contactListData = res;
          // for(let i = 0; i < this.contactListData.length; i++) {
          //   this.err_msg = JSON.stringify(this.contactListData[i].err_msg);
          // }
          let returnedContactListDataObj = Object.values(res);
          returnedContactListDataObj.forEach(element => {
            if(element.err_msg) {
              //this.err_msg = element.err_msg;
              this.err_msgContactList = element.err_msg;
            }
          })
        }
      )
    }
    else {
      this.loading = false;
    }
  }

  onClickGetZonesList() {
    if(this.centralStation === 'CMS') {
      if(this.site_no === "") {
        //this.accountNotFoundText = "Account not found at CMS"
        this.accountNotFoundText = true;
      } else if (this.site_no) {
        this.cmsService.getZones(this.system_no).subscribe(
          res => {
            this.zonesData = res;
            
            let returnedZonesObj = Object.values(this.zonesData);
            
          }
        )
      }
    } else if (this.centralStation === 'NMC') {
      this.nmcService.getAccountZones(this.alarmAccount).subscribe(
        res => {
          console.log(res)
          this.zonesData = res;
        }
      )
    }
  }

  onClickGetSignals() {
    if(this.centralStation === 'CMS') {
      if(this.site_no === "") {
        //this.accountNotFoundText = "Account not found at CMS"
        this.accountNotFoundText = true;
      } else if (this.site_no) {
        this.cmsService.getEventHistoryDate(this.site_no).subscribe(
          res => {
            this.eventHistoryDateData = res;
            this.eventHistoryDateData = this.eventHistoryDateData.sort((a, b) => b.event_Date.localeCompare(a.event_Date))
          }
        )
      }
    } else if (this.centralStation === 'NMC') {
      this.nmcService.getSignalHistory(this.alarmAccount).subscribe(
        res => {

          this.signalHistoryData = res;

          for(let key in res) {
            //console.log(res[key]);
          }

          // if only the err_msg is returned
          let returnedSignalHistoryObj = Object.values(res);
          returnedSignalHistoryObj.forEach(element => {
            if(element.err_msg) {
              // this.err_msg = element.err_msg;
              this.err_msgSignals = element.err_msg;
            }
          })
        }
      )
    }
  }

  onClickGetMiscellaneous() {
    console.log(`This isn't working yet`)
  }

  showLastServiceTicketModal() {
    $("#lastServiceTicketModal").modal("show");
    //get the service ticket using LastServiceTicketID
    this.routeService.getServiceTicketInfo2ById(this.lastServiceTicketId).subscribe(
      res => {
        this.serviceTicketInfo2 = [].concat(res);
      }
    )
  }

  openServiceTicketNotesModal() {
    $("#lastServiceTicketNotesModal").modal("show");
    this.routeService.getServiceTicketNoteById(this.lastServiceTicketId).subscribe(
      res => {
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

    if(this.scheduled_Date === 'N/A') {
      //console.log(this.scheduled_Date)
      this.showScheduled_Date = true;
    }
  }

  openSignalHistoryDetails(sig_date:Date, event:string, sig_zone:string, sig_acct: string, sig_code:string) {
    this.sig_date = sig_date;

    console.log(sig_date);
    console.log(event);
    console.log(sig_zone);
    console.log(sig_acct);
    console.log(sig_code);
  }

  open3GModal() {
    $("#threeGModal").modal("show");
  }

  alphabetically(ascending) {
    return function(a,b) {
      if(a.cs_seqno === b.cs_seqno) {
        return 0;
      }

      else if (a.cs_seqno === '') {
        return 1;
      } else if (b.cs_seqno === '') {
        return -1;
      }
      else if (ascending) {
        return a.cs_seqno < b.cs_seqno ? -1 : 1;
      } else {
        return a.cs_seqno < b.cs_seqno ? 1 : -1;
      }
    }
  }

}
