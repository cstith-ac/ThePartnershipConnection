import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
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
  @Input() recurringForDashboard: { ItemID: number; Description: string; BillCycle: string; RMR: number; PassThrough: number; BillingStartDate: Date; Multiple: number; Add2Item: number; Total: number }
  @Output() incentiveRecurringOutput = new EventEmitter();
  
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
  totalRecurringCalc;

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

  initEntryRow() {
    return this.fb.group({
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      BillCycle: ["", Validators.required],
      RMR: ["", Validators.required],
      PassThrough: ["", Validators.required],
      BillingStartDate: ["", Validators.required],
      Add2Item: [0],
      Multiple: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  get r():FormArray {
    return this.incentiveRecurringEntryForm.get('entryRows') as FormArray;
  }

  onSubmit(form: FormGroup) {
    console.log(form.value.Total)
    
    const control = <FormArray>this.incentiveRecurringEntryForm.controls['entryRows'];
    //push values to the incentive component
    //not working. will use in the ngOnDestroy
    //this.incentiveEntryService.sharedIncentiveRecurringInfo = control;
    
    //push the recurring total to the incentive dashboard component
    // the parameters itemid, description, billcyle, rmr, passthrough, billingstartdate, multiple,and add2item are needed in the dashboard component to submit from the submit event

    //this.incentiveRecurringOutput.emit(this.totalRecurringCalc);
    //console.log(this.incentiveRecurringEntryForm.controls.entryRows['controls'].get('ItemID'))
    this.incentiveEntryService.updateRecurring(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].ItemID, this.incentiveRecurringEntryForm.controls['entryRows'].value[0].Description, this.incentiveRecurringEntryForm.controls['entryRows'].value[0].BillCycle, this.incentiveRecurringEntryForm.controls['entryRows'].value[0].RMR, this.incentiveRecurringEntryForm.controls['entryRows'].value[0].PassThrough, this.incentiveRecurringEntryForm.controls['entryRows'].value[0].BillingStartDate, this.incentiveRecurringEntryForm.controls['entryRows'].value[0].Multiple, this.incentiveRecurringEntryForm.controls['entryRows'].value[0].Add2Item, this.incentiveRecurringEntryForm.controls['entryRows'].value[0].Total);
    
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0])
    // return
    console.log(JSON.stringify(this.incentiveRecurringEntryForm.controls['entryRows'].value));
    console.log(this.incentiveRecurringEntryForm.get('entryRows').value)
    localStorage.setItem('recurringentry',JSON.stringify(this.incentiveRecurringEntryForm.controls['entryRows'].value[0]))
    
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].ItemID);
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].Description)
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].BillCycle)
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].RMR);
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].PassThrough);
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].BillingStartDate);
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].Add2Item);
    // console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].Multiple);

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
    this.rmr = parseInt(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].RMR);
    //console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].RMR);
  }

  calculatePassThrough(val:any) {
    this.passThrough = parseInt(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].PassThrough);
    //console.log(this.incentiveRecurringEntryForm.controls['entryRows'].value[0].PassThrough);
  }

  calculateMultiple(val:any) {
    this.multiple = this.incentiveRecurringEntryForm.controls['entryRows'].value[0].Multiple;
    this.calculateTotal(val)
  }

  calculateTotal(val:any) {
    //console.log('calc total')
    let totalRecurringCalc = this.total = (this.rmr - this.passThrough) * this.multiple;

    //console.log(totalRecurringCalc)
    //console.log(totalRecurringCalc.toString())
    
    this.totalRecurringCalc = totalRecurringCalc.toString();
    localStorage.setItem('totalRecurringCalc',this.totalRecurringCalc);

    const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRows')
    controlArray.controls[0].get('Total').setValue(this.totalRecurringCalc);
  }

  checkboxChanged(e) {
    const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRows')
    let currentVal = controlArray.controls[0].get('Add2Item').value;
    console.log(currentVal)
    if(currentVal === true) {
      console.log('change to 1')
      controlArray.controls[0].get('Add2Item').setValue(1);
    }
    else if(currentVal === false) {
      console.log('change to 0')
      controlArray.controls[0].get('Add2Item').setValue(0);
    } 
    
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
