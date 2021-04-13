import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { ListMaterialItems } from '../../models/listmaterialitems';

@Component({
  selector: 'app-incentiveequipmat',
  templateUrl: './incentiveequipmat.component.html',
  styleUrls: ['./incentiveequipmat.component.css']
})
export class IncentiveequipmatComponent implements OnInit {
  incentiveEquipMatEntryForm: FormGroup;
  listMatItems: ListMaterialItems[];

  item: '';
  description: '';
  quantity: '';
  cost: '';
  total: '';

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService
  ) {
    this.incentiveEquipMatEntryForm = this.fb.group({
      entry: this.fb.array([
        this.fb.group({
          Item: ["", Validators.required],
          Description: ["", Validators.required],
          Quantity: ["", Validators.required],
          Cost: ["", Validators.required],
          Total: ["", Validators.required]
        })
      ])
    })
   }

  ngOnInit() {
    this.incentiveEquipMatEntryForm = this.fb.group({
      entryRows: this.fb.array([this.initEntryRow()])
    })
    // this.incentiveEquipMatEntryForm = this.fb.group({
    //   Item: ["", Validators.required],
    //   Description: ["", Validators.required],
    //   Quantity: ["", Validators.required],
    //   Cost: ["", Validators.required],
    //   Total: ["", Validators.required]
    // })

    this.routeService.getListMaterialItems().subscribe(
      res => {
        this.listMatItems = res;
      }
    )
  }

  initEntryRow() {
    return this.fb.group({
      Item: ["", Validators.required],
      Description: ["", Validators.required],
      Quantity: ["", Validators.required],
      Cost: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  onSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRows'];
    control.push(this.initEntryRow());
  }

}
