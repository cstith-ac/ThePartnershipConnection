import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  rmr: '';
  passThrough: '';
  billingStarts: '';
  addToAnExistingRMRItem: '';
  multiple: '';
  total:'';

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService
  ) { }

  ngOnInit() {
    this.incentiveRecurringEntryForm = this.fb.group({
      Item: '',
      Description: '',
      BillCycle: '',
      RMR: '',
      PassThrough: '',
      BillingStarts: '',
      AddToAnExistingRMRItem: '',
      Multiple: '',
      Total:'',
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

}
