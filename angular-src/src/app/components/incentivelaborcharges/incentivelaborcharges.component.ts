import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { ListLaborItems } from '../../models/listlaboritems';

@Component({
  selector: 'app-incentivelaborcharges',
  templateUrl: './incentivelaborcharges.component.html',
  styleUrls: ['./incentivelaborcharges.component.css']
})
export class IncentivelaborchargesComponent implements OnInit {
  incentiveLaborChargesEntryForm: FormGroup;
  listLaborItems: ListLaborItems[];

  description: '';

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService
  ) { 
    this.incentiveLaborChargesEntryForm = this.fb.group({
      entry: this.fb.array([
        this.fb.group({
          Item: ["", Validators.required],
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

  initEntryRow() {
    return this.fb.group({
      Item: ["", Validators.required],
      Description: ["", Validators.required],
      Hours: ["", Validators.required],
      CostPerHour: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  onSubmit(form: FormGroup) {
    console.log(form.value.Total)
  }

}
