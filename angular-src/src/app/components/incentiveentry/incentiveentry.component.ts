import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { IncentiveEntry } from '../../models/incentiveentry';
import { InstallCompanyList } from '../../models/installcompanylist';
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
  incentiveEntryForm: FormGroup;
  submitted = false;
  installCompanyID;
  companyName;
  partnerCode;

  invoiceNumber;
  invoiceDate;
  invoiceTotal;

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

  constructor(
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

    this.incentiveEntryForm = this.fb.group({
      // CustomerVisit: '',
      // ContractResign: '',
      // AddRate: '',
      // LteUpgrade: '',
      // LandlineToCellConversion: '',
      // SystemReprogram: '',
      // ServicePerformed: '',
      // SitePickup: '',
      // NewSite: '',
      // SystemTransfer: '',
      // Other: ''
      // CompanyName: ["", Validators.required],
      // PartnerCode: ["", Validators.required],
      InvoiceNumber: ["", Validators.required],
      InvoiceDate: ["", Validators.required],
      InvoiceTotal: ["", Validators.required],
      CompanyName: this.companyName,
      PartnerCode: this.partnerCode,
      ClientVisit:  [false, Validators.requiredTrue],
      AdoptionVisit: [false, Validators.requiredTrue],
      NoPhoneNoProblem: [false, Validators.requiredTrue],
      ContractResign:  [false, Validators.requiredTrue],
      Reprogram:  [false, Validators.requiredTrue],
      //AddRate:  [true, Validators.requiredTrue],
      LteUpgrade:  [false, Validators.requiredTrue],
      AddNewRMRorService: [false, Validators.requiredTrue],
      PickUp: [false, Validators.requiredTrue],
      //LandlineToCellConversion:  [true, Validators.requiredTrue],
      //SystemReprogram:  [true, Validators.requiredTrue],
      //ServicePerformed:  [true, Validators.requiredTrue],
      //SitePickup:  [false, Validators.requiredTrue],
      NewSite:  [false, Validators.requiredTrue],
      SystemTransfer:  [false, Validators.requiredTrue],
      //Other:  [true, Validators.requiredTrue]
    })
  }

  // routeToIncentiveDashboard() {
  //   this.router.navigate(["/incentive-dashboard"]);
  // }

  get f() { 
    return this.incentiveEntryForm.controls; 
  }

  onSubmit(form: FormGroup) {

    this.submitted = true;

    localStorage.setItem('invoiceNumber',this.invoiceNumber);
    localStorage.setItem('invoiceDate',this.invoiceDate);
    localStorage.setItem('invoiceTotal',this.invoiceTotal);

    this.incentiveEntryForm.controls["CompanyName"].setValue(this.companyName);
    this.incentiveEntryForm.controls["PartnerCode"].setValue(this.partnerCode);

    this.incentiveEntry = this.incentiveEntryForm.value;

    this.incentiveEntryService.sharedIncentiveInfo = this.incentiveEntry;

    this.incentiveEntryOutput.emit(this.incentiveEntry);
    //this.incentiveEntryOutput.emit('testing data');

    //console.log(this.incentiveEntryForm.value);
    //console.log(Object.values(this.incentiveEntry))
    //return;
    this.router.navigate(["/incentive-dashboard"]);
  }

}
