import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ListLaborItems } from 'src/app/models/listlaboritems';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { Incentive_Add_Labor } from '../../models/incentiveaddlabor';

@Component({
  selector: 'app-incentivelaborcharges',
  templateUrl: './incentivelaborcharges.component.html',
  styleUrls: ['./incentivelaborcharges.component.css']
})
export class IncentivelaborchargesComponent implements OnInit {
  @Input() laborchargesForDashboard: { ItemID: number; Description: string; Hours: number; CostPerHour: number; Total: number }

  incentiveLaborChargesEntryForm: FormGroup;

  listLaborItems: ListLaborItems[];
  incentive_Add_Labor: Incentive_Add_Labor[];

  description: '';
  hours: number;
  costPerHour: number;
  total: number;
  totalLaborChargesCalc;

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    private router: Router,
    private incentiveEntryService: IncentiveEntryService,
    private currencyPipe: CurrencyPipe
  ) { 
    // this.incentiveLaborChargesEntryForm = this.fb.group({
    //   entry: this.fb.array([
    //     this.fb.group({
    //       ItemID: ["", Validators.required],
    //       Description: ["", Validators.required],
    //       Hours: ["", Validators.required],
    //       CostPerHour: ["", Validators.required],
    //       Total: ["", Validators.required]
    //     })
    //   ])
    // })
  }

  ngOnInit() {
    this.incentiveLaborChargesEntryForm = this.fb.group({
      entryRows: this.fb.array([this.initEntryRow()])
    })
    // this.incentiveLaborChargesEntryForm = this.fb.group({
    //   Item: ["", Validators.required],
    //   Description: ["", Validators.required],
    //   Hours: ["", Validators.required],
    //   CostPerHour: ["", Validators.required],
    //   Total: ["", Validators.required]
    // })

    this.routeService.getListLaborItems().subscribe(
      res => {
        this.listLaborItems = res;
      }
    )
  }

  // ngOnDestroy(){
  //   console.log('destroyed')
  //   //this lifecycle hook is called after the user submits form and the incentive dashboard component is loaded
  //   //send the form data to incentive dashboard
  //   const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRows'];
  //   this.incentiveEntryService.sharedIncentiveLaborChargesInfo = control;
  // }

  initEntryRow() {
    return this.fb.group({
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      Hours: ["", Validators.required],
      CostPerHour: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  get r():FormArray {
    return this.incentiveLaborChargesEntryForm.get('entryRows') as FormArray;
  }

  onSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRows'];
    
    this.incentiveEntryService.updateLaborCharges(this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].ItemID, this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Description, this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Hours, this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].CostPerHour, this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Total);

    console.log(JSON.stringify(this.incentiveLaborChargesEntryForm.controls['entryRows'].value));
    console.log(this.incentiveLaborChargesEntryForm.get('entryRows').value);
    localStorage.setItem('laborchargesentry', JSON.stringify(this.incentiveLaborChargesEntryForm.value));
    this.router.navigate(['/incentive-dashboard'])
    return
  }

  //whenever user clicks add new item, a new element should be inserted into the formArray
  addNewItem():void {
    (<FormArray>this.incentiveLaborChargesEntryForm.get('entryRows'))
    .push(this.initEntryRow());

    //add a delete row button
  }

  removeNewItem(i: number) {
    const control = (<FormArray>this.incentiveLaborChargesEntryForm.get('entryRows'))
    .removeAt(i);
  }

  calculateHours(val:any) {
    this.calculateHours = parseInt(this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Hours);
    console.log(this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Hours);
  }

  calculateCostPerHour(val:any) {
    this.costPerHour = parseInt(this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].CostPerHour);
    this.calculateTotal(val);
  }

  calculateTotal(val:any) {
    let totalLaborChargesCalc = this.total = this.hours * this.costPerHour;
    // this.incentiveLaborChargesEntryForm.controls.entryRows['Total'].patchValue(totalLaborChargesCalc);
    this.totalLaborChargesCalc = totalLaborChargesCalc.toString();

    const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRows')
    controlArray.controls[0].get('Total').setValue(this.totalLaborChargesCalc);
  }

}
