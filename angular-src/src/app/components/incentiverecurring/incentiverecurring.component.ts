import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ListRecurringItems } from 'src/app/models/listrecurringitems';
import { ListMultiples } from 'src/app/models/listmultiples';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { Incentive_Add_Recurring } from '../../models/incentiveaddrecurring';

@Component({
  selector: 'app-incentiverecurring',
  templateUrl: './incentiverecurring.component.html',
  styleUrls: ['./incentiverecurring.component.css']
})
export class IncentiverecurringComponent implements OnInit {
  incentiveRecurringEntryForm: FormGroup;

  listRecurringItems: ListRecurringItems[];
  listMultiples: ListMultiples[];
  incentive_Add_Recurring: Incentive_Add_Recurring[];

  item: '';
  description: '';
  billCycle: '';
  rmr: number;
  passThrough: number;
  billingStarts: '';
  addToAnExistingRMRItem: '';
  multiple: number;
  total: number;

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    private router: Router,
    private incentiveEntryService: IncentiveEntryService,
    private currencyPipe: CurrencyPipe
  ) { 
    // this.incentiveRecurringEntryForm = this.fb.group({
    //   entry: this.fb.array([
    //     this.fb.group({
    //       ItemID: ["", Validators.required],
    //       Description: ["", Validators.required],
    //       BillCycle: ["", Validators.required],
    //       RMR: ["", Validators.required],
    //       PassThrough: ["", Validators.required],
    //       BillingStartDate: ["", Validators.required],
    //       Add2Item: [""],
    //       Multiple: ["", Validators.required],
    //       Total: ["", Validators.required]
    //     })
    //   ])
    // })
  }

  ngOnInit() {
    this.incentiveRecurringEntryForm = this.fb.group({
      entryRows: this.fb.array([this.initEntryRow()])
    })

    this.incentiveRecurringEntryForm.controls.entryRows.valueChanges.subscribe(form => {
      //console.log(form[0].RMR)
      if(form[0].RMR) {
        this.incentiveRecurringEntryForm.patchValue({
          RMR: this.currencyPipe.transform(form[0].RMR.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '1.0-0')
        }, {emitEvent:false});
      }
    })
    this.incentiveRecurringEntryForm.valueChanges.subscribe(form => {
      if(form.PassThrough) {
        this.incentiveRecurringEntryForm.patchValue({
          PassThrough: this.currencyPipe.transform(form.PassThrough.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '1.0-0')
        }, {emitEvent:false});
      }
    })
    this.incentiveRecurringEntryForm.valueChanges.subscribe(form => {
      if(form.Total) {
        this.incentiveRecurringEntryForm.patchValue({
          Total: this.currencyPipe.transform(form.Total.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '1.0-0')
        }, {emitEvent:false});
      }
    })
    // this.incentiveRecurringEntryForm = this.fb.group({
    //   entry: this.fb.array([
    //     this.fb.group({
    //       Item: ["", Validators.required],
    //       Description: ["", Validators.required],
    //       BillCycle: ["", Validators.required],
    //       RMR: ["", Validators.required],
    //       PassThrough: ["", Validators.required],
    //       BillingStarts: ["", Validators.required],
    //       AddToAnExistingRMRItem: ["", Validators.required],
    //       Multiple: ["", Validators.required],
    //       Total: ["", Validators.required]
    //     })
    //   ])
    // })
    // this.incentiveRecurringEntryForm = this.fb.group({
    //   Item: ["", Validators.required],
    //   Description: ["", Validators.required],
    //   BillCycle: ["", Validators.required],
    //   RMR: ["", Validators.required],
    //   PassThrough: ["", Validators.required],
    //   BillingStarts: ["", Validators.required],
    //   AddToAnExistingRMRItem: ["", Validators.required],
    //   Multiple: ["", Validators.required],
    //   Total: ["", Validators.required]
    // })

    this.routeService.getListRecurringItems().subscribe(
      res => {
        this.listRecurringItems = res;
      }
    )

    this.routeService.getListMultiples().subscribe(
      res => {
        this.listMultiples = res;
      }
    )
  }

  // ngOnDestroy(){
  //   console.log('destroyed')
  //   //this lifecycle hook is called after the user submits form and the incentive dashboard component is loaded
  //   //send the form data to incentive dashboard
  //   const control = <FormArray>this.incentiveRecurringEntryForm.controls['entryRows'];
  //   this.incentiveEntryService.sharedIncentiveRecurringInfo = control;
  //   //submit this form from the incentive dashboard
  // }

  initEntryRow() {
    return this.fb.group({
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      BillCycle: ["", Validators.required],
      RMR: ["", Validators.required],
      PassThrough: ["", Validators.required],
      BillingStartDate: ["", Validators.required],
      Add2Item: [""],
      Multiple: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  onSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveRecurringEntryForm.controls['entryRows'];
    //push values to the incentive component
    //not working. will use in the ngOnDestroy
    //this.incentiveEntryService.sharedIncentiveRecurringInfo = control;
    
    //push the recurring total to the incentive dashboard component
    // localStorage.setItem('totalRecurringCalc',this.total.toString());
    this.router.navigate(['/incentive-dashboard'])
    return

    control.push(this.initEntryRow());
  }

  //whenever user clicks add new item, a new element should be inserted into the formArray
  // addNewItem(form: FormGroup) {
  //   console.log('add')
  //   const control = <FormArray>this.incentiveRecurringEntryForm.controls['entryRows'];
  //   control.push(this.initEntryRow());

  //   //add a delete row button
  // }
  addNewItem():void {
    (<FormArray>this.incentiveRecurringEntryForm.get('entryRows'))
    .push(this.initEntryRow());

    //add a delete row button
  }

  removeNewItem(i: number) {
    const control = (<FormArray>this.incentiveRecurringEntryForm.get('entryRows'))
    .removeAt(i);
  }

  calculateRMR(val:any){
    console.log(this.rmr);
  }

  calculatePassThrough(val:any) {
    console.log(this.passThrough);
  }

  calculateMultiple(val:any) {
    console.log(this.multiple);
    this.calculateTotal(val)
  }

  calculateTotal(val:any) {
    
    let totalRecurringCalc = this.total = (this.rmr - this.passThrough) * this.multiple;
    this.incentiveRecurringEntryForm.controls.entryRows['Total'].patchValue(totalRecurringCalc);
    
    //this.totalRecurringCalc = totalRecurringCalc;
  }

  // transformAmount(element) {
  //   this.rmr = this.currencyPipe.transform(this.rmr, '$');
  //   element.target.value = this.rmr;

  //   this.passThrough = this.currencyPipe.transform(this.passThrough, '$');
  //   element.target.value = this.passThrough;

  //   this.total = this.currencyPipe.transform(this.total, '$');
  //   element.target.value = this.total;
  // }

}
