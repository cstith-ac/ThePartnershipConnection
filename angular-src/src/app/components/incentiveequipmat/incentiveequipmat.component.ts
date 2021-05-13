import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { ListMaterialItems } from '../../models/listmaterialitems';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { Incentive_Add_Equipment } from '../../models/incentiveaddequipment';

@Component({
  selector: 'app-incentiveequipmat',
  templateUrl: './incentiveequipmat.component.html',
  styleUrls: ['./incentiveequipmat.component.css']
})
export class IncentiveequipmatComponent implements OnInit {
  @Input() equipmatForDashboard: { ItemID: number; Description: string; Quantity: number; Cost: number; Total: number }

  incentiveEquipMatEntryForm: FormGroup;

  listMatItems: ListMaterialItems[];
  incentive_Add_Equipment: Incentive_Add_Equipment[];

  item: '';
  description: '';
  quantity: number;
  cost: number;
  total: number;
  totalEquipMatCalc;

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    private router: Router,
    private incentiveEntryService: IncentiveEntryService,
    private currencyPipe: CurrencyPipe
  ) {
    // this.incentiveEquipMatEntryForm = this.fb.group({
    //   entry: this.fb.array([
    //     this.fb.group({
    //       ItemID: ["", Validators.required],
    //       Description: ["", Validators.required],
    //       Quantity: ["", Validators.required],
    //       Cost: ["", Validators.required],
    //       Total: ["", Validators.required]
    //     })
    //   ])
    // })
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
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      Quantity: ["", Validators.required],
      Cost: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  onSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRows'];
    //push values to the incentive component
    //not working. will use in the ngOnDestroy
    this.incentiveEntryService.updateEquipMat(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].ItemID, this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Description, this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Quantity, this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Cost, this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Total);
    
    console.log(JSON.stringify(this.incentiveEquipMatEntryForm.controls['entryRows'].value));
    console.log(this.incentiveEquipMatEntryForm.get('entryRows').value)
    localStorage.setItem('equipmatentry',JSON.stringify(this.incentiveEquipMatEntryForm.value) )
    // console.log(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].ItemID);
    // console.log(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Description)
    // console.log(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Quantity)
    // console.log(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Cost);
    // console.log(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Total);

    //localStorage.setItem('totalEquipMatCalc', this.total.toString());
    this.router.navigate(['/incentive-dashboard'])
    return

    control.push(this.initEntryRow());
  }

  //whenever user clicks add new item, a new element should be inserted into the formArray
  // addNewItem(form: FormGroup) {
  //   console.log('add')
  //   const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRows'];
  //   control.push(this.initEntryRow());

  //   //add a delete row button
  // }
  addNewItem():void {
    (<FormArray>this.incentiveEquipMatEntryForm.get('entryRows'))
    .push(this.initEntryRow());

    //add a delete row button
  }

  removeNewItem(i: number) {
    const control = (<FormArray>this.incentiveEquipMatEntryForm.get('entryRows'))
    .removeAt(i);
  }

  calculateQuantity(val:any) {
    this.quantity = this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Quantity;
    console.log(this.quantity);
  }

  calculateCost(val:any){
    this.cost = parseInt(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Cost);
    console.log(this.cost);
    this.calculateTotal(val)
  }

  calculateTotal(val:any) {
    let totalEquipMatCalc = this.total = (this.quantity * this.cost);
    //this.incentiveEquipMatEntryForm.controls.entryRows['Total'].patchValue(totalEquipMatCalc);

    this.totalEquipMatCalc = totalEquipMatCalc.toString();
    localStorage.setItem('totalEquipMatCalc', this.totalEquipMatCalc);

    const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRows');
    controlArray.controls[0].get('Total').setValue(this.totalEquipMatCalc);
  }

}
