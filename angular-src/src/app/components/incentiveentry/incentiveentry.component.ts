import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { IncentiveEntry } from '../../models/incentiveentry';
import { InstallCompanyList } from '../../models/installcompanylist';
import { CheckBoxIndex } from '../../models/checkboxindex';
import { CheckBoxIncompatible } from '../../models/checkboxincompatible';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { CheckBoxAutoInsertList } from 'src/app/models/checkboxautoinsertlist';
import { JwtHelperService } from '@auth0/angular-jwt';
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
  checkBoxIndex: CheckBoxIndex[];
  checkBoxIncompatible: CheckBoxIncompatible[];
  checkBoxAutoInsertList: CheckBoxAutoInsertList[];
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
    localStorage.setItem("serviceIncluded","n");

    console.log(this.selectedForCheckBoxAutoInsert)

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
        n.split(',')
        //this.selectedForCheckBoxAutoInsert.push(i)
        this.selectedForCheckBoxAutoInsert.push(n.repeat(1))
      }
      this.selectedForCheckBoxAutoInsert.push(this.installCompanyID);
      //this.selectedForCheckBoxAutoInsert.push(n.repeat(30))
      //console.log(this.incentiveEntryForm.get('ClientVisit').value.value);
      // console.log(this.incentiveEntryForm.get('AdoptionVisit').value.value);
      // console.log(this.incentiveEntryForm.get('LandlineToCell').value.value);
      // console.log(this.incentiveEntryForm.get('ContractResign').value.value);
      // console.log(this.incentiveEntryForm.get('Reprogram').value.value);
      // console.log(this.incentiveEntryForm.get('LteUpgrade').value.value);
      // console.log(this.incentiveEntryForm.get('AddNewRMRorService').value.value);
      // console.log(this.incentiveEntryForm.get('PickUp').value.value);
      // console.log(this.incentiveEntryForm.get('NewSite').value.value);
      // console.log(this.incentiveEntryForm.get('SystemTransfer').value.value);
      // console.log(this.incentiveEntryForm.get('CreditCardAutoPay').value.value);
      // console.log(this.incentiveEntryForm.get('ACHAutopay').value.value);

      let myTag = this.el.nativeElement.querySelector('.entryColumn2');
      //console.log(myTag)
      // $('.entryColumn2').eq(0).remove();
      // $('.entryColumn2').eq(1).remove();
      $('.entryColumn2').eq(2).remove();
      $('.entryColumn2').eq(3).remove();
      $('.entryColumn3').eq(1).remove();
      $('.entryColumn3').eq(2).remove();
      $('.entryColumn3').eq(3).remove();
      $('.entryColumn3').eq(4).remove();
      $('.entryColumn3').eq(5).remove();

      this.incentiveEntryForm.controls['PickUp'].disable();
    },1000);

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

    this.routeService.getInstallCompanyList().subscribe(
      res => {
        // console.log(res.status)
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

          // this.checkBoxIndex.forEach((o,i) => {
          //   console.log(i);
          // })

          // this.id1 = this.checkBoxIndex.find(i=> i.id=1);
          // console.log(this.id1);

          this.id = e.id;
          this.checkBoxName = e.checkBoxName;
        })
      }
    )

    this.routeService.getCheckBoxIncompatible().subscribe(
      res => {
        //console.log(res) //Array
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
      CompanyName: this.companyName,
      PartnerCode: this.partnerCode,
      // ClientVisit:  [false],
      // AdoptionVisit: [false],
      // LandlineToCell:  [false],
      // ContractResign:  [false],
      // Reprogram:  [false],
      // LteUpgrade:  [false],
      // AddNewRMRorService: [false],
      // PickUp: [false],
      // NewSite:  [false],
      // SystemTransfer:  [false],
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
      // CreditCardAutoPay: [{value:'n', disabled:true, checked:false}],
      // ACHAutopay: [{value:'n', disabled:true, checked:false}],
      // checkArray:this.fb.array([])
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

    //this.routeService.postCheckboxAutoInsertList

    // console.log(this.incentiveEntryForm.get('InvoiceNumber').value);
    localStorage.setItem('invoiceNumber',this.incentiveEntryForm.get('InvoiceNumber').value);
    localStorage.setItem('invoiceDate',this.incentiveEntryForm.get('InvoiceDate').value);
    localStorage.setItem('invoiceTotal',this.incentiveEntryForm.get('InvoiceTotal').value);
    localStorage.setItem("serviceIncluded",this.incentiveEntryForm.get('ServiceIncluded').value);

    // this.incentiveEntryForm.controls["CompanyName"].setValue(this.companyName);
    // this.incentiveEntryForm.controls["PartnerCode"].setValue(this.partnerCode);

    // this.incentiveEntry = this.incentiveEntryForm.value;

    // this.incentiveEntryService.sharedIncentiveInfo = this.incentiveEntry;

    // this.incentiveEntryOutput.emit(this.incentiveEntry);
    //this.incentiveEntryOutput.emit('testing data');

    //console.log(this.incentiveEntryForm.value);
    //console.log(Object.values(this.incentiveEntry))

    //Submit to stored proc dbo.CheckBoxAutoInsertList or store the values in localstorage and retrieve these values on the dashboard to populate inputs
    console.log(this.selectedForCheckBoxAutoInsert);
    localStorage.setItem("checkBoxAutoInsertList", JSON.stringify(this.selectedForCheckBoxAutoInsert));

    // this.routeService.postCheckboxAutoInsertList(JSON.stringify(this.selectedForCheckBoxAutoInsert)).subscribe(
    //   res => {
    //     console.log(res);
    //     localStorage.setItem("checkBoxAutoInsertList", JSON.stringify(res));

    //   }
    // )
    // let obj = {}
    // this.selectedForCheckBoxAutoInsert.forEach(item => console.log(item))

    //send something like this...
    this.routeService.postCheckboxAutoInsertList({
      "CheckBoxStatus1": this.selectedForCheckBoxAutoInsert[0],
      "CheckBoxStatus2": this.selectedForCheckBoxAutoInsert[1],
      "CheckBoxStatus3": this.selectedForCheckBoxAutoInsert[2],
      "CheckBoxStatus4": this.selectedForCheckBoxAutoInsert[3],
      "CheckBoxStatus5": this.selectedForCheckBoxAutoInsert[4],
      "CheckBoxStatus6": this.selectedForCheckBoxAutoInsert[5],
      "CheckBoxStatus7": this.selectedForCheckBoxAutoInsert[6],
      "CheckBoxStatus8": this.selectedForCheckBoxAutoInsert[7],
      "CheckBoxStatus9": this.selectedForCheckBoxAutoInsert[8],
      "CheckBoxStatus10": this.selectedForCheckBoxAutoInsert[9],
      "CheckBoxStatus11": this.selectedForCheckBoxAutoInsert[10],
      "CheckBoxStatus12": this.selectedForCheckBoxAutoInsert[11],
      "CheckBoxStatus13": this.selectedForCheckBoxAutoInsert[12],
      "CheckBoxStatus14": this.selectedForCheckBoxAutoInsert[13],
      "CheckBoxStatus15": this.selectedForCheckBoxAutoInsert[14],
      "CheckBoxStatus16": this.selectedForCheckBoxAutoInsert[15],
      "CheckBoxStatus17": this.selectedForCheckBoxAutoInsert[16],
      "CheckBoxStatus18": this.selectedForCheckBoxAutoInsert[17],
      "CheckBoxStatus19": this.selectedForCheckBoxAutoInsert[18],
      "CheckBoxStatus20": this.selectedForCheckBoxAutoInsert[19],
      "CheckBoxStatus21": this.selectedForCheckBoxAutoInsert[20],
      "CheckBoxStatus22": this.selectedForCheckBoxAutoInsert[21],
      "CheckBoxStatus23": this.selectedForCheckBoxAutoInsert[22],
      "CheckBoxStatus24": this.selectedForCheckBoxAutoInsert[23],
      "CheckBoxStatus25": this.selectedForCheckBoxAutoInsert[24],
      "CheckBoxStatus26": this.selectedForCheckBoxAutoInsert[25],
      "CheckBoxStatus27": this.selectedForCheckBoxAutoInsert[26],
      "CheckBoxStatus28": this.selectedForCheckBoxAutoInsert[27],
      "CheckBoxStatus29": this.selectedForCheckBoxAutoInsert[28],
      "CheckBoxStatus30": this.selectedForCheckBoxAutoInsert[29],
      "InstallCompanyID": this.selectedForCheckBoxAutoInsert[30]
  }).subscribe(
      res => {
        console.log(res);
        localStorage.setItem("checkBoxAutoInsertList", JSON.stringify(res));

      }
    )

    //return
    this.router.navigate(["/incentive-dashboard"]);
    //this.router.navigate(["/incentive-dashboard-test"])//delete me after testing
  }

  onChangeServiceIncluded(e) {
    console.log(e.target.value)
    this.serviceIncluded = e.target.value;
    localStorage.setItem("serviceIncluded",e.target.value);
  }

  onChangeCC(e) {
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
      //console.log(e.target.value)  
      if(e.target.value == 1) {
        this.selectedForCheckBoxAutoInsert.splice(0,1,'y');
        this.incentiveEntryForm.controls['AdoptionVisit'].disable();
      }
      if(e.target.value == 2) {
        // const result = this.selectedForCheckBoxAutoInsert.map(x => {
        //   const item = this.selectedForCheckBoxAutoInsert.find(({ id }) => id === x.id);
        //   return item ? item : x;
        // });
        // var i = this.selectedForCheckBoxAutoInsert.indexOf(e.target.value);
        // console.log(i)
        
        //console.log(result)
        this.selectedForCheckBoxAutoInsert.splice(1,1,'y');

        // this.selectedForCheckBoxAutoInsert.push('y');
        this.incentiveEntryForm.controls['ClientVisit'].disable();
      }
      if(e.target.value == 3) {
        this.selectedForCheckBoxAutoInsert.splice(2,1,'y');
        // this.selectedForCheckBoxAutoInsert.push('y');
      }
      if(e.target.value == 4) {
        this.selectedForCheckBoxAutoInsert.splice(3,1,'y');
        // this.selectedForCheckBoxAutoInsert.push('y');
      }
      if(e.target.value == 5) {
        this.selectedForCheckBoxAutoInsert.splice(4,1,'y');
        // this.selectedForCheckBoxAutoInsert.push('y');
      }
      if(e.target.value == 6) {
        this.selectedForCheckBoxAutoInsert.splice(5,1,'y');
        // this.selectedForCheckBoxAutoInsert.push('y');
      }
      if(e.target.value == 7) {
        this.selectedForCheckBoxAutoInsert.splice(6,1,'y');
        // this.selectedForCheckBoxAutoInsert.push('y');
      }
      if(e.target.value == 8) {
        this.selectedForCheckBoxAutoInsert.splice(7,1,'y');
        // this.selectedForCheckBoxAutoInsert.push('y');
      }
      if(e.target.value == 9) {
        this.selectedForCheckBoxAutoInsert.splice(8,1,'y');
        // this.selectedForCheckBoxAutoInsert.push('y');
      }
      if(e.target.value == 10) {
        this.selectedForCheckBoxAutoInsert.splice(9,1,'y');
        // this.selectedForCheckBoxAutoInsert.push('y');
      }
      if(e.target.value == 11) {
        this.selectedForCheckBoxAutoInsert.splice(10,1,'y');
        this.incentiveEntryForm.controls['ACHAutopay'].disable();
        this.incentiveEntryForm.controls['CreditCardAutoPay'].enable();
      }
      if(e.target.value == 12) {
        this.selectedForCheckBoxAutoInsert.splice(11,1,'y');
        this.incentiveEntryForm.controls['CreditCardAutoPay'].disable();
        this.incentiveEntryForm.controls['ACHAutopay'].enable();
      }
      // console.log('checked: '+ e.target.value);
      // console.log(e.target.value)
      // console.log(e.target.checked);

    } else if (!e.target.checked) {
      if(e.target.value == 1) {
        // this.selectedForCheckBoxAutoInsert.pop();
        this.selectedForCheckBoxAutoInsert.splice(0,1,'n');
        this.incentiveEntryForm.controls['AdoptionVisit'].enable();
      }
      if(e.target.value == 2) {
        //this.selectedForCheckBoxAutoInsert.pop();
        // this.selectedForCheckBoxAutoInsert.forEach((i) => {
        //   console.log(i)
        // })
        this.selectedForCheckBoxAutoInsert.splice(1,1,'n');
        this.incentiveEntryForm.controls['ClientVisit'].enable();
      }
      if(e.target.value == 3) {
        this.selectedForCheckBoxAutoInsert.splice(2,1,'n');
        // this.selectedForCheckBoxAutoInsert.pop();
      }
      if(e.target.value == 4) {
        this.selectedForCheckBoxAutoInsert.splice(3,1,'n');
        // this.selectedForCheckBoxAutoInsert.pop();
      }
      if(e.target.value == 5) {
        this.selectedForCheckBoxAutoInsert.splice(4,1,'n');
        // this.selectedForCheckBoxAutoInsert.pop();
      }
      if(e.target.value == 6) {
        this.selectedForCheckBoxAutoInsert.splice(5,1,'n');
        // this.selectedForCheckBoxAutoInsert.pop();
      }
      if(e.target.value == 7) {
        this.selectedForCheckBoxAutoInsert.splice(6,1,'n');
        // this.selectedForCheckBoxAutoInsert.pop();
      }
      if(e.target.value == 8) {
        this.selectedForCheckBoxAutoInsert.splice(7,1,'n');
        // this.selectedForCheckBoxAutoInsert.pop();
      }
      if(e.target.value == 9) {
        this.selectedForCheckBoxAutoInsert.splice(8,1,'n');
        // this.selectedForCheckBoxAutoInsert.pop();
      }
      if(e.target.value == 10) {
        this.selectedForCheckBoxAutoInsert.splice(9,1,'n');
        // this.selectedForCheckBoxAutoInsert.pop();
      }
      if(e.target.value == 11) {
        this.selectedForCheckBoxAutoInsert.splice(10,1,'n');
        this.incentiveEntryForm.controls['ACHAutopay'].disable();
        this.incentiveEntryForm.controls['CreditCardAutoPay'].enable();
      }
      if(e.target.value == 12) {
        this.selectedForCheckBoxAutoInsert.splice(11,1,'n');
        this.incentiveEntryForm.controls['CreditCardAutoPay'].disable();
        this.incentiveEntryForm.controls['ACHAutopay'].enable();
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

}
