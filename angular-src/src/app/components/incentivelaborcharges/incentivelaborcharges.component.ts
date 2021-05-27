import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ListLaborItems } from 'src/app/models/listlaboritems';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { Incentive_Add_Labor } from '../../models/incentiveaddlabor';

@Component({
  selector: 'app-incentivelaborcharges',
  templateUrl: './incentivelaborcharges.component.html',
  styleUrls: ['./incentivelaborcharges.component.css']
})
export class IncentivelaborchargesComponent implements OnInit {
  @Input() laborchargesForDashboard: { ItemID: number; Description: string; Hours: number; CostPerHour: number; Total: number }

  incentiveLaborChargesEntryForm: FormGroup;

  listLaborItems: ListLaborItems[];
  incentive_Add_Labor: Incentive_Add_Labor[];

  itemID;
  description;
  hours: number;
  costPerHour: number;
  total: number;
  totalLaborChargesCalc;

  newObjectFromLocalStorage;
  itemIDFromLocalStorage;
  descriptionFromLocalStorage;
  hoursFromLocalStorage;
  costPerHourFromLocalStorage;
  totalFromLocalStorage;

  invoiceNumber;
  customerName;
  customerSiteInformation;
  customerSystemInformation;

  constructor(
    public fb: FormBuilder,
    public routeService: RouteService,
    private router: Router,
    private incentiveEntryService: IncentiveEntryService,
    private currencyPipe: CurrencyPipe
  ) { 
    // this.incentiveLaborChargesEntryForm = this.fb.group({
    //   entry: this.fb.array([
    //     this.fb.group({
    //       ItemID: ["", Validators.required],
    //       Description: ["", Validators.required],
    //       Hours: ["", Validators.required],
    //       CostPerHour: ["", Validators.required],
    //       Total: ["", Validators.required]
    //     })
    //   ])
    // })
  }

  ngOnInit() {
    this.invoiceNumber = localStorage.getItem("invoiceNumber");
    this.customerName = localStorage.getItem("customerName");
    this.customerSiteInformation = localStorage.getItem("customerSiteName");
    this.customerSystemInformation = localStorage.getItem("customerSystemInformation");

    let laborchargesentry = localStorage.getItem("laborchargesentry");
    let parsedLaborChargesEntryItem = JSON.parse(laborchargesentry) as Incentive_Add_Labor;

    let item = new Incentive_Add_Labor;
    this.newObjectFromLocalStorage = Object.assign(item, parsedLaborChargesEntryItem);

    //re-populate Item if page is refreshed
    setTimeout(() => {
      const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRows');
      controlArray.controls[0].get('ItemID').setValue(this.newObjectFromLocalStorage.ItemID);
      controlArray.controls[0].get('Description').setValue(this.newObjectFromLocalStorage.Description);
      controlArray.controls[0].get('Hours').setValue(this.newObjectFromLocalStorage.Hours);
      controlArray.controls[0].get('CostPerHour').setValue(this.newObjectFromLocalStorage.CostPerHour);
      controlArray.controls[0].get('Total').setValue(this.newObjectFromLocalStorage.Total);
    }, 4);

    // this.itemID = this.newObjectFromLocalStorage.ItemID;
    // this.description = this.newObjectFromLocalStorage.Description;
    // this.hoursFromLocalStorage = this.newObjectFromLocalStorage.Hours;
    // this.costPerHourFromLocalStorage = this.newObjectFromLocalStorage.CostPerHour;
    // this.totalFromLocalStorage = this.newObjectFromLocalStorage.Total;

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

  // ngOnDestroy(){
  //   console.log('destroyed')
  //   //this lifecycle hook is called after the user submits form and the incentive dashboard component is loaded
  //   //send the form data to incentive dashboard
  //   const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRows'];
  //   this.incentiveEntryService.sharedIncentiveLaborChargesInfo = control;
  // }

  initEntryRow() {
    return this.fb.group({
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      Hours: ["", Validators.required],
      CostPerHour: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  getItemName(e:any,i:number) {
    //get the description from listrecurringitems based on the selected ItemID
    console.log(e.target.value)//returns 'index: item_id', as a string
    let currentID = e.target.value;
    setTimeout(() => {
        const getItemID = this.incentiveLaborChargesEntryForm.controls['entryRows'].value.forEach(element => {
          const result = this.listLaborItems.filter(x => x.item_id == element.ItemID);

          var string;
          result.forEach(function(e) {
            string = e.itemName.toString();//extract string from returned array
          });
          // console.log(string);
          const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRows');
          controlArray.at(i).get('Description').setValue(string);
        })
      }, 4);
  }

  get r():FormArray {
    return this.incentiveLaborChargesEntryForm.get('entryRows') as FormArray;
  }

  onSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRows'];
    
    this.incentiveEntryService.updateLaborCharges(this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].ItemID, this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Description, this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Hours, this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].CostPerHour, this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Total);

    // console.log(JSON.stringify(this.incentiveLaborChargesEntryForm.controls['entryRows'].value));
    // console.log(this.incentiveLaborChargesEntryForm.get('entryRows').value);
    // localStorage.setItem('laborchargesentry', JSON.stringify(this.incentiveLaborChargesEntryForm.value));
    localStorage.setItem('laborchargesentry', JSON.stringify(this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0]));
    this.router.navigate(['/incentive-dashboard'])
    return
  }

  //whenever user clicks add new item, a new element should be inserted into the formArray
  addNewItem():void {
    (<FormArray>this.incentiveLaborChargesEntryForm.get('entryRows'))
    .push(this.initEntryRow());

    //add a delete row button
  }

  removeNewItem(i: number) {
    const control = (<FormArray>this.incentiveLaborChargesEntryForm.get('entryRows'))
    .removeAt(i);
  }

  calculateHours(val:any) {
    //this.hours = parseInt(this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].Hours);
    const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRows');
    var rowVal;
    controlArray.controls.forEach(function(e) {
      rowVal = e.value;
    });
    //console.log(rowVal.Hours);
    this.hours = parseInt(rowVal.Hours);
  }

  calculateCostPerHour(val:any,i:number) {
    // this.costPerHour = parseInt(this.incentiveLaborChargesEntryForm.controls['entryRows'].value[0].CostPerHour);
    const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRows');
    var rowVal;
    controlArray.controls.forEach(function(e) {
      rowVal = e.value;
    });
    this.costPerHour = parseInt(rowVal.CostPerHour);
    this.calculateTotal(val,i);
  }

  calculateTotal(val:any,i:number) {
    let totalLaborChargesCalc = this.total = (this.hours * this.costPerHour);
    
    this.totalLaborChargesCalc = totalLaborChargesCalc.toString();
    localStorage.setItem('totalLaborChargesCalc', this.totalLaborChargesCalc);

    const getItemID = this.incentiveLaborChargesEntryForm.controls['entryRows'].value.forEach(element => {
      const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRows');
      controlArray.at(i).get('Total').setValue(this.totalLaborChargesCalc);
    })
    // const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRows')
    // controlArray.controls[0].get('Total').setValue(this.totalLaborChargesCalc);
  }

}
