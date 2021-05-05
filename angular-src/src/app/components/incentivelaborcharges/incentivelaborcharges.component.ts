import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { ListLaborItems } from '../../models/listlaboritems';

@Component({
  selector: 'app-incentivelaborcharges',
  templateUrl: './incentivelaborcharges.component.html',
  styleUrls: ['./incentivelaborcharges.component.css']
})
export class IncentivelaborchargesComponent implements OnInit, OnDestroy {
  incentiveLaborChargesEntryForm: FormGroup;

  listLaborItems: ListLaborItems[];

  description: '';
  hours: number;
  costPerHour: number;
  total: number;

  constructor(
    public fb: FormBuilder,
    private incentiveEntryService: IncentiveEntryService,
    public routeService: RouteService,
    private router: Router
  ) { 
    this.incentiveLaborChargesEntryForm = this.fb.group({
      entry: this.fb.array([
        this.fb.group({
          ItemID: ["", Validators.required],
          Description: ["", Validators.required],
          Hours: ["", Validators.required],
          CostPerHour: ["", Validators.required],
          Total: ["", Validators.required]
        })
      ])
    })
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

  ngOnDestroy(){
    console.log('destroyed')
    //this lifecycle hook is called after the user submits form and the incentive dashboard component is loaded
    //send the form data to incentive dashboard
    const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRows'];
    this.incentiveEntryService.sharedIncentiveLaborChargesInfo = control;
  }

  initEntryRow() {
    return this.fb.group({
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      Hours: ["", Validators.required],
      CostPerHour: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  onSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRows'];
    //push values to the incentive component
    //not working. will use in the ngOnDestroy
    this.incentiveEntryService.sharedIncentiveLaborChargesInfo = control;

    //push the labor charges total to the incentive dashboard
    localStorage.setItem('totalLaborChargesCalc', this.total.toString());
    this.router.navigate(['/incentive-dashboard'])

    return
  }

  //whenever user clicks add new item, a new element should be inserted into the formArray
  addNewItem(form: FormGroup) {
    console.log('add')
    const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRows'];
    control.push(this.initEntryRow());

    //add a delete row button
  }

  calculateHours(val:any) {
    console.log(this.hours);
  }

  calculateCostPerHour(val:any) {
    console.log(this.costPerHour);
    this.calculateTotal(val);
  }

  calculateTotal(val:any) {
    let totalLaborChargesCalc = this.total = this.hours * this.costPerHour;
    this.incentiveLaborChargesEntryForm.controls.entryRows['Total'].patchValue(totalLaborChargesCalc);
  }

}
