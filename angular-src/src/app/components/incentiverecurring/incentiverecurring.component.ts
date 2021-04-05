import { Component, OnInit, ElementRef } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ListRecurringItems } from 'src/app/models/listrecurringitems';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-incentiverecurring',
  templateUrl: './incentiverecurring.component.html',
  styleUrls: ['./incentiverecurring.component.css']
})
export class IncentiverecurringComponent implements OnInit {
  incentiveRecurringEntryForm: FormGroup;

  listRecurringItems: ListRecurringItems[];

  item: '';
  description: '';
  billCycle: '';
  rmr;
  passThrough: '';
  billingStarts: '';
  addToAnExistingRMRItem: '';
  multiple: '';
  total:'';

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit() {
    this.incentiveRecurringEntryForm = this.fb.group({
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

    this.routeService.getListRecurringItems().subscribe(
      res => {
        //console.log(res);
        this.listRecurringItems = res;
      }
    )
  }

  onSubmit(form: FormGroup) {
    console.log(form.value.Total)
  }

  //whenever user clicks add new item, a new element should be inserted into the formArray
  addNewItem() {
    console.log('add')
  }

  transformAmount(element) {
    this.rmr = this.currencyPipe.transform(this.rmr, '$');

    element.target.value = this.rmr;
  }

}
