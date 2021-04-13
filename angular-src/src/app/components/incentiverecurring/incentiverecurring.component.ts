import { Component, OnInit, ElementRef } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ListRecurringItems } from 'src/app/models/listrecurringitems';
import { ListMultiples } from 'src/app/models/listmultiples';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-incentiverecurring',
  templateUrl: './incentiverecurring.component.html',
  styleUrls: ['./incentiverecurring.component.css']
})
export class IncentiverecurringComponent implements OnInit {
  incentiveRecurringEntryForm: FormGroup;

  listRecurringItems: ListRecurringItems[];
  listMultiples: ListMultiples[];

  item: '';
  description: '';
  billCycle: '';
  //rmr;
  //passThrough;
  billingStarts: '';
  addToAnExistingRMRItem: '';
  multiple: '';
  //total;

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    private currencyPipe: CurrencyPipe
  ) { 
    this.incentiveRecurringEntryForm = this.fb.group({
      entry: this.fb.array([
        this.fb.group({
          Item: ["", Validators.required],
          Description: ["", Validators.required],
          BillCycle: ["", Validators.required],
          RMR: ["", Validators.required],
          PassThrough: ["", Validators.required],
          BillingStarts: ["", Validators.required],
          AddToAnExistingRMRItem: ["", Validators.required],
          Multiple: ["", Validators.required],
          Total: ["", Validators.required]
        })
      ])
    })
  }

  ngOnInit() {
    this.incentiveRecurringEntryForm = this.fb.group({
      entryRows: this.fb.array([this.initEntryRow()])
    })

    this.incentiveRecurringEntryForm.controls.entryRows.valueChanges.subscribe(form => {
      console.log(form[0].RMR)
      if(form[0].RMR) {
        //debugger
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
        //console.log(res);
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
      Item: ["", Validators.required],
      Description: ["", Validators.required],
      BillCycle: ["", Validators.required],
      RMR: ["", Validators.required],
      PassThrough: ["", Validators.required],
      BillingStarts: ["", Validators.required],
      AddToAnExistingRMRItem: ["", Validators.required],
      Multiple: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  onSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveRecurringEntryForm.controls['entryRows'];
    control.push(this.initEntryRow());
  }

  //whenever user clicks add new item, a new element should be inserted into the formArray
  addNewItem() {
    console.log('add')
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
