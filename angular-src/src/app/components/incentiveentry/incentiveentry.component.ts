import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncentiveEntry } from '../../models/incentiveentry';

@Component({
  selector: 'app-incentiveentry',
  templateUrl: './incentiveentry.component.html',
  styleUrls: ['./incentiveentry.component.css']
})
export class IncentiveentryComponent implements OnInit {
  @Output() incentiveEntryOutput = new EventEmitter<Array<any>>();
  //@Input() incentiveEntry:IncentiveEntry;

  incentiveEntry: IncentiveEntry[];
  incentiveEntryForm: FormGroup;
  submitted = false;

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
    private router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    
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
      CustomerVisit:  [false, Validators.requiredTrue],
      ContractResign:  [false, Validators.requiredTrue],
      AddRate:  [false, Validators.requiredTrue],
      LteUpgrade:  [false, Validators.requiredTrue],
      LandlineToCellConversion:  [false, Validators.requiredTrue],
      SystemReprogram:  [false, Validators.requiredTrue],
      ServicePerformed:  [false, Validators.requiredTrue],
      SitePickup:  [false, Validators.requiredTrue],
      NewSite:  [false, Validators.requiredTrue],
      SystemTransfer:  [false, Validators.requiredTrue],
      Other:  [false, Validators.requiredTrue]
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
    this.incentiveEntry = this.incentiveEntryForm.value;
    this.incentiveEntryOutput.emit(this.incentiveEntry);
    console.log(Object.values(this.incentiveEntry))
  
    this.router.navigate(["/incentive-dashboard"]);
  }

}
