import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IncentiveEntry } from '../../models/incentiveentry';
import { InstallCompanyList } from '../../models/installcompanylist';
import { InstallCompanyList2 } from 'src/app/models/installcompanylist2';
import { CheckBoxIndex } from '../../models/checkboxindex';
import { CheckBoxIncompatible } from '../../models/checkboxincompatible';
import { PartnerServiceListingExtended } from 'src/app/models/partnerservicelistingextended';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { CheckBoxAutoInsertList } from 'src/app/models/checkboxautoinsertlist';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-incentiveentry',
  templateUrl: './incentiveentry.component.html',
  styleUrls: ['./incentiveentry.component.css']
})
export class IncentiveentryComponent implements OnInit {
  @Output() incentiveEntryOutput: EventEmitter<any> = new EventEmitter<any>();
  public value;
  public percentage = 0.7;
  public formatOptions: any = {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "name",
  };

  incentiveEntry: IncentiveEntry[];
  installCompanyList: InstallCompanyList[];
  installCompanyList2: InstallCompanyList2[];
  checkBoxIndex: CheckBoxIndex[];
  checkBoxIncompatible: CheckBoxIncompatible[];
  checkBoxAutoInsertList: CheckBoxAutoInsertList[];
  partnerServiceListingExtended: PartnerServiceListingExtended[];
  incentiveEntryForm: FormGroup;
  submitted = false;
  installCompanyID;
  companyName;
  partnerCode;
  closeResult = '';

  invoiceNumber;
  invoiceDate;
  invoiceTotal;//currencypipe

  customerVisit: '';
  contractResign: '';
  addRate: '';
  lteUpgrade: '';
  landlineToCellConversion: '';
  systemReprogram: '';
  servicePerformed: '';
  sitePickup: '';
  newSite: '';
  systemTransfer: '';
  other: '';
  id;
  checkBoxName;
  serviceIncluded;
  checkBoxIncompatibleSelection;
  thisBox;
  notThisBox;
  // selectedForCheckBoxAutoInsert = ['Y','N','N','Y','N','Y','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N'];
  selectedForCheckBoxAutoInsert = [];
  selectedAutopay;
  selected=-1;
  selected1=-1; //remove once fixed
  //selected1=12; //value of 11 auto-populates checkbox

  //pagination
  searchTerm: string;
  page = 1;
  pageSize = 25;
  collectionSize: number;
  allInstallCompanyList2: InstallCompanyList2[];
  clickedID;
  clickedCompanyName;
  clickedPartnerCode;

  customer_Id;
  customer_Site_Id;
  customer_System_Id;
  ticket_Number;
  results: any[] = [];
  filterCategory;

  constructor(
    private currencyPipe: CurrencyPipe,
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    private incentiveEntryService: IncentiveEntryService,
    private router: Router,
    public fb: FormBuilder,
    private el: ElementRef,
    private modalService: NgbModal
  ) {
    this.installCompanyID = JSON.parse(localStorage.getItem('installCompanyID'));
    console.log(this.installCompanyID)
   }

