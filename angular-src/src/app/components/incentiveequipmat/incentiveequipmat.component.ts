import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { ListMaterialItems } from '../../models/listmaterialitems';

@Component({
  selector: 'app-incentiveequipmat',
  templateUrl: './incentiveequipmat.component.html',
  styleUrls: ['./incentiveequipmat.component.css']
})
export class IncentiveequipmatComponent implements OnInit, OnDestroy {
  incentiveEquipMatEntryForm: FormGroup;

  listMatItems: ListMaterialItems[];

  item: '';
  description: '';
  quantity: number;
  cost: number;
  total: number;

  constructor(
    public fb: FormBuilder,
    private incentiveEntryService: IncentiveEntryService,
    public routeService: RouteService,
    private router: Router
  ) {
    this.incentiveEquipMatEntryForm = this.fb.group({
      entry: this.fb.array([
        this.fb.group({
          ItemID: ["", Validators.required],
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

  ngOnDestroy(){
    console.log('destroyed');
    //this lifecycle hook is called after the user submits form and the incentive dashboard component is loaded
    //send the form data to incentive dashboard
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRows'];
    this.incentiveEntryService.sharedIncentiveEquipMatInfo = control;
    //submit this form from the incentive dashboard
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
    this.incentiveEntryService.sharedIncentiveEquipMatInfo = control;
    
    //push the equipmat total to the incentive dashboard component
    localStorage.setItem('totalEquipMatCalc', this.total.toString());
    this.router.navigate(['/incentive-dashboard'])
    return

    control.push(this.initEntryRow());
  }

  //whenever user clicks add new item, a new element should be inserted into the formArray
  addNewItem(form: FormGroup) {
    console.log('add')
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRows'];
    control.push(this.initEntryRow());

    //add a delete row button
  }

  calculateQuantity(val:any) {
    console.log(this.quantity);
  }

  calculateCost(val:any){
    console.log(this.cost);
    this.calculateTotal(val)
  }

  calculateTotal(val:any) {
    let totalEquipMatCalc = this.total = (this.quantity * this.cost);
    this.incentiveEquipMatEntryForm.controls.entryRows['Total'].patchValue(totalEquipMatCalc);
  }

}
