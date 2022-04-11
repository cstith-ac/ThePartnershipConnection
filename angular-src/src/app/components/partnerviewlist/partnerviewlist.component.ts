import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ListPartnerContacts } from 'src/app/models/listpartnercontacts';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { RMListforTPC } from 'src/app/models/rmlistfortpc';
import { TPCStateList } from 'src/app/models/tpcstatelist';
import { PartnerServiceNote } from 'src/app/models/partnerservicenote';
import { PartnerCriticalMessage } from 'src/app/models/partnercriticalmessage';
import { PartnerCustCareNote } from 'src/app/models/partnercustcarenote';
declare var $: any;

@Component({
  selector: 'app-partnerviewlist',
  templateUrl: './partnerviewlist.component.html',
  styleUrls: ['./partnerviewlist.component.css']
})
export class PartnerviewlistComponent implements OnInit {
  listPartnerContacts: ListPartnerContacts[];
  rmListForTPC: RMListforTPC[];
  tpcStateList: TPCStateList[];
  partnerServiceNote: PartnerServiceNote[];
  partnerCriticalMessage: PartnerCriticalMessage[];
  partnerCustCareNote: PartnerCustCareNote[];
  partnerViewListFilterForm: FormGroup;
  partnerContactsSearchForm: FormGroup;
  primaryContactFilterForm: FormGroup;
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5,10,15,25,50,100,150,200];
  pageSize=10;
  collectionSize: number;

  p: number = 1;

  partnerCode;
  sedonaContactEmail;
  partnerName;
  searchTerm: string;

  rmAssigned;
  rmid;
  usStateID;

  openFilter="Open Filter";

  // partnerServiceNoteToolTip = "Partner Service Note";
  serviceNote;
  customerCareNote;
  criticalMessage;

  public reportingTagDictionary:[any] = [
    {
      'owner': 'Owner',
      'ownerReportingLevel': 'Owner level reporting'
    }
  ]

  constructor(
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    $("#wrapper").addClass("toggled");

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('removeSplash');
      
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.partnerViewListFilterForm = this.fb.group({
      FilterRM: [""],
      FilterState: [""]
    })

    this.partnerContactsSearchForm = this.fb.group({
      SearchTerm: [""]
    })

    this.primaryContactFilterForm = this.fb.group({
      FilterPrimaryContact: ["y"]
    })

    this.spinnerService.show();

    // console.log(this.reportingTagDictionary)

    let params = {
      "PrimaryOnly": "Y",
      "RMFilter": 1,
      "USStateID": 1
    }

    this.routeService.getListPartnerContacts(params).subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
          this.flashMessage.show('Your requested data is displayed below', {
            cssClass: 'text-center alert-success',
            timeout: 1000
          });
        }
        if(res.status)

        // console.log(res);
        // console.log(res.body);
        // console.log(res.headers);
        // console.log(res.status);

        this.listPartnerContacts = res.body;
        this.listPartnerContacts.sort((a, b) => a.partnerName.localeCompare(b.partnerName));
        
      }, (err: HttpErrorResponse) => {
        this.flashMessage.show('There was a problem with your requested data. Please contact an administrator', {
          cssClass: 'text-center alert-danger',
          timeout: 5000
        });
        this.spinnerService.hide();
      }
    )
  }

  onOpenRMFilterModal(rmAssigned) {
    // show or hide the list
    this.modalService.open(rmAssigned,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });

    this.routeService.getRMListforTPC().subscribe(
      res => {
        //console.log(res.body);
        if(res.status === 200) {
          this.rmListForTPC = res.body;
        }
      }
    )
  }

  onOpenStateFilterModal(state) {
    // show or hide the list
    this.modalService.open(state,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });

    this.routeService.getTPCStateList().subscribe(
      res => {
        console.log(res.body)
        this.tpcStateList = res.body;
      }
    )
  }

  onChangeFilterRM(e) {
    console.log(e)
    console.log(e.target.value)
    console.log(parseInt(e.target.id))
    
    this.rmid = parseInt(e.target.id)
    // exec dbo.ListPartnerContacts 'Y',1,1
    let params = {
      "PrimaryOnly": "Y",
      "RMFilter": this.rmid,
      "USStateID": 1
    }

    if(!this.usStateID) {
      this.usStateID = 1;
    }

    this.routeService.getListPartnerContactsByID('y',this.rmid, this.usStateID).subscribe(
      res => {
        console.log(res.body)
        this.listPartnerContacts = res.body;
        this.listPartnerContacts.sort((a, b) => a.partnerName.localeCompare(b.partnerName));
      }
    )
  }

  onChangeFilterState(e) {
    this.usStateID = parseInt(e.target.id);

    if(!this.rmid) {
      this.rmid = 1;
    }

    this.routeService.getListPartnerContactsByID('y', this.rmid, this.usStateID).subscribe(
      res => {
        console.log(res.body)
        this.listPartnerContacts = res.body;
        this.listPartnerContacts.sort((a, b) => a.partnerName.localeCompare(b.partnerName));
      }
    )
  }

  onChangeFilterPrimaryContact(e) {
    console.log(e.target.value)
    if(!this.rmid) {
      this.rmid = 1;
    }
    if(!this.usStateID) {
      this.usStateID = 1;
    }
    this.routeService.getListPartnerContactsByID(e.target.value, this.rmid, this.usStateID).subscribe(
      res => {
        this.listPartnerContacts = res.body
      }
    )
  }

  onClickSortPartnerCode(e) {
    console.log(e)
    this.listPartnerContacts.sort((a, b) => a.partnerCode.localeCompare(b.partnerCode));
  }

  onClickSortPartnerName(e) {
    this.listPartnerContacts.sort((a,b) => a.partnerName.localeCompare(b.partnerName));
  }

  onClickOpenPartnerLandingPage(partnerCode:string, sedonaContactEmail: string, partnerName: string) {
    this.partnerCode = partnerCode;
    this.sedonaContactEmail = sedonaContactEmail;
    this.partnerName = partnerName;

    localStorage.setItem('sedonaContactEmail', this.sedonaContactEmail)
    localStorage.setItem('partnerName', this.partnerName);

    this.router.navigate(['partner-dashboard']);
    // this.routeService.getPartnerLandingPageX('cstith@alarmconnections.com','hugo@cloudsecurityalarms.com').subscribe(
    //   res => {
    //     console.log(res.body)
    //   }
    // )
  }

  search(value: string): void {
    this.listPartnerContacts = this.listPartnerContacts.filter((val) => 
      val.partnerName.toLowerCase().includes(value));

    this.collectionSize = this.listPartnerContacts.length;
  }

  onChangeClearSearch(e) {
    console.log(e.target.value)
  }

  clearSearch() {
    console.log('clearSearch');
    let params = {
      "PrimaryOnly": "Y",
      "RMFilter": 1,
      "USStateID": 1
    }
    this.routeService.getListPartnerContacts(params).subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
          this.flashMessage.show('Data refreshed', {
            cssClass: 'text-center alert-success',
            timeout: 1000
          });
        }

        this.listPartnerContacts = res.body;
        this.searchTerm = ''

        //ES6 version
        this.listPartnerContacts.sort((a, b) => a.partnerName.localeCompare(b.partnerName))
      }
    )
    // this.results = [];

  }

  onOpenFilterModal(filter) {
    this.modalService.open(filter,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });
  }

  onOpenFilterPrimaryContactModal(primaryContact) {
    this.modalService.open(primaryContact,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });
  }

  onClickOpenReportingTagDictionary(reportingTagDictionary) {
    this.modalService.open(reportingTagDictionary,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });
    console.log(reportingTagDictionary)
    console.log(this.reportingTagDictionary)
    reportingTagDictionary = [
      {
        'owner': 'Owner',
        'ownerReportingLevel': 'Owner level reporting'
      }
    ]
  }

  openPartnerServiceNoteModal(partnerCode: string, partnerServiceNote) {
    this.modalService.open(partnerServiceNote,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });

    this.spinnerService.show();

    this.partnerCode = partnerCode;

    this.routeService.getPartnerServiceNote(this.partnerCode).subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
        }
        
        this.partnerServiceNote = [].concat(res.body);

        for(let i = 0; i < this.partnerServiceNote.length; i++) {
          this.serviceNote = this.partnerServiceNote[i].serviceNote
        }
      }
    )
  }

  openPartnerCustCareNoteModal(partnerCode: string, partnerCustCareNote) {
    this.modalService.open(partnerCustCareNote,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });

    this.spinnerService.show();

    this.partnerCode = partnerCode;

    this.routeService.getPartnerCustCareNote(this.partnerCode).subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
        }
        this.partnerCustCareNote = [].concat(res.body);

        for(let i = 0; i < this.partnerCustCareNote.length; i++) {
          this.customerCareNote = this.partnerCustCareNote[i].customerCareNote;
        }
      }
    )
  }

  openPartnerCriticalMessage(partnerCode: string, partnerCriticalMessage) {
    this.modalService.open(partnerCriticalMessage,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });

    this.spinnerService.show();

    this.partnerCode = partnerCode;

    this.routeService.getPartnerCriticalMessage(this.partnerCode).subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
        }

        this.partnerCriticalMessage = [].concat(res.body);

        for(let i = 0; i < this.partnerCriticalMessage.length; i++) {
          this.criticalMessage = this.partnerCriticalMessage[i].criticalMessage;
        }
      }
    )
  }

}
