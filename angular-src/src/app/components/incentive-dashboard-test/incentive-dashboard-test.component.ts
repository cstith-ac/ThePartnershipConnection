import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ListMaterialItems } from '../../models/listmaterialitems';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { CustomerSearchList } from '../../models/customersearchlist';
import { CustomerSearchListSite } from '../../models/customersearchlistsite';
import { CustomerSearchListCentralStation } from 'src/app/models/customersearchlistcentralstation';
import { ListSitesForCustomer } from 'src/app/models/listsitesforcustomer';
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

  selectIncentiveDashboardTestForm: FormGroup;
  incentiveDashboardTestForm: FormGroup;

  customers = [
    {
      "id": 1,
      "name": "Gary Payton"
    },
    {
      "id": 2,
      "name": "Betty White"
    },
    {
      "id": 3,
      "name": "Greg Street"
    },
    {
      "id": 4,
      "name": "Reggie Noble"
    },
    {
      "id": 5,
      "name": "Jose Conseco"
    }
  ];
  sites = [
    {
      "id": 1,
      "name": "Philadelphia, PA"
    },
    {
      "id": 2,
      "name": "Dallas, TX"
    },
    {
      "id": 3,
      "name": "Nashville, TN"
    },
    {
      "id": 4,
      "name": "New Castle, DE"
    },
    {
      "id": 5,
      "name": "Denver, CO"
    }
  ];
  systems = [
    {
      "id": 1,
      "name": "Business"
    },
    {
      "id": 2,
      "name": "Information Technology"
    },
    {
      "id": 3,
      "name": "Operations"
    },
    {
      "id": 4,
      "name": "Community Relations"
    },
    {
      "id": 5,
      "name": "Promotions"
    }
  ]

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
  closeResult = '';
  customerSearchList: CustomerSearchList[];
  customerSearchListSite: CustomerSearchListSite[];
  customerSearchListCentralStation: CustomerSearchListCentralStation[];
  listsitesforcustomer: ListSitesForCustomer[];
  p: number = 1;
  searchValue:string;
  id;
  customer;

  constructor(
    private modalService: NgbModal,
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

    // this.selectIncentiveDashboardTestForm = this.fb.group({
    //   customer: '',
    //   site: '',
    //   system: ''
    // })
    this.incentiveDashboardTestForm = this.fb.group({
      UserEmailAddress: this.userEmailAddress = JSON.parse(localStorage.getItem('user')).email, //@UserEmailAddress
      //CustomerID: this.id, //@CustomerID
      InstallCompanyID: this.installCompanyID = JSON.parse(localStorage.getItem('installCompanyID')),
      CustomerID: ["", Validators.required], //@CustomerID
      CustomerSiteID: ["", Validators.required], //@CustomerSiteID
      CustomerSystemID: [""], //@CustomerSystemID
      SystemTypeID: ["", Validators.required], //@SystemTypeID
      SystemCode: [""],
      NewSystem: [""],
      NewCustomer: [""],
      NewSite: [""],
      AlarmAccount: ["", Validators.required], //@AlarmAccount
      PanelTypeID: ["", Validators.required], //@PanelTypeID
      PanelLocation: [""], //@PanelLocation
      CentralStationID: ["", Validators.required], //@CentralStationID
      AdditionalInfo: [""], //@AdditionalInfo
      InvoiceUpload: [""],
      SiteVisitUpload: [""],
      ContractUpload: [""],
      SubscriberFormUpload: [""],
      OtherDocument1Upload: [""],
      OtherDocument2Upload: [""],
      PartnerInvoiceNumber: ["", Validators.required], //@PartnerInvoiceNumber
      PartnerInvoiceDate: ["", Validators.required], //@PartnerInvoiceDate
      InvoiceTotal: [""],
      //PartnerTaxAmount: this.partnerTaxAmount,
      Recurring: [""],
      EquipmentAndMaterials: [""],
      LaborCharges: [""],
      LineItemSubtotal: [""],
      ContractDate: [""], //@ContractDate
      ContractTerm: [""], //@ContractTerm
      RenewalMonths: [""], //@RenewalMonths
      ServiceIncluded: localStorage.getItem('serviceIncluded'), //@ServiceInclude
      SignalsTested: ["", Validators.required],
      PartnerComments: [""] //@PartnerComments
    });

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
      localStorage.setItem('equipmatentry', JSON.stringify(data));

        let mappedDefaultAmounts = data.map(a => a.defaultAmount);
        console.log(mappedDefaultAmounts);
        //get sum from mappedDefaultAmounts
        let sumMappedDefaultAmounts = mappedDefaultAmounts.reduce(function(a,b) {
          return a + b
        },0)
        console.log(sumMappedDefaultAmounts); // number
        this.totalSumEquipMat = sumMappedDefaultAmounts

        this.equipmentAndMaterials = sumMappedDefaultAmounts

      this.incentiveEquipMatEntryForm = this.fb.group({
        entryRowsEquipMat: this.fb.array(data.map(datum => this.generateDatumFormGroup(datum)))
      });

      console.log(this.incentiveEquipMatEntryForm.get('entryRowsEquipMat').value)

      this.equipMatValueChanges$ = this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].valueChanges;
      this.equipMatValueChanges$.subscribe(
        entryRowsEquipMat => this.updateTotalEquipMat(entryRowsEquipMat)
      );
    });

    this.equipmentAndMaterials = parseInt(localStorage.getItem('totalEquipMatCalc'));
    this.lineItemSubtotal = this.equipmentAndMaterials;
  }

  public selectedCustomer: { name: string, id: number };
  public selectedSite: { name: string, id: number };
  public selectedSystem: { name: string, id: number };

  openSearchCustomerModal(content) {
    //bring up a modal
    this.modalService.open(content, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    });

    this.routeService.getCustomerSearchList().subscribe(
      res => {
        this.customerSearchList = res;
      }
    )
  }

  selectCustomer(customer_id:number,customer_Name:string) {
    console.log('select')

    let selectedCustomerName = customer_Name;
    let selectedCustomerid = customer_id;

    this.customer = selectedCustomerName;
    this.id = selectedCustomerid;

    this.modalService.dismissAll();

    this.routeService.getListSitesForCustomer(this.id).subscribe(
      res => {
        //console.log(res)
        this.listsitesforcustomer = res;

        for(var i = 0; i < this.listsitesforcustomer.length; i++) {
          console.log(this.listsitesforcustomer[i])
        }
      }
    )
  }

  private generateDatumFormGroup(datum) {
    return this.fb.group({
      ItemID: this.fb.control(datum.itemID),
      Description: this.fb.control(datum.itemDescription),
      Quantity: this.fb.control(1),
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

  onCustomerChange(value) {
    console.log(value);
  }

  onSiteChange(value) {
    console.log(value);
  }

  onSystemChange(value) {
    console.log(value);
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
}