  ngOnInit() {
    localStorage.setItem("serviceIncluded","n");

    this.installCompanyID = JSON.parse(localStorage.getItem('installCompanyID'));
    console.log(this.installCompanyID)
    // console.log(this.selectedForCheckBoxAutoInsert)

    // if(this.selectedForCheckBoxAutoInsert.length === 0) {
    //   console.log('Array is empty!')
    // }

    $("#wrapper").addClass("toggled");

    if(this.selectedForCheckBoxAutoInsert.length === 0) {
      setTimeout(() => {
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('ClientVisit').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('AdoptionVisit').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('LandlineToCell').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('ContractResign').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('Reprogram').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('LteUpgrade').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('AddNewRMRorService').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('PickUp').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('NewSite').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('SystemTransfer').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('CreditCardAutoPay').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('ACHAutopay').value.value);
        //this.selectedForCheckBoxAutoInsert.push(this.installCompanyID);
        const n = 'n';
        const times = 30;
        for(let i = 13;i <= times; i++){
          //console.log(i);
          n.split(',')
          //this.selectedForCheckBoxAutoInsert.push(i)
          this.selectedForCheckBoxAutoInsert.push(n.repeat(1))
        }
        //this.selectedForCheckBoxAutoInsert.push(this.installCompanyID);
        this.selectedForCheckBoxAutoInsert.push(JSON.parse(localStorage.getItem('installCompanyID')))

        let myTag = this.el.nativeElement.querySelector('.entryColumn2');
        $('.entryColumn2').eq(0).remove();
        $('.entryColumn2').eq(1).remove();
        $('.entryColumn2').eq(2).remove();
        $('.entryColumn2').eq(3).remove();
        $('.entryColumn3').eq(0).remove();
        $('.entryColumn3').eq(1).remove();
        $('.entryColumn3').eq(2).remove();
        $('.entryColumn3').eq(3).remove();
        $('.entryColumn3').eq(4).remove();
        $('.entryColumn3').eq(5).remove();
  
        this.incentiveEntryForm.controls['PickUp'].disable();
      })
    } else {
      setTimeout(() => {
        // this.selectedForCheckBoxAutoInsert.push(374)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('ClientVisit').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('AdoptionVisit').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('LandlineToCell').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('ContractResign').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('Reprogram').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('LteUpgrade').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('AddNewRMRorService').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('PickUp').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('NewSite').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('SystemTransfer').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('CreditCardAutoPay').value.value)
        this.selectedForCheckBoxAutoInsert.push(this.incentiveEntryForm.get('ACHAutopay').value.value);
        //this.selectedForCheckBoxAutoInsert.push(this.installCompanyID);
        const n = 'n';
        const times = 30;
        for(let i=13;i<=times;i++){
          console.log(i);
          n.split(',');
          this.selectedForCheckBoxAutoInsert.push(n.repeat(1))
        }
        //this.selectedForCheckBoxAutoInsert.push(this.installCompanyID);
        //this.selectedForCheckBoxAutoInsert.push(JSON.parse(localStorage.getItem('installCompanyID')))
  
        let myTag = this.el.nativeElement.querySelector('.entryColumn2');
        $('.entryColumn2').eq(0).remove();
        $('.entryColumn2').eq(1).remove();
        $('.entryColumn2').eq(2).remove();
        $('.entryColumn2').eq(3).remove();
        $('.entryColumn2').eq(4).remove();
        $('.entryColumn3').eq(0).remove();
        $('.entryColumn3').eq(1).remove();
        $('.entryColumn3').eq(2).remove();
        $('.entryColumn3').eq(3).remove();
        $('.entryColumn3').eq(4).remove();
        $('.entryColumn3').eq(5).remove();
  
        this.incentiveEntryForm.controls['PickUp'].disable();
      },1000);
    }

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('companyName');
      localStorage.removeItem('installCompanyID');
      localStorage.removeItem('partnerCode');
      localStorage.removeItem('invoiceNumber');
      localStorage.removeItem('invoiceDate');
      localStorage.removeItem('invoiceTotal');
      localStorage.removeItem('siteName');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.routeService.getInstallCompanyList2().subscribe(
      res => {
        console.log(res[0])
        this.installCompanyList2 = res;
        this.collectionSize = res.length;
        this.allInstallCompanyList2 = this.installCompanyList2;
        

        for(var i = 0; i < this.installCompanyList2.length; i++) {
          this.installCompanyID = this.installCompanyList2[0].installCompanyID;
          localStorage.setItem('installCompanyID', this.installCompanyID);
          this.companyName = this.installCompanyList2[0].companyName;
          localStorage.setItem('companyName',this.companyName);
          this.partnerCode = this.installCompanyList2[0].partnerCode;
          localStorage.setItem('partnerCode',this.partnerCode);
        }
      }
    )

    this.routeService.getCheckBoxIndex().subscribe(
      res => {
        res.forEach(e => {
          this.checkBoxIndex = res;

          this.id = e.id;
          this.checkBoxName = e.checkBoxName;
          //this.checked
        })
      }
    )

    this.routeService.getCheckBoxIncompatible().subscribe(
      res => {
        this.checkBoxIncompatible=res;
        res.forEach((x) => 
          console.log(x))
      }
    )

    this.incentiveEntryForm = this.fb.group({
      InvoiceNumber: ["", Validators.required],
      InvoiceDate: ["", Validators.required],
      InvoiceTotal: ["", Validators.required],
      ServiceIncluded: ["n", Validators.required],
      // ServiceIncluded: [{value:"n", checked:true},Validators.required],
      CompanyName: this.companyName,
      PartnerCode: this.partnerCode,
      ClientVisit:  [{value:'n', disabled:false, checked:false}],
      AdoptionVisit: [{value:'n', disabled:false, checked:false}],
      LandlineToCell:  [{value:'n', disabled:false, checked:false}],
      ContractResign: [{value:'n', disabled:false, checked:false}],
      Reprogram:  [{value:'n', disabled:false, checked:false}],
      LteUpgrade:  [{value:'n', disabled:false, checked:false}],
      AddNewRMRorService: [{value:'n', disabled:false, checked:false}],
      PickUp: [{value:'n', disabled:true, checked:false}],
      NewSite:  [{value:'n', disabled:true, checked:false}],
      SystemTransfer:  [{value:'n', disabled:true, checked:false}],
      CreditCardAutoPay: [{value:'n', disabled:true, checked:false}],
      ACHAutopay: [{value:'n', disabled:true, checked:false}],
      TicketNumber: this.ticket_Number
    })

