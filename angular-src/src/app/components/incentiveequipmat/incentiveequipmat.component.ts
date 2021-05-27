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

  itemID;
  item: '';
  description;
  quantity: number;
  cost: number;
  total: number;
  totalEquipMatCalc;

  newObjectFromLocalStorage;
  itemIDFromLocalStorage;
  descriptionFromLocalStorage;
  quantityFromLocalStorage;
  costFromLocalStorage;
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
    this.invoiceNumber = localStorage.getItem("invoiceNumber");
    this.customerName = localStorage.getItem("customerName");
    this.customerSiteInformation = localStorage.getItem("customerSiteName");
    this.customerSystemInformation = localStorage.getItem("customerSystemInformation");

    let equipmatentryitem = localStorage.getItem("equipmatentry");
    let parsedEquipmentMatEntryItem = JSON.parse(equipmatentryitem) as Incentive_Add_Equipment;

    let item = new Incentive_Add_Equipment;
    this.newObjectFromLocalStorage = Object.assign(item, parsedEquipmentMatEntryItem);
    console.log(this.newObjectFromLocalStorage);

    //re-populate Item if page is refreshed
    setTimeout(() => {
      const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRows');
      controlArray.controls[0].get('ItemID').setValue(this.newObjectFromLocalStorage.ItemID);
      controlArray.controls[0].get('Description').setValue(this.newObjectFromLocalStorage.Description);
      controlArray.controls[0].get('Quantity').setValue(this.newObjectFromLocalStorage.Quantity);
      controlArray.controls[0].get('Cost').setValue(this.newObjectFromLocalStorage.Cost);
      controlArray.controls[0].get('Total').setValue(this.newObjectFromLocalStorage.Total);
    },4);

    // this.itemID = this.newObjectFromLocalStorage.ItemID;
    // this.description = this.newObjectFromLocalStorage.Description;
    // this.quantityFromLocalStorage = this.newObjectFromLocalStorage.Quantity;
    // this.costFromLocalStorage = this.newObjectFromLocalStorage.Cost;
    // this.totalFromLocalStorage = this.newObjectFromLocalStorage.Total;

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

  getItemName(e:any,i:number) {
    setTimeout(() => {

      const getItemID = this.incentiveEquipMatEntryForm.controls['entryRows'].value.forEach(element => {
        console.log(element, i);

        const result = this.listMatItems.filter(x => x.item_id == element.ItemID);

        var string;
        result.forEach(function(e) {
          string = e.itemName.toString();//extract string from returned array
        });
        const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRows');
        controlArray.at(i).get('Description').setValue(string);

      })

      
      // console.log(result);
      // const n = result.map(x => {
      //   return x.itemName
      // })
      // this.description = n;
      // console.log(n);  
      }, 4);
  }

  onSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRows'];
    //push values to the incentive component
    //not working. will use in the ngOnDestroy
    this.incentiveEntryService.updateEquipMat(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].ItemID, this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Description, this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Quantity, this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Cost, this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Total);
    
    // console.log(JSON.stringify(this.incentiveEquipMatEntryForm.controls['entryRows'].value));
    // console.log(this.incentiveEquipMatEntryForm.get('entryRows').value)
    localStorage.setItem('equipmatentry',JSON.stringify(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0]));
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

    localStorage.removeItem("equipmatentry");
    localStorage.removeItem("totalEquipMatCalc");
  }

  calculateQuantity(val:any,i:number) {
    //this.quantity = this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Quantity;
    const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRows');
    var rowVal;
    controlArray.controls.forEach(function(e) {
      rowVal = e.value;
    });
    this.quantity = rowVal.Quantity;
    //console.log(this.quantity);
  }

  calculateCost(val:any,i:number){
    // this.cost = parseInt(this.incentiveEquipMatEntryForm.controls['entryRows'].value[0].Cost);
    const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRows');
    var rowVal;
    controlArray.controls.forEach(function(e) {
      rowVal = e.value;
    });
    this.cost = parseInt(rowVal.Cost);
    //console.log(this.cost);
    this.calculateTotal(val,i)
  }

  calculateTotal(val:any,i:number) {
    let totalEquipMatCalc = this.total = (this.quantity * this.cost);
    //this.incentiveEquipMatEntryForm.controls.entryRows['Total'].patchValue(totalEquipMatCalc);

    this.totalEquipMatCalc = totalEquipMatCalc.toString();
    localStorage.setItem('totalEquipMatCalc', this.totalEquipMatCalc);

    const getItemID = this.incentiveEquipMatEntryForm.controls['entryRows'].value.forEach(element => {
      const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRows');
      controlArray.at(i).get('Total').setValue(this.totalEquipMatCalc);
    })
    // const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRows');
    // controlArray.controls[0].get('Total').setValue(this.totalEquipMatCalc);
  }

}
