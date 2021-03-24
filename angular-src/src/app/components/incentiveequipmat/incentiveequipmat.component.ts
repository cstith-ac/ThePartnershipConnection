import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  ) { }

  ngOnInit() {
    this.incentiveEquipMatEntryForm = this.fb.group({
      Item: ["", Validators.required],
      Description: ["", Validators.required],
      Quantity: ["", Validators.required],
      Cost: ["", Validators.required],
      Total: ["", Validators.required]
    })

    this.routeService.getListMaterialItems().subscribe(
      res => {
        this.listMatItems = res;
      }
    )
  }

  onSubmit(form: FormGroup) {
    console.log(form.value.Total)
  }

}