    //this.incentiveEntryForm.controls['ServiceIncluded'].setValue(true)
    //console.log(this.incentiveEntryForm.controls['ServiceIncluded'].value)
  }

  transformAmount(element) {
    this.invoiceTotal = this.currencyPipe.transform(this.invoiceTotal, '$');

    element.target.value = this.invoiceTotal;
  }

  get f() { 
    return this.incentiveEntryForm.controls; 
  }

  onSubmit(form: FormGroup) {

    this.submitted = true;

    localStorage.setItem('invoiceNumber',this.incentiveEntryForm.get('InvoiceNumber').value);
    localStorage.setItem('invoiceDate',this.incentiveEntryForm.get('InvoiceDate').value);
    localStorage.setItem('invoiceTotal',this.incentiveEntryForm.get('InvoiceTotal').value);
    localStorage.setItem("serviceIncluded",this.incentiveEntryForm.get('ServiceIncluded').value);

    this.selectedForCheckBoxAutoInsert.splice(30,1,JSON.parse(localStorage.getItem("installCompanyID")))
    console.log(this.selectedForCheckBoxAutoInsert);
    localStorage.setItem("checkBoxAutoInsertList", JSON.stringify(this.selectedForCheckBoxAutoInsert));

    //return
    this.router.navigate(["/incentive-dashboard"]);
    //this.router.navigate(["/incentive-dashboard-test"])//delete me after testing
  }

  disableOther(e) {
    if(e.target.value !== 11) {
      console.log(e.target.value)
    }
  }

  onChangeServiceIncluded(e) {
    console.log(e.target.value)
    this.serviceIncluded = e.target.value;
    localStorage.setItem("serviceIncluded",e.target.value);
  }

  onChangeCC(e) {
    this.incentiveEntryForm.valueChanges.subscribe(x => {
      console.log(x)
    })

    //console.log(e.target.value)
    if(e.target.checked) {
      this.incentiveEntryForm.controls['ACHAutopay'].disable();
      //console.log('disable ACHAutopay');
      this.selectedForCheckBoxAutoInsert.push(e.target.value);
    } 
    if(!e.target.checked) {
      this.incentiveEntryForm.controls['ACHAutopay'].enable();
      //console.log('enable CreditCardAutoPay');
      this.selectedForCheckBoxAutoInsert.pop()
    }
  }

  onChangeACH(e) {
    this.incentiveEntryForm.valueChanges.subscribe(x => {
      console.log(x)
    })
    
    //console.log(e.target.value)
    if(e.target.checked) {
      this.incentiveEntryForm.controls['CreditCardAutoPay'].disable();
      //console.log('disable CreditCardAutoPay');
      //this.selectedForCheckBoxAutoInsert.push(e.target.value);
    } 
    if(!e.target.checked) {
      this.incentiveEntryForm.controls['CreditCardAutoPay'].enable();
      //console.log('enable CreditCardAutoPay');
      //this.selectedForCheckBoxAutoInsert.pop();
    }
  }

  onChangeClientVisit(e) {
    if(e.target.checked) { 
      if(e.target.value == 1) {
        this.selectedForCheckBoxAutoInsert.splice(0,1,'y');
        this.incentiveEntryForm.controls['AdoptionVisit'].disable();
        
        //if one box has a y value, insert a n value into the other
        this.selectedForCheckBoxAutoInsert.splice(1,1,'n');
      }
      if(e.target.value == 2) {
        this.selectedForCheckBoxAutoInsert.splice(1,1,'y');
        this.incentiveEntryForm.controls['ClientVisit'].disable();

        //if one box has a y value, insert a n value into the other
        this.selectedForCheckBoxAutoInsert.splice(0,1,'n');
      }
      if(e.target.value == 3) {
        this.selectedForCheckBoxAutoInsert.splice(2,1,'y');
      }
      if(e.target.value == 4) {
        this.selectedForCheckBoxAutoInsert.splice(3,1,'y');
      }
      if(e.target.value == 5) {
        this.selectedForCheckBoxAutoInsert.splice(4,1,'y');
      }
      if(e.target.value == 6) {
        this.selectedForCheckBoxAutoInsert.splice(5,1,'y');
      }
      if(e.target.value == 7) {
        this.selectedForCheckBoxAutoInsert.splice(6,1,'y');
      }
      if(e.target.value == 8) {
        this.selectedForCheckBoxAutoInsert.splice(7,1,'y');
      }
      if(e.target.value == 9) {
        this.selectedForCheckBoxAutoInsert.splice(8,1,'y');
      }
      if(e.target.value == 10) {
        this.selectedForCheckBoxAutoInsert.splice(9,1,'y');
      }
      if(e.target.value == 11) {
        this.selectedForCheckBoxAutoInsert.splice(10,1,'y');
        this.incentiveEntryForm.controls['ACHAutopay'].disable();
        this.incentiveEntryForm.controls['CreditCardAutoPay'].enable();

        this.selectedForCheckBoxAutoInsert.splice(11,1,'n');
      }
      if(e.target.value == 12) {
        this.selectedForCheckBoxAutoInsert.splice(11,1,'y');
        this.incentiveEntryForm.controls['CreditCardAutoPay'].disable();
        this.incentiveEntryForm.controls['ACHAutopay'].enable();

        this.selectedForCheckBoxAutoInsert.splice(10,1,'n');
      }
    } else if (!e.target.checked) {
      if(e.target.value == 1) {
        this.selectedForCheckBoxAutoInsert.splice(0,1,'n');
        this.incentiveEntryForm.controls['AdoptionVisit'].enable();
      }
      if(e.target.value == 2) {
        this.selectedForCheckBoxAutoInsert.splice(1,1,'n');
        this.incentiveEntryForm.controls['ClientVisit'].enable();
      }
      if(e.target.value == 3) {
        this.selectedForCheckBoxAutoInsert.splice(2,1,'n');
      }
      if(e.target.value == 4) {
        this.selectedForCheckBoxAutoInsert.splice(3,1,'n');
      }
      if(e.target.value == 5) {
        this.selectedForCheckBoxAutoInsert.splice(4,1,'n');
      }
      if(e.target.value == 6) {
        this.selectedForCheckBoxAutoInsert.splice(5,1,'n');
      }
      if(e.target.value == 7) {
        this.selectedForCheckBoxAutoInsert.splice(6,1,'n');
      }
      if(e.target.value == 8) {
        this.selectedForCheckBoxAutoInsert.splice(7,1,'n');
      }
      if(e.target.value == 9) {
        this.selectedForCheckBoxAutoInsert.splice(8,1,'n');
      }
      if(e.target.value == 10) {
        this.selectedForCheckBoxAutoInsert.splice(9,1,'n');
      }
      if(e.target.value == 11) {
        this.selectedForCheckBoxAutoInsert.splice(10,1,'n');
        this.incentiveEntryForm.controls['ACHAutopay'].disable();
        //this.incentiveEntryForm.controls['CreditCardAutoPay'].enable();
      }
      if(e.target.value == 12) {
        this.selectedForCheckBoxAutoInsert.splice(11,1,'n');
        this.incentiveEntryForm.controls['CreditCardAutoPay'].disable();
        //this.incentiveEntryForm.controls['ACHAutopay'].enable();
      }
      // console.log('unchecked: '+ e.target.value);
      // console.log(e.target.checked);
    }
  }

  disableClientAdoption(e){
    if(e.target.checked === 1){
      this.incentiveEntryForm.controls['AdoptionVisit'].disable();
    }
  }

  openInstallCompanyListModal(installCompanyListContent) {
    //open a modal with a list containing InstallCompanyList
    //select an item from the InstallCompanyList
    //this will update the incentive entry companyName and partnerCode
    this.modalService.open(installCompanyListContent, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onChangeGetPartnerServiceListingExt(e) {
    console.log(e.target.value)

    this.routeService.getPartnerServiceListingExtended().subscribe(
      res => {
        this.partnerServiceListingExtended = [].concat(res); //object

        this.partnerServiceListingExtended = this.partnerServiceListingExtended.filter((val) => val.ticket_Number)
        this.collectionSize = this.partnerServiceListingExtended.length;
      }
    )
  }

  // public keyword = 'ticket_Number';

  // getServerResponse(event){
  //   console.log(parseInt(event))
  //   console.log(this.incentiveEntryForm.controls["TicketNumber"])

  //   let numbersOnly = (val) => {
  //     if(typeof(val) === 'number') {
  //       return val;
  //     }
  //   }

  //   this.incentiveEntryForm.controls["TicketNumber"].valueChanges
  //     .pipe(debounceTime(1000), distinctUntilChanged(), filter(numbersOnly))
  //     .subscribe(queryField => this.routeService.getPartnerServiceListingExtended().subscribe(
  //       response => {
  //         console.log(response)
  //         this.results = response;
  //       }
  //     ))
  // }

  selectEvent(item) {
    console.log(item.ticket_Number)
    this.incentiveEntryForm.controls["TicketNumber"].setValue(this.ticket_Number)
    //this.siteElement.nativeElement.focus()
  }

  onFocused(e){
    // here we can write our code for doing something when input is focused
  }

  searchCleared(){
    console.log('searchCleared');
    this.results = [];

    this.partnerServiceListingExtended = [];
    
    this.ticket_Number = "";

    this.incentiveEntryForm.controls["TicketNumber"].reset();
  }

  openACTicketNumberListModal(acTicketNumberListContent) {
    this.modalService.open(acTicketNumberListContent, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    });

    this.spinnerService.show();

    this.routeService.getPartnerServiceListingExtended().subscribe(
      res => {
        if(res) {
          this.spinnerService.hide()
        }
        this.partnerServiceListingExtended = [].concat(res); //object

        // for(let i = 0; i < this.partnerServiceListingExtended.length; i++) {
        //   console.log(this.partnerServiceListingExtended[i].customer_Id)
        //   console.log(this.partnerServiceListingExtended[i].customer_Site_Id)
        //   console.log(this.partnerServiceListingExtended[i].customer_System_Id)
        // }
      }
    )
  }

  onGetCustomerInvoiceInfo(customer_Id: number, customer_Site_Id: number, customer_System_Id: number, ticket_Number: number) {
    this.customer_Id = customer_Id;
    this.customer_Site_Id = customer_Site_Id;
    this.customer_System_Id = customer_System_Id;
    this.ticket_Number = ticket_Number;

    localStorage.setItem("customer_Id", this.customer_Id);
    localStorage.setItem("customer_Site_Id", this.customer_Site_Id);
    localStorage.setItem("customer_System_Id", this.customer_System_Id);
    localStorage.setItem("ticket_Number", this.ticket_Number);

    this.serviceIncluded = "y";
    localStorage.setItem("serviceIncluded", "y");
    this.incentiveEntryForm.controls["ServiceIncluded"].setValue("y")

    this.modalService.dismissAll();
  }

  onClickNewDefaultSelection(installCompanyID:number,companyName: string, partnerCode: string) {
    this.clickedID = installCompanyID;
    this.clickedCompanyName = companyName;
    this.clickedPartnerCode = partnerCode;

    this.installCompanyID = this.clickedID;
    this.companyName = this.clickedCompanyName;
    this.partnerCode = this.clickedPartnerCode;

    localStorage.setItem('installCompanyID',this.installCompanyID);
    localStorage.setItem('companyName',this.companyName);
    localStorage.setItem('partnerCode',this.partnerCode);

    this.modalService.dismissAll();
    this.searchTerm = '';
  }

  onOpenPartnerDetailsModal() {
    $("#partnerDetails").modal("show");
  }

  onOpenMessageModal() {
    $("#messageModal").modal("show");
  }

  onSubmitMessage(form: FormGroup) {
    console.log('message')
    // this.routeService.postPartnerAddNote(this.partnerServiceListingForm.value).subscribe(
    //   res => {
    //     //console.log(res)
    //     $("#detailsModal").modal("hide");
    //     $("#memoModal").modal("hide");
    //   },
    //   error => console.log('error: ', error)
    // )
  }

  onAddDocument() {
    console.log('add doc')
  }

  openComingSoonModal(comingSoon) {
    this.modalService.open(comingSoon,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class'
      });
  }

  search(value: string): void {
    this.installCompanyList2 = this.allInstallCompanyList2.filter((val) => 
    val.companyName.toLowerCase().includes(value));
    this.collectionSize = this.installCompanyList2.length;
  }

  checkIfNotFound(e) {
    // if(this.installCompanyList2.length==0) {
    //   console.log('nothing found')
    // }
    //if(this.searchTerm)
    console.log('nothing found')
  }

  getPageSymbol(current: number) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
