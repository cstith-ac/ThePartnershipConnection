import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { IncentiveEntry } from '../../models/incentiveentry';
import { InstallCompanyList } from '../../models/installcompanylist';
import { CheckBoxIndex } from '../../models/checkboxindex';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  constructor(
    private currencyPipe: CurrencyPipe,
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    private incentiveEntryService: IncentiveEntryService,
    private router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
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
      console.log('your logged in')
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
        // this.checkBoxIndex = res;
        res.forEach(e => {
          //this.checkBoxIndex.push(e)
          this.checkBoxIndex = res;

          this.checkBoxIndex.forEach((o,i) => {
            //console.log(i);

          })

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
      CompanyName: this.companyName,
      PartnerCode: this.partnerCode,
      ClientVisit:  [false, Validators.required],
      AdoptionVisit: [false, Validators.required],
      LandlineToCell:  [false, Validators.required],
      ContractResign:  [false, Validators.required],
      Reprogram:  [false, Validators.required],
      LteUpgrade:  [false, Validators.required],
      AddNewRMRorService: [false, Validators.required],
      PickUp: [false, Validators.required],
      NewSite:  [false, Validators.required],
      SystemTransfer:  [false, Validators.required],
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

  onSubmit(form: FormGroup) {

    this.submitted = true;

    // localStorage.setItem('invoiceNumber',this.invoiceNumber);
    // localStorage.setItem('invoiceDate',this.invoiceDate);
    // localStorage.setItem('invoiceTotal',this.invoiceTotal);

    // this.incentiveEntryForm.controls["CompanyName"].setValue(this.companyName);
    // this.incentiveEntryForm.controls["PartnerCode"].setValue(this.partnerCode);

    // this.incentiveEntry = this.incentiveEntryForm.value;

    // this.incentiveEntryService.sharedIncentiveInfo = this.incentiveEntry;

    // this.incentiveEntryOutput.emit(this.incentiveEntry);
    //this.incentiveEntryOutput.emit('testing data');

    console.log(this.incentiveEntryForm.value);
    //console.log(Object.values(this.incentiveEntry))
    return;
    this.router.navigate(["/incentive-dashboard"]);
  }

  onChangeCC(e) {
    if(e.target.checked) {
      this.incentiveEntryForm.controls['ACHAutopay'].disable();
    } 
    if(!e.target.checked) {
      this.incentiveEntryForm.controls['ACHAutopay'].enable();
    }
  }

  onChangeACH(e) {
    if(e.target.checked) {
      this.incentiveEntryForm.controls['CreditCardAutoPay'].disable();
    } 
    if(!e.target.checked) {
      this.incentiveEntryForm.controls['CreditCardAutoPay'].enable();
    }
  }

  onChangeClientVisit(e) {
    if(e.target.checked) {
      // console.log('checked: '+ e.target.id)
      // console.log('checked: '+ e.target.checkBoxName)
      console.log('checked: '+ e.target.value)
    } else {
      // console.log('unchecked: ' + e.target.id)
      // console.log('unchecked: ' + e.target.checkBoxName)
      console.log('unchecked: '+ e.target.value)
    }
  }

}
