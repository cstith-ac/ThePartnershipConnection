import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { ListLaborItems } from '../../models/listlaboritems';
import { IncentiveEntryService } from '../../services/incentive-entry.service';

@Component({
  selector: 'app-incentivelaborcharges',
  templateUrl: './incentivelaborcharges.component.html',
  styleUrls: ['./incentivelaborcharges.component.css']
})
export class IncentivelaborchargesComponent implements OnInit, OnDestroy {
  incentiveLaborChargesEntryForm: FormGroup;
  listLaborItems: ListLaborItems[];

  description: '';

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

}
