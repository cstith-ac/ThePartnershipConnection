import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ListMaterialItems } from '../../models/listmaterialitems';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { IncentiveDashboard } from '../../models/incentivedashboard';
import { AuthService } from '../../services/auth.service';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Incentive_Add_Recurring } from 'src/app/models/incentiveaddrecurring';
import { Incentive_ADD_Finish } from 'src/app/models/incentiveaddfinish';
import { IncentivedashboardComponent } from '../incentivedashboard/incentivedashboard.component';
import { RouteService } from '../../services/route.service';
import { Incentive_Add_Equipment } from 'src/app/models/incentiveaddequipment';

@Component({
  selector: 'app-incentive-dashboard-test',
  templateUrl: './incentive-dashboard-test.component.html',
  styleUrls: ['./incentive-dashboard-test.component.css']
})
export class IncentiveDashboardTestComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  incentiveEquipMatEntryForm: FormGroup;

  authToken: any;
  user:any=Object;
  userEmailAddress: '';
  placeholder="$0.00";
  equipMatValueChanges$;
  totalSumEquipMat: number = 0;
  totalEquipMatCalc;
  equipmentAndMaterials;
  lineItemSubtotal;
  listMatItems: ListMaterialItems[];
  selectedForCheckBoxAutoInsert:any[];
  installCompanyID = parseInt(localStorage.getItem('installCompanyID'));

  constructor(
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    public fb: FormBuilder,
    private httpService: HttpClient
  ) { }

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('companyName');
      localStorage.removeItem('installCompanyID');
      localStorage.removeItem('partnerCode');
      localStorage.removeItem('totalRecurringCalc');
      localStorage.removeItem('totalEquipMatCalc');
      localStorage.removeItem('totalLaborChargesCalc');
      localStorage.removeItem('invoiceNumber');
      localStorage.removeItem('invoiceDate');
      localStorage.removeItem('invoiceTotal');
      localStorage.removeItem('serviceIncluded');
      localStorage.removeItem('siteName');
      localStorage.removeItem('customerName');
      localStorage.removeItem('signalsTested');
      //this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.routeService.getListMaterialItems().subscribe(
      res => {
        this.listMatItems = res;
      }
    )

    this.selectedForCheckBoxAutoInsert = JSON.parse(localStorage.getItem('checkBoxAutoInsertList'));
    console.log(this.selectedForCheckBoxAutoInsert) //object

    this.routeService.postCheckboxAutoInsertList({
      "CheckBoxStatus1": this.selectedForCheckBoxAutoInsert[0],
      "CheckBoxStatus2": this.selectedForCheckBoxAutoInsert[1],
      "CheckBoxStatus3": this.selectedForCheckBoxAutoInsert[2],
      "CheckBoxStatus4": this.selectedForCheckBoxAutoInsert[3],
      "CheckBoxStatus5": this.selectedForCheckBoxAutoInsert[4],
      "CheckBoxStatus6": this.selectedForCheckBoxAutoInsert[5],
      "CheckBoxStatus7": this.selectedForCheckBoxAutoInsert[6],
      "CheckBoxStatus8": this.selectedForCheckBoxAutoInsert[7],
      "CheckBoxStatus9": this.selectedForCheckBoxAutoInsert[8],
      "CheckBoxStatus10": this.selectedForCheckBoxAutoInsert[9],
      "CheckBoxStatus11": this.selectedForCheckBoxAutoInsert[10],
      "CheckBoxStatus12": this.selectedForCheckBoxAutoInsert[11],
      "CheckBoxStatus13": this.selectedForCheckBoxAutoInsert[12],
      "CheckBoxStatus14": this.selectedForCheckBoxAutoInsert[13],
      "CheckBoxStatus15": this.selectedForCheckBoxAutoInsert[14],
      "CheckBoxStatus16": this.selectedForCheckBoxAutoInsert[15],
      "CheckBoxStatus17": this.selectedForCheckBoxAutoInsert[16],
      "CheckBoxStatus18": this.selectedForCheckBoxAutoInsert[17],
      "CheckBoxStatus19": this.selectedForCheckBoxAutoInsert[18],
      "CheckBoxStatus20": this.selectedForCheckBoxAutoInsert[19],
      "CheckBoxStatus21": this.selectedForCheckBoxAutoInsert[20],
      "CheckBoxStatus22": this.selectedForCheckBoxAutoInsert[21],
      "CheckBoxStatus23": this.selectedForCheckBoxAutoInsert[22],
      "CheckBoxStatus24": this.selectedForCheckBoxAutoInsert[23],
      "CheckBoxStatus25": this.selectedForCheckBoxAutoInsert[24],
      "CheckBoxStatus26": this.selectedForCheckBoxAutoInsert[25],
      "CheckBoxStatus27": this.selectedForCheckBoxAutoInsert[26],
      "CheckBoxStatus28": this.selectedForCheckBoxAutoInsert[27],
      "CheckBoxStatus29": this.selectedForCheckBoxAutoInsert[28],
      "CheckBoxStatus30": this.selectedForCheckBoxAutoInsert[29],
      //"InstallCompanyID": this.installCompanyID
    }).subscribe((data: any[]) => {
      this.incentiveEquipMatEntryForm = this.fb.group({
        entryRowsEquipMat: this.fb.array(data.map(datum => this.generateDatumFormGroup(datum)))
      });

      this.equipMatValueChanges$ = this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].valueChanges;
      this.equipMatValueChanges$.subscribe(
        entryRowsEquipMat => this.updateTotalEquipMat(entryRowsEquipMat)
      );
    });

    this.equipmentAndMaterials = parseInt(localStorage.getItem('totalEquipMatCalc'));
    this.lineItemSubtotal = this.equipmentAndMaterials;
  }

  ngOnChanges(): void {
    // this.equipMatValueChanges$ = this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].valueChanges;
    // this.equipMatValueChanges$.subscribe(
    //   entryRowsEquipMat => this.updateTotalEquipMat(entryRowsEquipMat)
    // );
  }

  private generateDatumFormGroup(datum) {
    return this.fb.group({
      ItemID: this.fb.control(datum.itemID),
      Description: this.fb.control(datum.itemDescription),
      Quantity: this.fb.control( 1),
      Cost: this.fb.control(datum.defaultAmount ),
      Total: this.fb.control(1 * datum.defaultAmount)
    })
  }

  getEquipMatItemName(e:any,i:number) {
    setTimeout(() => {

      const getItemID = this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value.forEach(element => {
        console.log(element, i);

        const result = this.listMatItems.filter(x => x.item_id == element.ItemID);

        console.log(result)
        var string;
        result.forEach(function(e) {
          string = e.itemName.toString();//extract string from returned array
        });
        const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
        controlArray.at(i).get('Description').setValue(string);

      })
      }, 4);
  }

   updateTotalEquipMat(entryRowsEquipMat:any) {
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'];
    this.totalSumEquipMat=0;

    for(let i in entryRowsEquipMat) {
      console.log(i)
      let totalEquipMatCalculation = entryRowsEquipMat[i].Total = (entryRowsEquipMat[i].Quantity * entryRowsEquipMat[i].Cost)
      
      control
      .at(+i)
      .get('Total')
      .setValue(totalEquipMatCalculation,{
        onlySelf:true,
        emitEvent:false
      });
      this.totalSumEquipMat += totalEquipMatCalculation;

      localStorage.setItem('totalEquipMatCalc',this.totalSumEquipMat.toString());
    }
  }

  initEquipMatEntryRow() {
    return this.fb.group({
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      Quantity: ["", Validators.required],
      Cost: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  addNewEquipMatItem():void {
    (<FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat'))
    .push(this.initEquipMatEntryRow());
  }

  removeNewEquipMatItem(i: number) {
    if(i > 0) {
      const control = (<FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat'))
    .removeAt(i);
    }

    if(i == 0) {
      const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlArray.at(i).get('ItemID').setValue('');
      controlArray.at(i).get('Description').setValue('');
      controlArray.at(i).get('Quantity').setValue('');
      controlArray.at(i).get('Cost').setValue('');
      controlArray.at(i).get('Total').setValue('');
    }

    localStorage.removeItem("equipmatentry");
    localStorage.removeItem("totalEquipMatCalc");
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
}
