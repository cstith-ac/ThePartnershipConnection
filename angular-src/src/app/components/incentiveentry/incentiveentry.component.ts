import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { IncentiveEntry } from '../../models/incentiveentry';
import { InstallCompanyList } from '../../models/installcompanylist';
import { CheckBoxIndex } from '../../models/checkboxindex';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-incentiveentry',
  templateUrl: './incentiveentry.component.html',
  styleUrls: ['./incentiveentry.component.css']
})
export class IncentiveentryComponent implements OnInit {
  @Output() incentiveEntryOutput: EventEmitter<any> = new EventEmitter<any>();
  //@Output() incentiveEntryOutput = new EventEmitter<Array<any>>();
  //@Input() incentiveEntry:IncentiveEntry;

  incentiveEntry: IncentiveEntry[];
  installCompanyList: InstallCompanyList[];
  checkBoxIndex: CheckBoxIndex[];
  incentiveEntryForm: FormGroup;
  submitted = false;
  installCompanyID;
  companyName;
  partnerCode;

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
  show: boolean = true;
  id;
  checkBoxName;
  dynamicVariable = false; // true based on your condition 

  constructor(
    private currencyPipe: CurrencyPipe,
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    private incentiveEntryService: IncentiveEntryService,
    private router: Router,
    public fb: FormBuilder,
    private el: ElementRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
      let myTag = this.el.nativeElement.querySelector('.entryColumn2');
      console.log(myTag)
      // $('.entryColumn2').eq(0).remove();
      // $('.entryColumn2').eq(1).remove();
      $('.entryColumn2').eq(2).remove();
      $('.entryColumn2').eq(3).remove();
      //$('.entryColumn2').eq(4).remove();
      //$('.entryColumn2').eq(5).remove();
    },1000);

    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('companyName');
      localStorage.removeItem('installCompanyID');
      localStorage.removeItem('partnerCode');
      localStorage.removeItem('invoiceNumber');
      localStorage.removeItem('invoiceDate');
      localStorage.removeItem('invoiceTotal')
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.routeService.getInstallCompanyList().subscribe(
      res => {
        this.installCompanyList = res;
        
        for(var i = 0;i < this.installCompanyList.length; i++) {

          this.installCompanyID = this.installCompanyList[i].installCompanyID;
          localStorage.setItem('installCompanyID',this.installCompanyID);

          this.companyName = this.installCompanyList[i].companyName;
          localStorage.setItem('companyName',this.companyName);

          this.partnerCode = this.installCompanyList[i].partnerCode;
          localStorage.setItem('partnerCode',this.partnerCode);

        }
      }
    )

    this.routeService.getCheckBoxIndex().subscribe(
      res => {
        //console.log(typeof(res))
        // this.checkBoxIndex = res;
        res.forEach(e => {
          //this.checkBoxIndex.push(e)
          this.checkBoxIndex = res;
          //console.log(this.checkBoxIndex)
          

          // this.checkBoxIndex.forEach((o,i) => {
          //   console.log(i);
          // })

          // this.id1 = this.checkBoxIndex.find(i=> i.id=1);
          // console.log(this.id1);

          this.id = e.id;
          this.checkBoxName = e.checkBoxName;

          //console.log(e.id)
          //console.log(e.checkBoxName)
        })
      }
    )

    this.incentiveEntryForm = this.fb.group({
      InvoiceNumber: ["", Validators.required],
      InvoiceDate: ["", Validators.required],
      InvoiceTotal: ["", Validators.required],
      ServiceIncluded: ["", Validators.required],
      CompanyName: this.companyName,
      PartnerCode: this.partnerCode,
      ClientVisit:  [false],
      AdoptionVisit: [false],
      LandlineToCell:  [false],
      ContractResign:  [false],
      Reprogram:  [false],
      LteUpgrade:  [false],
      AddNewRMRorService: [false],
      PickUp: [false],
      NewSite:  [false],
      SystemTransfer:  [false],
      CreditCardAutoPay: [false, Validators.requiredTrue],
      ACHAutopay: [false, Validators.requiredTrue]
    })
  }

  transformAmount(element) {
    this.invoiceTotal = this.currencyPipe.transform(this.invoiceTotal, '$');

    element.target.value = this.invoiceTotal;
  }

  // routeToIncentiveDashboard() {
  //   this.router.navigate(["/incentive-dashboard"]);
  // }

  get f() { 
    return this.incentiveEntryForm.controls; 
  }

  test() {
    this.router.navigate(["/incentive-dashboard"]);
  }

  onSubmit(form: FormGroup) {

    this.submitted = true;

    console.log(this.incentiveEntryForm.get('InvoiceNumber').value);
    localStorage.setItem('invoiceNumber',this.incentiveEntryForm.get('InvoiceNumber').value);
    localStorage.setItem('invoiceDate',this.incentiveEntryForm.get('InvoiceDate').value);
    localStorage.setItem('invoiceTotal',this.incentiveEntryForm.get('InvoiceTotal').value);

    // this.incentiveEntryForm.controls["CompanyName"].setValue(this.companyName);
    // this.incentiveEntryForm.controls["PartnerCode"].setValue(this.partnerCode);

    // this.incentiveEntry = this.incentiveEntryForm.value;

    // this.incentiveEntryService.sharedIncentiveInfo = this.incentiveEntry;

    // this.incentiveEntryOutput.emit(this.incentiveEntry);
    //this.incentiveEntryOutput.emit('testing data');

    //console.log(this.incentiveEntryForm.value);
    //console.log(Object.values(this.incentiveEntry))
    //return;
    this.router.navigate(["/incentive-dashboard"]);
  }

  onChangeServiceIncluded(e) {
    console.log(e.target.value)
  }

  disableOther(e) {
    if(e.target.value == 11) {
      console.log(e.target.value+''+' was checked, disable the other')
      
    }
    if(e.target.value == 12) {
      console.log(e.target.value+''+' was checked, disable the other')
    }
  }

  onChangeCC(e) {
    if(e.target.checked) {
      this.incentiveEntryForm.controls['ACHAutopay'].disable();
      //console.log('disable ACHAutopay');
      this.checkBoxIndex.forEach(x=>{
        //console.log(x);
        if(e.target.value == 11) {
          //console.log(e.target.value);
        }
      })
    } 
    if(!e.target.checked) {
      this.incentiveEntryForm.controls['ACHAutopay'].enable();
      //console.log('enable CreditCardAutoPay');
    }
  }

  onChangeACH(e) {
    if(e.target.checked) {
      this.incentiveEntryForm.controls['CreditCardAutoPay'].disable();
      //console.log('disable CreditCardAutoPay');
      this.checkBoxIndex.forEach(x=>{
        //console.log(x);
        if(e.target.value == 12) {
          //console.log(e.target.value);
        }
      })
    } 
    if(!e.target.checked) {
      this.incentiveEntryForm.controls['CreditCardAutoPay'].enable();
      //console.log('enable CreditCardAutoPay');
    }
  }

  onChangeACHorCC(e) {
    if(e.target.checked && e.target.value === 11) {
      //console.log(e.target.value)
      console.log('working for 11...')
      //this.incentiveEntryForm.controls['ACHAutopay'].disable();
    } 
    if (e.target.checked && e.target.value === 12) {
      //console.log(e.target.value)
      console.log('working for 12...')
    }
  }

  onChangeClientVisit(e) {
    if(e.target.checked) {  
      //e.target.setAttribute('disabled','')   
      console.log('checked: '+ e.target.value)
      // console.log(this.incentiveEntryForm.get('ACHAutopay').value)
      // console.log(this.incentiveEntryForm.get('CreditCardAutoPay').value)
    } else {
      console.log('unchecked: '+ e.target.value)
    }
  }

}
