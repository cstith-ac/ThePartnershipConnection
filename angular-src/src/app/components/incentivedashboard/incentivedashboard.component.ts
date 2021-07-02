import { Component, OnInit, OnChanges, OnDestroy, AfterViewChecked, Input, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { IncentiveDashboard } from '../../models/incentivedashboard';
import { IncentiveEntry } from '../../models/incentiveentry';
import { ListPanelTypes } from '../../models/listpaneltypes';
import { ListCentralStations } from '../../models/listcentralstations';
import { ListSitesForCustomer } from 'src/app/models/listsitesforcustomer';
import { ListSystemsForSite } from 'src/app/models/listsystemsforsite';
import { CustomerSearchList } from '../../models/customersearchlist';
import { CustomerSearchListSite } from '../../models/customersearchlistsite';
import { CustomerSearchListCentralStation } from 'src/app/models/customersearchlistcentralstation';
import { ListSystemTypes } from '../../models/listsystemtypes';
import { ListRecurringItems } from 'src/app/models/listrecurringitems';
import { ListMultiples } from 'src/app/models/listmultiples';
import { ListMaterialItems } from '../../models/listmaterialitems';
import { ListLaborItems } from 'src/app/models/listlaboritems';
import { AuthService } from '../../services/auth.service';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { JwtHelperService } from '@auth0/angular-jwt';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Incentive_Add_Recurring } from 'src/app/models/incentiveaddrecurring';
import { Incentive_Add_Equipment } from '../../models/incentiveaddequipment';
import { Incentive_Add_Labor } from '../../models/incentiveaddlabor';
import { Incentive_ADD_Finish } from 'src/app/models/incentiveaddfinish';

@Component({
  selector: 'app-incentivedashboard',
  templateUrl: './incentivedashboard.component.html',
  styleUrls: ['./incentivedashboard.component.css']
})
export class IncentivedashboardComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() incentiveEntryOutput:[];
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild("customerSearchIcon") divCustomerSearchIcon: ElementRef;
  @ViewChild("siteSearchIcon") divSiteSearchIcon: ElementRef;
  @ViewChild("systemSearchIcon") divSystemSearchIcon: ElementRef;
  @ViewChild("invoice") divInvoice: ElementRef;
  @ViewChild("subscriberForm") divSubscriberForm: ElementRef;
  @ViewChild("siteVisit") divSiteVisit: ElementRef;
  @ViewChild("otherDocument1") divOtherDocument1: ElementRef;
  @ViewChild("contract") divContract: ElementRef;
  @ViewChild("otherDocument2") divOtherDocument2: ElementRef;

  baseUrl = environment.baseUrl;

  public value;

  updateRecurringWithJobID;
  updateEquipMatWithJobID;
  updateLaborChargesWithJobID;
  updateRecurringStoredProc;
  updateEquipMatStoredProc;
  updateLaborChargesStoredProc;

  authToken: any;
  user:any=Object;
  userEmailAddress: '';

  companyName;
  partnerCode;
  installCompanyID;

  id;
  customersiteid;
  incentiveEntry: IncentiveEntry[];
  incentivedashboard:any[];
  listpaneltypes: ListPanelTypes[];
  listcentralstations: ListCentralStations[];
  listsitesforcustomer: ListSitesForCustomer[];
  listSystemsForSite: ListSystemsForSite[];
  customerSearchList: CustomerSearchList[];
  customerSearchListSite: CustomerSearchListSite[];
  customerSearchListCentralStation: CustomerSearchListCentralStation[];
  listsystemtypes: ListSystemTypes[];
  incentive_Add_Recurring: Incentive_Add_Recurring[];
  listRecurringItems: ListRecurringItems[];
  listMultiples: ListMultiples[];
  listMatItems: ListMaterialItems[];
  incentive_Add_Equipment: Incentive_Add_Equipment[];
  listLaborItems: ListLaborItems[];
  incentive_Add_Labor: Incentive_Add_Labor[];

  dashboardSelectForLocalStorage = new IncentiveDashboard;

  selectedValue: number;

  p: number = 1;
  searchValue:string;
  searchByCustomer:boolean;
  searchByBillingAddress:boolean;
  isSiteSelectionFirst: boolean = false;
  isSystemSelectionFirst: boolean = false;
  isRemoveDropdown: boolean = true;
  isRemoveSystemDropdown: boolean = true;
  serviceIncluded:'';
  renewalMonths='12';
  customer_Site_id: any;
  // customer_System_id:number;
  customer_System_id:any;
  systemName: string;
  panel_Type_Id: number;
  panelName: string;

  closeResult = '';
  incentiveDashboardForm: FormGroup;
  recurringItemEntryForm: FormGroup;
  incentiveRecurringEntryForm: FormGroup;
  incentiveEquipMatEntryForm: FormGroup;
  incentiveLaborChargesEntryForm: FormGroup;

  rmr: number;
  //passThrough: number;
  passThrough=0;
  multiple: number;
  total: number;
  totalRecurringCalc;
  itemID;
  description;
  quantity: number;
  cost: number;
  //hours: number;
  laborQuantity: number;
  //costPerHour: number;
  laborCost: number;
  totalEquipMatCalc;
  totalLaborChargesCalc;
  placeholder="$0.00";

  customer: string;
  siteName: string;
  customerSiteId: number;
  systemTypeID: string;
  customerSystemId: number;
  alarmAccount: string;
  systemCode: string;
  site: '';
  system: '';
  newSystem: '';
  newCustomer: '';
  newSite: '';
  accountNumber: '';
  // systemType: '';
  panelTypeID: '';
  panelLocation: '';
  centralStationID: '';
  // additionalInfo: '';
  // invoiceUpload: '';
  // siteVisitUpload: '';
  // contractUpload: '';
  // subscriberFormUpload: '';
  // otherDocument1Upload: '';
  // otherDocument2Upload: '';
  customerSiteName;
  invoiceFile;
  subscriberFormFile;
  siteVisitFile;
  otherDocument1File;
  contractFile;
  otherDocument2File;

  invoiceUpload;
  invoiceFileSizeUpload;
  siteVisitUpload;
  siteVisitFileSizeUpload;
  subscriberFormUpload;
  subscriberFormFileSizeUpload;
  otherDocument1Upload;
  otherDocument1FileSizeUpload;
  contractUpload;
  contractFileSizeUpload;
  otherDocument2Upload;
  otherDocument2FileSizeUpload;

  invoiceNumber;
  invoiceDate;
  invoiceTotal;
  partnerTaxAmount=0;
  recurring;
  equipmentAndMaterials;
  laborCharges;
  recurringFromLocalStorage;
  //recurring: '';
  //recurring:number;
  //equipmentAndMaterials: '';
  // laborCharges: '';
  // lineItemSubtotal: '';
  lineItemSubtotal;
  startDate: '';
  // term: '';
  contractTerm;
  renewal;
  // signalsTested: '';
  signalsTested;
  additionalInfo;
  partnerComments;

  customer_id;

  job_id;
  security_level:any = 2;

  file_name;
  subscriber_file_name;
  site_visit_file_name;
  other_Document1_file_name;
  contract_file_name;
  other_Document2_file_name;
  file_size;
  subscriber_file_size;
  site_visit_file_size;
  other_Document1_file_size;
  contract_file_size;
  other_Document2_file_size;
  file_extension;
  subscriber_file_extension;
  site_visit_file_extension;
  contract_file_extension;
  other_Document1_file_extension;

  other_Document2_file_extension;
  myFiles:string [] = [];

  showInvoiceFile: boolean = true;
  showSubscriberFormFile: boolean = true;
  showSiteVisitFile: boolean = true;
  showOtherDocument1File: boolean = true;
  showContractFile: boolean = true;
  showOtherDocument2File: boolean = true;

  columns: string[];
  public mySelection: string[] = [];

  recurringValueChanges$;
  equipMatValueChanges$;
  laborChargesValueChanges$;
  totalSumRecurring: number = 0;
  totalSumEquipMat: number = 0;
  totalSumLaborCharges: number = 0;
  selectedForCheckBoxAutoInsert:string[];
  //selectedForCheckBoxAutoInsert:{};
  selectionsForAutoInsert;

  //temp hard coded Incentive add equip vals
  itemID0:number;
  itemType0:string;
  item_Code0:string;
  itemDescription0:string;
  defaultAmount0:number;

  itemID1:number;
  itemType1:string;
  item_Code1:string;
  itemDescription1:string;
  defaultAmount1:number;

  itemID2:number;
  itemType2:string;
  item_Code2:string;
  itemDescription2:string;
  defaultAmount2:number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private incentiveEntryService: IncentiveEntryService,
    public authService: AuthService,
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private httpService: HttpClient,
    private location: Location
  ) {
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        if(event.navigationTrigger === 'popstate') {
          console.log(event)
          // router.navigate(['/incentive-dashboard'], {replaceUrl:true});
          // location.replaceState('/incentive-dashboard');
        } 
      }
    })
  }
  

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('companyName');
      localStorage.removeItem('installCompanyID');
      localStorage.removeItem('partnerCode');
      localStorage.removeItem('equipmatentry');
      localStorage.removeItem('recurringentry');
      localStorage.removeItem('laborchargesentry');
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
      localStorage.removeItem('checkBoxAutoInsertList');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    this.companyName = localStorage.getItem('companyName');
    this.partnerCode = localStorage.getItem('partnerCode');
    this.installCompanyID = localStorage.getItem('installCompanyID');
    this.invoiceNumber = localStorage.getItem('invoiceNumber');
    this.invoiceDate = localStorage.getItem('invoiceDate');
    this.invoiceTotal = parseInt(localStorage.getItem('invoiceTotal'));

    // //Get Files from local storage if page is refreshed
    this.invoiceFile = localStorage.getItem("invoice");
    this.invoiceUpload = localStorage.getItem("invoiceName");
    this.invoiceFileSizeUpload = localStorage.getItem("fileSize");
    this.subscriberFormUpload = localStorage.getItem("subscriberFormName");
    this.siteVisitUpload = localStorage.getItem("siteVisitName");
    this.otherDocument1Upload = localStorage.getItem("otherDocument1Name");
    this.contractUpload = localStorage.getItem("contractName");
    this.otherDocument2Upload = localStorage.getItem("otherDocument2Name");

    //Hide delete icon if there's no file in localstorage
    if(!this.invoiceUpload) {
      this.showInvoiceFile = false;
    }
    if(!this.subscriberFormUpload) {
      this.showSubscriberFormFile = false;
    }
    if(!this.siteVisitUpload) {
      this.showSiteVisitFile = false;
    }
    if(!this.otherDocument1Upload) {
      this.showOtherDocument1File = false;
    }
    if(!this.contractUpload) {
      this.showContractFile = false;
    }
    if(!this.otherDocument2Upload) {
      this.showOtherDocument2File = false;
    }

    // this.additionalInfo = localStorage.getItem("additionalInfo")
    // this.tax = localStorage.getItem("tax");
    this.contractTerm = localStorage.getItem("contractTerm");
    this.renewal = localStorage.getItem("renewal");
    // this.partnerComments = localStorage.getItem("partnerComments");
    // this.signalsTested = localStorage.getItem("signalsTested");

    // Currently, the data entered in each modal clears if closed
    // Get the object from local storage and re-populate the modal if it is opened again

    this.recurring = parseInt(localStorage.getItem('totalRecurringCalc'));
    this.equipmentAndMaterials = parseInt(localStorage.getItem('totalEquipMatCalc'));
    this.laborCharges = parseInt(localStorage.getItem('totalLaborChargesCalc'));
    this.lineItemSubtotal = this.recurring + this.equipmentAndMaterials + this.laborCharges;
    //this.lineItemSubtotal = this.totalSumRecurring + this.totalSumEquipMat + this.totalSumLaborCharges;
    this.selectedForCheckBoxAutoInsert = JSON.parse(localStorage.getItem('checkBoxAutoInsertList'));
    console.log(this.selectedForCheckBoxAutoInsert) //object 

    //console.log(this.selectedForCheckBoxAutoInsert.values().next().value)

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        //console.log(this.userEmailAddress = JSON.parse(localStorage.getItem('user')).email)
      },
      err => {
        console.log(err)
      }
    )

    this.incentiveRecurringEntryForm = this.fb.group({
      entryRowsRecurring: this.fb.array([this.initEntryRow()])
    });

    this.incentiveEquipMatEntryForm = this.fb.group({
      entryRowsEquipMat: this.fb.array([this.initEquipMatEntryRow()])
    });

    this.incentiveLaborChargesEntryForm = this.fb.group({
      entryRowsLaborCharges: this.fb.array([this.initLaborChargesEntryRow()])
    });

    this.incentiveDashboardForm = this.fb.group({
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
      PartnerTaxAmount: this.partnerTaxAmount,
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

    this.recurringValueChanges$ = this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].valueChanges;
    this.recurringValueChanges$.subscribe(
      entryRowsRecurring => this.updateTotalRecurring(entryRowsRecurring)
    );

    this.equipMatValueChanges$ = this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].valueChanges;
    this.equipMatValueChanges$.subscribe(
      entryRowsEquipMat => this.updateTotalEquipMat(entryRowsEquipMat)
    );

    this.laborChargesValueChanges$ = this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].valueChanges;
    this.laborChargesValueChanges$.subscribe(
      entryRowsLaborCharges => this.updateTotalLaborCharges(entryRowsLaborCharges)
    );

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

    this.routeService.getListMaterialItems().subscribe(
      res => {
        this.listMatItems = res;
      }
    )

    this.routeService.getListLaborItems().subscribe(
      res => {
        this.listLaborItems = res;
      }
    )

    //console.log(this.selectedForCheckBoxAutoInsert[0]);

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
      "InstallCompanyID": this.selectedForCheckBoxAutoInsert[30]
      
  }).subscribe(
      res => {
        console.log(res);
        
        this.selectionsForAutoInsert = res;
        //console.log(typeof(this.selectionsForAutoInsert)) //object
        console.log(this.selectionsForAutoInsert[0].itemID);
        console.log(this.selectionsForAutoInsert[0].itemType);
        console.log(this.selectionsForAutoInsert[0].item_Code);
        console.log(this.selectionsForAutoInsert[0].itemDescription);
        console.log(this.selectionsForAutoInsert[0].defaultAmount);

        if(this.selectionsForAutoInsert[0]) {
          this.itemID0 = this.selectionsForAutoInsert[0].itemID;
          this.itemType0 = this.selectionsForAutoInsert[0].itemType;
          this.item_Code0 = this.selectionsForAutoInsert[0].item_Code;
          this.itemDescription0 = this.selectionsForAutoInsert[0].itemDescription;
          this.defaultAmount0 = this.selectionsForAutoInsert[0].defaultAmount;  
        }
        

        if(this.selectionsForAutoInsert[1]) {
          this.itemID1 = this.selectionsForAutoInsert[1].itemID;
          this.itemType1 = this.selectionsForAutoInsert[1].itemType;
          this.item_Code1 = this.selectionsForAutoInsert[1].item_Code;
          this.itemDescription1 = this.selectionsForAutoInsert[1].itemDescription;
          this.defaultAmount1 = this.selectionsForAutoInsert[1].defaultAmount;          
        }


        if(this.selectionsForAutoInsert[2]) {
          this.itemID2 = this.selectionsForAutoInsert[2].itemID;
          this.itemType2 = this.selectionsForAutoInsert[2].itemType;
          this.item_Code2 = this.selectionsForAutoInsert[2].item_Code;
          this.itemDescription2 = this.selectionsForAutoInsert[2].itemDescription;
          this.defaultAmount2 = this.selectionsForAutoInsert[2].defaultAmount;
        }

        //get key value pairs
        // for(var i in this.selectionsForAutoInsert) {
        //   console.log(this.selectionsForAutoInsert[i].itemID)
        //   console.log(this.selectionsForAutoInsert[i].itemType)
        //   console.log(this.selectionsForAutoInsert[i].item_Code)
        //   console.log(this.selectionsForAutoInsert[i].itemDescription)
        //   console.log(this.selectionsForAutoInsert[i].defaultAmount)
        // }
        
      }
    )

    this.onChanges();
    
    // let deleteme = this.incentiveEntryService.sharedIncentiveRecurringInfo.push(JSON.parse(localStorage.getItem('recurringentry')))

    // console.log(typeof(deleteme))//number??

    // console.log(this.incentiveEntryService.sharedIncentiveRecurringInfo[0]);
    // console.log(typeof(this.incentiveEntryService.sharedIncentiveRecurringInfo[0]))

    this.recurringItemEntryForm = this.fb.group({
      //table => item, description, bill cycle, rmr, pass through, billing starts, add to an existing rmr item, multiple, total
    })

    this.routeService.getListSystemTypes().subscribe(
      res => {
        this.listsystemtypes = res;
      }
    )

    this.routeService.getListPanelTypes().subscribe(
      res => {
        this.listpaneltypes = res;
      }
    )

    this.routeService.getListCentralStations().subscribe(
      res => {
        this.listcentralstations = res;
      }
    )

    // this.routeService.getListSitesForCustomer(107746).subscribe(
    //   res => {
    //     this.listsitesforcustomer = [].concat(res);
    //   }
    // )

    this.routeService.getCustomerSearchList().subscribe(
      res => {
        this.customerSearchList = res;
      }
    )

    this.routeService.getCustomerSearchListSite().subscribe(
      res => {
        this.customerSearchListSite = res;
      }
    )

    this.routeService.getCustomerSearchListCentralStation().subscribe(
      res => {
        this.customerSearchListCentralStation = res;
      }
    )

    // Depending on the Y/N values from entry page, populate dashboard and modals
    setTimeout(() => {
      console.log(this.itemDescription0)
      
      // Equipment and Materials
      // const controlItemIDArray0 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlItemIDArray0.controls[0].get('ItemID').setValue(610);
      const controlItemIDArray0 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlItemIDArray0.controls[0].get('ItemID').setValue(this.itemID0 as number);

      // const controlDescriptionArray0 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlDescriptionArray0.controls[0].get('Description').setValue('Customer Visit');

      const controlDescriptionArray0 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlDescriptionArray0.controls[0].get('Description').setValue(this.itemDescription0);

      const controlQuantityArray0 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlQuantityArray0.controls[0].get('Quantity').setValue(1);

      // const controlCostArray0 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlCostArray0.controls[0].get('Cost').setValue(100);
      const controlCostArray0 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlCostArray0.controls[0].get('Cost').setValue(this.defaultAmount0);

      (<FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat'))
      .push(this.initEquipMatEntryRow());

      // const controlItemIDArray1 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlItemIDArray1.controls[1].get('ItemID').setValue(598);
      const controlItemIDArray1 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlItemIDArray1.controls[1].get('ItemID').setValue(this.itemID1 as number);

      // const controlDescriptionArray1 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlDescriptionArray1.controls[1].get('Description').setValue('Contract Resign');
      const controlDescriptionArray1 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlDescriptionArray1.controls[1].get('Description').setValue(this.itemDescription1);

      const controlQuantityArray1 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlQuantityArray1.controls[1].get('Quantity').setValue(1);

      // const controlCostArray1 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlCostArray1.controls[1].get('Cost').setValue(50);
      const controlCostArray1 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlCostArray1.controls[1].get('Cost').setValue(this.defaultAmount1);

      (<FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat'))
      .push(this.initEquipMatEntryRow());

      // const controlItemIDArray2 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlItemIDArray2.controls[2].get('ItemID').setValue(642);
      const controlItemIDArray2 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlItemIDArray2.controls[2].get('ItemID').setValue(this.itemID2 as number);

      // const controlDescriptionArray2 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlDescriptionArray2.controls[2].get('Description').setValue('3G to LTE upgrade Parts');
      const controlDescriptionArray2 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlDescriptionArray2.controls[2].get('Description').setValue(this.itemDescription2);

      const controlQuantityArray2 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlQuantityArray2.controls[2].get('Quantity').setValue(1);

      // const controlCostArray2 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      // controlCostArray2.controls[2].get('Cost').setValue(125);
      const controlCostArray2 = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
      controlCostArray2.controls[2].get('Cost').setValue(this.defaultAmount2);

      this.lineItemSubtotal = this.totalSumEquipMat;
    },2500)
  }

  onChanges():void {

    // this.incentiveDashboardForm.get('AdditionalInfo').valueChanges.subscribe(val => {
    //   console.log(val);
    // })//let's find a better way to get this value
  }

  ngAfterContentInit():void {
    // let selectedEntryItem = this.listRecurringItems.filter(x => x.item_id == 610);
    // console.log(selectedEntryItem);
    // console.log(this.listRecurringItems)
  }

  ngAfterViewChecked() {
    //If there's a recurring, materials and equipment, and labor total in the service that's available...
    //then display in the total in the recurring, materials and equipment, and labor inputs
    //this.getRecurringFromLocalStorage();

    setTimeout(() => {
      //let selectedEntryItem = this.listRecurringItems.filter(x => x.item_id == 610);
      //console.log(selectedEntryItem);
      
      if(!isNaN(parseFloat(this.recurring))) {
        this.incentiveDashboardForm.controls["Recurring"].setValue(this.recurring);
        this.incentiveDashboardForm.controls["Recurring"].setValue(this.recurring);
        this.incentiveDashboardForm.controls["Recurring"].updateValueAndValidity();

        this.onChanges();
      }

      if(!isNaN(parseFloat(this.equipmentAndMaterials))) {
        this.incentiveDashboardForm.controls["EquipmentAndMaterials"].setValue(this.equipmentAndMaterials);
        this.incentiveDashboardForm.controls["EquipmentAndMaterials"].setValue(this.equipmentAndMaterials);
        this.incentiveDashboardForm.controls["EquipmentAndMaterials"].updateValueAndValidity();
      }

      if(!isNaN(parseFloat(this.laborCharges))) {
        //set valid
        this.incentiveDashboardForm.controls["LaborCharges"].setValidators(null);
        this.incentiveDashboardForm.controls["LaborCharges"].setValue(this.laborCharges);
        this.incentiveDashboardForm.controls["LaborCharges"].updateValueAndValidity();
      }

      if(this.recurring) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring));
      }
      if(this.equipmentAndMaterials) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.equipmentAndMaterials));
      }
      if(this.laborCharges) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.laborCharges));
      }
      if(this.equipmentAndMaterials && this.laborCharges) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.equipmentAndMaterials) + parseInt(this.laborCharges));
      }
      if(this.recurring && this.equipmentAndMaterials) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.equipmentAndMaterials));
      }
      if(this.recurring && this.laborCharges) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.laborCharges));
      }
      if(this.recurring && this.equipmentAndMaterials && this.laborCharges) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(this.recurring + this.equipmentAndMaterials + this.laborCharges);
      }

      // if there's a page refresh, re-populate fields with previously entered values
      this.incentiveDashboardForm.controls["ContractDate"].setValue(localStorage.getItem("contractDate"));
      //this.partnerTaxAmount = parseInt(localStorage.getItem("partnerTaxAmount"));
      //this.incentiveDashboardForm.controls["PartnerTaxAmount"].setValue(localStorage.getItem("partnerTaxAmount"));
      //this.incentiveDashboardForm.controls["ContractTerm"].setValue(localStorage.getItem("contractTerm"));

      // get key/value pairs from localstorage
      // string to object
      // store in variable

      let recurringFromLocalStorage = localStorage.getItem("recurringentry");
      JSON.parse(recurringFromLocalStorage);
      // console.log(recurringFromLocalStorage);

    }, 1000);
  }

  ngOnChanges(){
    console.log('ngOnChange was called from ' + this.activatedRoute.url)
  }
  ngOnDestroy():void {
    console.log('ngOnDestroy was called from: ' + this.activatedRoute.url)
    this.recurringValueChanges$.unsubscribe();
    this.laborChargesValueChanges$.unsubscribe();
    this.equipMatValueChanges$.unsubscribe();
  }

  initEntryRow() {
    return this.fb.group({
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      BillCycle: ["", Validators.required],
      RMR: ["", Validators.required],
      // PassThrough: ["", Validators.required],
      PassThrough: [this.passThrough, Validators.required],
      BillingStartDate: ["", Validators.required],
      Add2Item: [0],
      Multiple: ["", Validators.required],
      Total: ["", Validators.required]
    })
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

  initLaborChargesEntryRow() {
    return this.fb.group({
      ItemID: ["", Validators.required],
      Description: ["", Validators.required],
      Quantity: ["", Validators.required],
      Cost: ["", Validators.required],
      Total: ["", Validators.required]
    })
  }

  private updateTotalRecurring(entryRowsRecurring:any) {
    const control = <FormArray>this.incentiveRecurringEntryForm.controls['entryRowsRecurring'];
    this.totalSumRecurring=0;

    for(let i in entryRowsRecurring) {
      let totalRecurringCalculation = entryRowsRecurring[i].Total = (entryRowsRecurring[i].RMR - entryRowsRecurring[i].PassThrough) * entryRowsRecurring[i].Multiple
      
      control
      .at(+i)
      .get('Total')
      .setValue(totalRecurringCalculation,{
        onlySelf:true,
        emitEvent:false
      });
      this.totalSumRecurring += totalRecurringCalculation;

      localStorage.setItem('totalRecurringCalc',this.totalSumRecurring.toString());
    }
  } 

  private updateTotalLaborCharges(entryRowsLaborCharges:any) {
    const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'];
    this.totalSumLaborCharges=0;

    for(let i in entryRowsLaborCharges) {
      let totalLaborChargesCalculation = entryRowsLaborCharges[i].Total = (entryRowsLaborCharges[i].Quantity * entryRowsLaborCharges[i].Cost)
      
      control
      .at(+i)
      .get('Total')
      .setValue(totalLaborChargesCalculation,{
        onlySelf:true,
        emitEvent:false
      });
      this.totalSumLaborCharges += totalLaborChargesCalculation;

      localStorage.setItem('totalLaborChargesCalc',this.totalSumLaborCharges.toString());
    }
  }

  private updateTotalEquipMat(entryRowsEquipMat:any) {
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'];
    this.totalSumEquipMat=0;

    for(let i in entryRowsEquipMat) {
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

  reset() {
    const result = confirm("Want to delete? This will clear all data entry and you will start at the beginning");

    if(result) {
      localStorage.removeItem('installCompanyID');
      localStorage.removeItem('totalRecurringCalc');
      localStorage.removeItem('totalEquipMatCalc');
      localStorage.removeItem('totalLaborChargesCalc');
      localStorage.removeItem('invoiceDate');
      localStorage.removeItem('invoiceNumber');
      localStorage.removeItem('invoiceTotal');
      localStorage.removeItem('recurringentry');
      localStorage.removeItem('equipmatentry');
      localStorage.removeItem('laborchargesentry');
      localStorage.removeItem('invoiceName');
      localStorage.removeItem('invoiceFileSize');
      localStorage.removeItem('invoice');
      localStorage.removeItem('subscriberForm');
      localStorage.removeItem('subscriberFormName');
      localStorage.removeItem('siteVisit');
      localStorage.removeItem('siteVisitName');
      localStorage.removeItem('otherDocument1');
      localStorage.removeItem('otherDocument1Name');
      localStorage.removeItem('contract');
      localStorage.removeItem('contractName');
      localStorage.removeItem('otherDocument2');
      localStorage.removeItem('otherDocument2Name');
      localStorage.removeItem('contractDate');
      localStorage.removeItem('contractTerm');
      localStorage.removeItem('serviceIncluded');
      localStorage.removeItem('customerId');
      localStorage.removeItem('customerName');
      localStorage.removeItem('customerSiteName');
      localStorage.removeItem('customerSystemInformation');
      localStorage.removeItem('alarmAccount');
      localStorage.removeItem('systemType');
      localStorage.removeItem('panelType');
      localStorage.removeItem('panelLocation');
      localStorage.removeItem('centralStationID');
      localStorage.removeItem('customerSiteId');
      localStorage.removeItem('renewal');
      localStorage.removeItem('partnerTaxAmount');
      localStorage.removeItem('additionalInfo');
      localStorage.removeItem('partnerComments');
      localStorage.removeItem('signalsTested');
      localStorage.removeItem('testObject');

      this.router.navigate(['incentive-entry/']);
    }

  }

  getAdditionalInfo(e){
    let newAdditionalInfo = e.target.value;
    localStorage.setItem("additionalInfo", newAdditionalInfo);
  }

  getPartnerTaxAmount(e) {
    let newPartnerTaxAmount = e.target.value;
    localStorage.setItem("partnerTaxAmount", newPartnerTaxAmount);
  }

  getContractDate(e) {
    let newContractDate = e.target.value;
    localStorage.setItem("contractDate", newContractDate);
  }

  getContractTerm(e) {
    let newContractTerm = e.target.value;
    console.log(newContractTerm);
    localStorage.setItem("contractTerm", newContractTerm);
  }

  getRenewal(e) {
    let newRenewal = e.target.value;
    localStorage.setItem("renewal", newRenewal);
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  //filter cancelled customers or by customerStatus (active or cancel)
  onItemChangeToInclude(value) {
    //console.log("Include cancelled customers: ", value)
    if(value === '0') {
      console.log('filter the table by active customers: ', value)
      //filter the table by active customers
      let cancel = this.customerSearchList.filter(x => x.customerStatus === 'Cancel');
      console.group(cancel);
    }
  }

  onItemChangeToExclude(value) {
    //this is the default selected radio value
    //console.log("Exclude cancelled customers: ", value)
    if(value === '1') {
      //this.searchValue = "Active"
      console.log('filter the table by cancelled customers: ', value)
      //filter the table by cancelled customers
      let active = this.customerSearchList.filter(x => x.customerStatus === 'Active');
      console.log(active);
    }
  }
  //filter inactive sites or by
  //filter inactive systems or by

  onItemChangeToCustomer(value) {
    //this is the default lookup value radio select
    console.log("Customer value is : ", value);
    if(value === 'on') {
      console.log('this value is on')
      //let the customer filter by customer_Name or customer_Number
    }
  }

  onItemChangeToBilling(value) {
    //console.log("Billing value is : ", value);
    if(value === 'on') {
      console.log('this value is on')
      //let the customer filter by Bill Address 1, Bill Address 2, or Bill Phone
    }
  }

  onItemChangeToSite(value) {
    //console.log("Site value is : ", value);
    if(value === 'on') {
      console.log('this value is on')
      //let the customer filter by Site Address 1, Site Address 2, or Site Phone
    }
  }

  onItemChangeToCentralStation(value) {
    //console.log("Central Station value is : ", value);
    if(value === 'on') {
      console.log('this value is on')
      //let the customer filter by Alarm Account
    }
  }

  //select Customer 1st
  selectCustomer(customer_id:number,customer_Name:string) {
    console.log(this.divSiteSearchIcon.nativeElement);
    this.divSiteSearchIcon.nativeElement.style.display='none';
    this.divSystemSearchIcon.nativeElement.style.display='none';

    //If search by customer radio is selected, filter by customer_Number
    //If search by customer radio is selected, filter by customer_Name
    let selectedCustomerName = customer_Name;
    let selectedCustomerid = customer_id;
    //once a customer is selected, push the customer_Name to customer input on Incentive Entry

    this.customer = selectedCustomerName;
    this.id = selectedCustomerid;

    //localStorage.setItem("customerName",this.customer);
    //localStorage.setItem("customerId",this.id);

    //after selecting a customer, close the modal
    this.modalService.dismissAll();

    this.routeService.getListSitesForCustomer(this.id).subscribe(
      res => {
        this.listsitesforcustomer = [].concat(res);

        //get the customer_Site_id
        //this.customer_Site_id = this.listsitesforcustomer[0].customer_Site_id;
        this.customerSiteId = this.listsitesforcustomer[0].customer_Site_id;
        this.customerSiteName = this.listsitesforcustomer[0].siteName;
        //localStorage.setItem("customerSiteName", this.customerSiteName);
        //make a call to getListSystemsForSite
        this.routeService.getListSystemsForSite(this.customerSiteId).subscribe(
          res => {
            //get the customer_System_id
            //console.log(res.customer_System_id);
            this.customerSystemId = res.customer_System_id; //fix for error encountered on 06/23/2021
            //console.log(this.customer_System_id);
            //make a get request to dbo.CustomerSystemInfoGet
            this.routeService.getCustomerSystemInfoGetByID(this.customerSystemId).subscribe(
              res => {

                this.alarmAccount = res.accountNumber;
                this.systemTypeID = res.systemType;
                //get the System_Id
                //make a get request to dbo.ListSystemTypes to find the appropriate system type matching the returned systemType
                this.routeService.getListSystemTypes().subscribe(
                  res => {

                    let result = res.filter(a => a.system_Id===this.systemTypeID)

                    for(var i in result) {

                      this.systemName = result[i].systemName;
                    }
                  }
                )
                //populate the panel type

                //populate the central station
              }
            )
            //populate the fields for Account #, System Type, Panel Type, Panel Location, Central Station
          }
        )
      }
    )

    //this.incentiveDashboardForm.value.CustomerID = this.id;
  }

  //select Site 1st
  selectSite(customer_id:number,customer_Name:string, siteName:string, customer_Site_Id:number) {
    this.divSystemSearchIcon.nativeElement.style.display='none';
    
    let selectedCustomerName = customer_Name;
    let selectedCustomerid = customer_id;
    let selectedSiteName = siteName;
    let selectedCustomerSiteId = customer_Site_Id;

    // console.log(selectedCustomerName)
    // console.log(selectedCustomerid);
    // console.log(selectedSiteName);
    // console.log(selectedCustomerSiteId);
    //push the selectedSiteName to the UI
    //once a site is selected, push the siteName to site on Incentive Entry
    this.id = selectedCustomerid;
    this.customerSiteId = selectedCustomerSiteId;
    this.siteName = selectedSiteName;
    this.customer = selectedCustomerName;

    // localStorage.setItem("siteName", this.siteName);
    // localStorage.setItem("customerName", this.customer);

    this.modalService.dismissAll();

    this.isSiteSelectionFirst = !this.isSiteSelectionFirst;
    this.isRemoveDropdown = !this.isRemoveDropdown;
    //populate customer, populate system
    this.routeService.getListSystemsForSite(selectedCustomerSiteId).subscribe(
      res => {
        // if the site is selected 1st, get the CustomerSystemID.
        // Use the ID for the dbo.CustomerSystemInfoGet API call
        //console.log(res.customer_System_id);
        //this.customer_System_id = res.customer_System_id;
        this.customerSystemId = res.customer_System_id; //fix for error encountered on 06/23/2021

        this.routeService.getCustomerSystemInfoGetByID(this.customerSystemId).subscribe(
          res => {
            //console.log(res);
            this.alarmAccount = res.accountNumber;
            this.centralStationID = res.centralStationID;
            this.panelLocation = res.panelLocation;
            this.panelTypeID = res.panelType;
            this.systemTypeID = res.systemType;
          }
        )

        let alarmAccount = res.alarmAccount;
        let systemTypeID = res.systemType
        // console.log(alarmAccount);
        // console.log(systemType);
        this.isSystemSelectionFirst = !this.isSystemSelectionFirst;
        this.isRemoveSystemDropdown = !this.isRemoveSystemDropdown;
        this.systemCode = alarmAccount + ' - ' + systemTypeID;

        //this.systemType = res.systemType
      }
    )

  }

  //select Central Station 1st
  selectCentralStation(customer_id:number, customer_Site_Id:number, customer_System_Id:number, alarmAccount:string, systemCode: string, customer_Name:string) {
    let selectedCustomerid = customer_id;
    let selectedCustomerSiteId = customer_Site_Id;
    let selectedCustomerSystemId = customer_System_Id;
    let selectedAlarmAccount = alarmAccount;
    let selectedSystemCode = systemCode;
    let selectedCustomerName = customer_Name;

    // console.log(selectedCustomerid)
    // console.log(selectedCustomerSiteId)
    // console.log(selectedCustomerSystemId);
    // console.log(selectedAlarmAccount);
    // console.log(selectedSystemCode);
    // console.log(selectedCustomerName);

    this.id = selectedCustomerid;
    this.customerSystemId = selectedCustomerSystemId;
    this.alarmAccount = selectedAlarmAccount;
    this.systemCode = selectedAlarmAccount+' - '+selectedSystemCode;
    this.customer = selectedCustomerName;

    //localStorage.setItem("customerName", this.customer);
    //localStorage.setItem("customerSystemInformation", this.systemCode)

    this.modalService.dismissAll();

    this.isSystemSelectionFirst = !this.isSystemSelectionFirst;
    this.isRemoveSystemDropdown = !this.isRemoveSystemDropdown;
    this.isSiteSelectionFirst = !this.isSiteSelectionFirst;
    this.isRemoveDropdown = !this.isRemoveDropdown;

    //console.log(this.customerSystemId)

    //populate site, populate customer
    this.routeService.getListSitesForCustomer(selectedCustomerid).subscribe(
      res => {
        //console.log(res.siteName);
        this.siteName = res.siteName
        // this.customer_Site_id = res.customer_Site_id;
        this.customerSiteId = res.customer_Site_id; //fix for error encountered on 06/23/2021
        //localStorage.setItem("customerSiteName",this.siteName);
      }
    )

    this.routeService.getCustomerSystemInfoGetByID(this.customerSystemId).subscribe(
      res => {
        // console.log(res);
        // this.alarmAccount = res.accountNumber;
        // this.centralStationID = res.centralStationID;
        //account number
        this.accountNumber = res.accountNumber;
        this.additionalInfo = res.additionalInfo;
        this.centralStationID = res.centralStationID;
        
        this.panelLocation = res.panelLocation;
        this.panelTypeID = res.panelType;
        this.systemTypeID = res.systemType;
        
        //Store these values in localstorage to retrieve if the page is refreshed
        //localStorage.setItem('alarmAccount', this.alarmAccount);
        //localStorage.setItem('systemType', this.systemType);
        //localStorage.setItem('panelType', this.panelType);
        //localStorage.setItem('panelLocation', this.panelLocation);
        //localStorage.setItem('centralStationID', this.centralStationID);

      }
    )

    // this.routeService.getCustomerSearchListCentralStation().subscribe(
    //   res => {
    //     console.log(typeof(res));
    //     res.
    //     console.log(this.customerSearchListCentralStation)
    //     for(var prop in this.customerSearchListCentralStation) {
    //       this.alarmAccount = this.customerSearchListCentralStation[prop].alarmAccount;
    //     }
    //     console.log(this.alarmAccount)
    //     Object.values(this.customerSearchListCentralStation).forEach(val => {
    //       console.log(val);
    //       Object.values(val).filter(x => x.)
    //     })
    //   }
    // )
  }

  selectSystemsForCustomer(customersiteid:number) {
    this.routeService.getListSystemsForSite(this.customersiteid).subscribe(
      res => {
        //console.log(res)
      }
    )
  }

  selectSitesForCustomer(val: any) {
    this.updateSite(val)
  }

  updateSite(val: any) {
    //console.log('call this')
    //let id = val;
    //console.log(this.id)
    //let id = 117019;
    // append CustomerSiteID to get ListSystemsForSite
    this.routeService.getListSitesForCustomer(this.id).subscribe(
      res => {
        this.listsitesforcustomer = [].concat(res);
        // this.customersiteid = this.listsitesforcustomer.forEach(x => x.customer_Site_id)
        //console.log(this.listsitesforcustomer)
        //console.log(typeof(this.listsitesforcustomer))
        for(var prop in this.listsitesforcustomer) {
          //console.log(prop,this.listsitesforcustomer[prop].customer_Site_id);
          this.customersiteid = this.listsitesforcustomer[prop].customer_Site_id;
          //localStorage.setItem('customerSiteId',this.customersiteid);
          //console.log(this.customersiteid)
          this.routeService.getListSystemsForSite(this.customersiteid).subscribe(
            res => {
              this.listSystemsForSite = [].concat(res);
            }
          )
        }
      }
    )
  }

  selectSiteToSystem(customer_Site_id:number) {
    this.updateSystem(customer_Site_id);
    //console.log(customer_Site_id)
  }

  updateSystem(customer_Site_id:number) {
    //console.log('call update system')
    //get the CustomerSiteID
    this.routeService.getListSystemsForSite(this.customersiteid).subscribe(
      res => {
        this.listSystemsForSite = [].concat(res);
        //console.log(typeof(this.listSystemsForSite))//object
        for(var i = 0; i < this.listSystemsForSite.length; i++) {
          this.customer_System_id = this.listSystemsForSite[i].customer_System_id;
        }

        //the customer is selected 1st
        //now populate the Account # field
        //make a get request to dbo.CustomerSystemInfoGet
        this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
          res => {
            //console.log(res);
            this.accountNumber = res.accountNumber;
            this.additionalInfo = res.additionalInfo;
            this.centralStationID = res.centralStationID;
            
            this.panelLocation = res.panelLocation;
            this.panelTypeID = res.panelType;
            this.systemTypeID = res.systemType;

            this.routeService.getListSystemTypes().subscribe(
              res => {
                //console.log(res)
                let result = res.filter(a => a.system_Id===this.systemTypeID)

                for(var i in result) {
                  this.systemName = result[i].systemName;
                }
              }
            )

            this.routeService.getListPanelTypes().subscribe(
              res => {
                //console.log(res) //object
                let result = res.filter(p => p.panel_Type_Id===this.panel_Type_Id)

                for(var i in result) {
                  this.panelName = result[i].panelName
                  //console.log(this.panelType)
                }
              }
            )

          }
        )
      }
    )

    // setTimeout(() => {
    //   this.incentiveDashboardForm.get('CustomerID').valueChanges.subscribe(val => {
    //     this.dashboardSelectForLocalStorage.customer = val;
    //   })
  
    //   this.incentiveDashboardForm.get('CustomerSiteID').valueChanges.subscribe(val => {
    //     this.dashboardSelectForLocalStorage.site = val;
    //   })
  
    //   this.incentiveDashboardForm.get('CustomerSystemID').valueChanges.subscribe(val => {
    //     this.dashboardSelectForLocalStorage.system = val;
    //   })
  
    //   this.incentiveDashboardForm.get('AlarmAccount').valueChanges.subscribe(val => {
    //     this.dashboardSelectForLocalStorage.accountNumber = val;
    //   })
  
    //   this.incentiveDashboardForm.get('SystemType').valueChanges.subscribe(val => {
    //     this.dashboardSelectForLocalStorage.system = val;
    //   })
  
    //   this.incentiveDashboardForm.get('PanelType').valueChanges.subscribe(val => {
    //     this.dashboardSelectForLocalStorage.panelType = val;
    //   })
  
    //   this.incentiveDashboardForm.get('PanelLocation').valueChanges.subscribe(val => {
    //     this.dashboardSelectForLocalStorage.location = val;
    //   })
  
    //   this.incentiveDashboardForm.get('CentralStationID').valueChanges.subscribe(val => {
    //     this.dashboardSelectForLocalStorage.centralStation
    //     console.log(this.dashboardSelectForLocalStorage);
    //     localStorage.setItem("testObject",JSON.stringify(this.dashboardSelectForLocalStorage))
    //   })
    // }, 4);
  }

  onSubmit(form: FormGroup) {
    //Incentive_ADD_Start
    console.log('@UserEmailAddress :' + form.value.UserEmailAddress) // @UserEmailAddress NVarChar(50),
    console.log('@CustomerID :' + parseInt(this.id)) // @CustomerID Int,
    //console.log(form.value.CustomerID) // @CustomerID Int, Get this instead of the id
    console.log('@CustomerSiteID :' + parseInt(form.value.CustomerSiteID)) // @CustomerSiteID Int,
    console.log('@CustomerSystemID :' + parseInt(form.value.CustomerSystemID)) // @CustomerSystemID Int,
    console.log('@AlarmAccount :' +form.value.AlarmAccount) // @AlarmAccount NVarChar(50),
    console.log('@SystemTypeID :' + parseInt(form.value.SystemTypeID)) // @SystemTypeID Int,
    console.log('@PanelTypeID :' + parseInt(form.value.PanelTypeID)) // @PanelTypeID Int,
    console.log('@PanelLocation :' + form.value.PanelLocation) // @PanelLocation NVarChar(50),
    console.log('@CentralStationID :' + parseInt(form.value.CentralStationID)) // @CentralStationID Int,
    console.log('@AdditionalInfo :' +form.value.AdditionalInfo) // @AdditionalInfo NVarChar(255),
    console.log('@PartnerInvoiceNumber :' + form.value.PartnerInvoiceNumber) // @PartnerInvoiceNumber NVarChar(30),
    console.log('@PartnerInvoiceDate :' + form.value.PartnerInvoiceDate) // @PartnerInvoiceDate DateTime,
    console.log('@ContractDate :' + form.value.ContractDate) // @ContractDate DateTime,
    console.log('@ContractTerm :' + parseInt(form.value.ContractTerm)) // @ContractTerm Int,
    console.log('@RenewalMonths :' + parseInt(this.renewalMonths));
    // console.log(form.value.) // @ServiceIncluded NVarChar(2),
    console.log('@ServiceIncluded :' + form.value.ServiceIncluded);

    console.log('@PartnerComments :' + form.value.PartnerComments) // @PartnerComments NVarChar(1024)

    // //Replaces CustomerID with customer_id from the database instead of the customer_Name
    this.incentiveDashboardForm.controls["CustomerID"].setValue(this.id);
    // this.incentiveDashboardForm.controls['CustomerSystemID'].setValue(this.customer_System_id);
    this.incentiveDashboardForm.controls['CustomerSystemID'].setValue(this.customerSystemId); //fix for error encountered on 06/23/2021
    this.incentiveDashboardForm.controls['SystemTypeID'].setValue(parseInt(form.value.SystemTypeID));
    this.incentiveDashboardForm.controls['PanelTypeID'].setValue(parseInt(form.value.PanelTypeID));
    // this.incentiveDashboardForm.controls['CentralStationID'].setValue(parseInt(form.value.CentralStationID));
    //this.incentiveDashboardForm.controls["ContractTerm"].setValue(0); //this was passing a hard-coded zero value
    // this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id);
    this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customerSiteId);

    // confirm('Click ok to confirm form submission')

    // This gets executed 1st to return the required Job ID for the subsequent HTTP requests
    this.routeService.postIncentiveADDStart(this.incentiveDashboardForm.value).subscribe(
      result => {
        //console.log(result)
        //returns the job id
        this.job_id = result;
        //check if Status of Recurring, Equipment, and/or Labor is invalid
        //if valid, form needs to get passed
        //if invalid, skip to Customer_Document_ADD
        // if(this.incentiveRecurringEntryForm.status==="VALID"){

        // }
        // if(this.incentiveEquipMatEntryForm.status==="VALID"){
          
        // }
        // if(this.incentiveLaborChargesEntryForm.status==="VALID"){
          
        // }
        var addToObject = function (obj, key, value) {
          // Create a temp object and index variable
          var temp = {};
          var i = 0;
          // Loop through the original object
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              // If the indexes match, add the new item
              if (i === key && value) {
                temp[key] = value;
              }
              // Add the current item in the loop to the temp obj
              temp[prop] = obj[prop];
              // Increase the count
              i++;
            }
          }
          // If no index, add to the end
          if (key && value) {
            temp[key] = value;
          }
          return temp;
        };
        var updateRecurringWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveRecurringInfo[0], 'IncentiveID', this.job_id);
        this.routeService.postIncentive_Add_Recurring(updateRecurringWithJobID).subscribe(
          result => {
            console.log(result)
            var updateEquipMatWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveEquipMatInfo[0], 'IncentiveID', this.job_id);
            this.routeService.postIncentive_Add_Equipment(updateEquipMatWithJobID).subscribe(
              result => {
                console.log(result)
                var updateLaborChargesWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveLaborChargesInfo[0], 'IncentiveID', this.job_id);
                this.routeService.postIncentive_Add_Labor(updateLaborChargesWithJobID).subscribe(
                  result => {
                    console.log(result); //this shows a new object with 0 or null values!

                    // if(this.file_name || this.subscriber_file_name || this.site_visit_file_name || this.other_Document1_file_name || this.other_Document2_file_name || this.contract_file_name) {
                    //   for(var i = 0; i < this.myFiles.length; i++) {
                    //     console.log(this.myFiles[i])
                    //     let selectedfile = this.myFiles[i]
                    //     console.log(selectedfile)
                    //   }
                    // }

                    if(this.file_name) {
                      console.log(this.file_name)
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.file_name);
                        frmData.append('file_size', this.file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Invoice');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                        // frmData.append("file_data", this.myFiles[0]);
                        for(var i = 0; i < this.myFiles.length; i++) {
                          console.log(this.myFiles[i])
                          frmData.append("file_data", this.myFiles[i]);
                        }
                        // perform http request for each file
                        //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');

                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.subscriber_file_name) {
                      //console.log(this.myFiles[1])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.subscriber_file_name);
                        frmData.append('file_size', this.subscriber_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Subscriber Form');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[1]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.site_visit_file_name) {
                      console.log(this.myFiles[2])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.site_visit_file_name);
                        frmData.append('file_size', this.site_visit_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Site Visit');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[2]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.other_Document1_file_name) {
                      console.log(this.myFiles[3])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.other_Document1_file_name);
                        frmData.append('file_size', this.other_Document1_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Other Doc1');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[3]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.other_Document2_file_name) {
                      console.log(this.myFiles[4])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.other_Document2_file_name);
                        frmData.append('file_size', this.other_Document2_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Other Doc 2');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[4]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.contract_file_name) {
                      console.log(this.myFiles[5])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.contract_file_name);
                        frmData.append('file_size', this.contract_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Contract');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[5]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                            //return
                          }
                        )
                          console.log(frmData)
                    }
                    var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                    updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                    updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                    updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                    updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                    this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                      result => {
                        console.log('Finished!... ');

                        localStorage.removeItem('installCompanyID');
                        localStorage.removeItem('totalRecurringCalc');
                        localStorage.removeItem('totalEquipMatCalc');
                        localStorage.removeItem('totalLaborChargesCalc');
                        localStorage.removeItem('invoiceDate');
                        localStorage.removeItem('invoiceNumber');
                        localStorage.removeItem('invoiceTotal');
                        localStorage.removeItem('recurringentry');
                        localStorage.removeItem('equipmatentry');
                        localStorage.removeItem('laborchargesentry');
                        localStorage.removeItem('invoiceName');
                        localStorage.removeItem('invoiceFileSize');
                        localStorage.removeItem('invoice');
                        localStorage.removeItem('subscriberForm');
                        localStorage.removeItem('subscriberFormName');
                        localStorage.removeItem('siteVisit');
                        localStorage.removeItem('siteVisitName');
                        localStorage.removeItem('otherDocument1');
                        localStorage.removeItem('otherDocument1Name');
                        localStorage.removeItem('contract');
                        localStorage.removeItem('contractName');
                        localStorage.removeItem('otherDocument2');
                        localStorage.removeItem('otherDocument2Name');
                        localStorage.removeItem('contractDate');
                        localStorage.removeItem('contractTerm');
                        localStorage.removeItem('serviceIncluded');
                        localStorage.removeItem('customerId');
                        localStorage.removeItem('customerName');
                        localStorage.removeItem('customerSiteName');
                        localStorage.removeItem('customerSystemInformation');
                        localStorage.removeItem('alarmAccount');
                        localStorage.removeItem('systemType');
                        localStorage.removeItem('panelType');
                        localStorage.removeItem('panelLocation');
                        localStorage.removeItem('centralStationID');
                        localStorage.removeItem('customerSiteId');
                        localStorage.removeItem('renewal');
                        localStorage.removeItem('partnerTaxAmount');
                        localStorage.removeItem('additionalInfo');
                        localStorage.removeItem('partnerComments');
                        localStorage.removeItem('signalsTested');
                        localStorage.removeItem('testObject');
                        localStorage.removeItem('checkBoxAutoInsertList');

                        this.router.navigate(['incentive-entry/']);
                        //this.incentiveDashboardForm.reset();
                      }
                    )
                    return

                    if(this.file_name) {
                      console.log(this.file_name)
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.file_name);
                        frmData.append('file_size', this.file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Invoice');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                        // frmData.append("file_data", this.myFiles[0]);
                        for(var i = 0; i < this.myFiles.length; i++) {
                          console.log(this.myFiles[i])
                          frmData.append("file_data", this.myFiles[i]);
                        }
                        // perform http request for each file
                        //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');

                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                            //return
                            var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                            updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                            updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                            updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                            updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                            this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                              result => {
                                console.log('Finished!... ');
  
                                localStorage.removeItem('installCompanyID');
                                localStorage.removeItem('totalRecurringCalc');
                                localStorage.removeItem('totalEquipMatCalc');
                                localStorage.removeItem('totalLaborChargesCalc');
                                localStorage.removeItem('invoiceDate');
                                localStorage.removeItem('invoiceNumber');
                                localStorage.removeItem('invoiceTotal');
                                localStorage.removeItem('recurringentry');
                                localStorage.removeItem('equipmatentry');
                                localStorage.removeItem('laborchargesentry');
                                localStorage.removeItem('invoiceName');
                                localStorage.removeItem('invoiceFileSize');
                                localStorage.removeItem('invoice');
                                localStorage.removeItem('subscriberForm');
                                localStorage.removeItem('subscriberFormName');
                                localStorage.removeItem('siteVisit');
                                localStorage.removeItem('siteVisitName');
                                localStorage.removeItem('otherDocument1');
                                localStorage.removeItem('otherDocument1Name');
                                localStorage.removeItem('contract');
                                localStorage.removeItem('contractName');
                                localStorage.removeItem('otherDocument2');
                                localStorage.removeItem('otherDocument2Name');
                                localStorage.removeItem('contractDate');
                                localStorage.removeItem('contractTerm');
                                localStorage.removeItem('serviceIncluded');
                                localStorage.removeItem('customerId');
                                localStorage.removeItem('customerName');
                                localStorage.removeItem('customerSiteName');
                                localStorage.removeItem('customerSystemInformation');
                                localStorage.removeItem('alarmAccount');
                                localStorage.removeItem('systemType');
                                localStorage.removeItem('panelType');
                                localStorage.removeItem('panelLocation');
                                localStorage.removeItem('centralStationID');
                                localStorage.removeItem('customerSiteId');
                                localStorage.removeItem('renewal');
                                localStorage.removeItem('partnerTaxAmount');
                                localStorage.removeItem('additionalInfo');
                                localStorage.removeItem('partnerComments');
                                localStorage.removeItem('signalsTested');
                                localStorage.removeItem('testObject');
  
                                this.router.navigate(['incentive-entry/']);
                                //this.incentiveDashboardForm.reset();
                              }
                            )
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.subscriber_file_name) {
                      //console.log(this.myFiles[1])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.subscriber_file_name);
                        frmData.append('file_size', this.subscriber_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Subscriber Form');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[1]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                            //return
                            var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                            updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                            updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                            updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                            updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                            this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                              result => {
                                console.log('Finished!... ');
  
                                localStorage.removeItem('installCompanyID');
                                localStorage.removeItem('totalRecurringCalc');
                                localStorage.removeItem('totalEquipMatCalc');
                                localStorage.removeItem('totalLaborChargesCalc');
                                localStorage.removeItem('invoiceDate');
                                localStorage.removeItem('invoiceNumber');
                                localStorage.removeItem('invoiceTotal');
                                localStorage.removeItem('recurringentry');
                                localStorage.removeItem('equipmatentry');
                                localStorage.removeItem('laborchargesentry');
                                localStorage.removeItem('invoiceName');
                                localStorage.removeItem('invoiceFileSize');
                                localStorage.removeItem('invoice');
                                localStorage.removeItem('subscriberForm');
                                localStorage.removeItem('subscriberFormName');
                                localStorage.removeItem('siteVisit');
                                localStorage.removeItem('siteVisitName');
                                localStorage.removeItem('otherDocument1');
                                localStorage.removeItem('otherDocument1Name');
                                localStorage.removeItem('contract');
                                localStorage.removeItem('contractName');
                                localStorage.removeItem('otherDocument2');
                                localStorage.removeItem('otherDocument2Name');
                                localStorage.removeItem('contractDate');
                                localStorage.removeItem('contractTerm');
                                localStorage.removeItem('serviceIncluded');
                                localStorage.removeItem('customerId');
                                localStorage.removeItem('customerName');
                                localStorage.removeItem('customerSiteName');
                                localStorage.removeItem('customerSystemInformation');
                                localStorage.removeItem('alarmAccount');
                                localStorage.removeItem('systemType');
                                localStorage.removeItem('panelType');
                                localStorage.removeItem('panelLocation');
                                localStorage.removeItem('centralStationID');
                                localStorage.removeItem('customerSiteId');
                                localStorage.removeItem('renewal');
                                localStorage.removeItem('partnerTaxAmount');
                                localStorage.removeItem('additionalInfo');
                                localStorage.removeItem('partnerComments');
                                localStorage.removeItem('signalsTested');
                                localStorage.removeItem('testObject');
  
                                this.router.navigate(['incentive-entry/']);
                                //this.incentiveDashboardForm.reset();
                              }
                            )
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.site_visit_file_name) {
                      console.log(this.myFiles[2])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.site_visit_file_name);
                        frmData.append('file_size', this.site_visit_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Site Visit');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[2]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                            //return
                            var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                            updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                            updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                            updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                            updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                            this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                              result => {
                                console.log('Finished!... ');
  
                                localStorage.removeItem('installCompanyID');
                                localStorage.removeItem('totalRecurringCalc');
                                localStorage.removeItem('totalEquipMatCalc');
                                localStorage.removeItem('totalLaborChargesCalc');
                                localStorage.removeItem('invoiceDate');
                                localStorage.removeItem('invoiceNumber');
                                localStorage.removeItem('invoiceTotal');
                                localStorage.removeItem('recurringentry');
                                localStorage.removeItem('equipmatentry');
                                localStorage.removeItem('laborchargesentry');
                                localStorage.removeItem('invoiceName');
                                localStorage.removeItem('invoiceFileSize');
                                localStorage.removeItem('invoice');
                                localStorage.removeItem('subscriberForm');
                                localStorage.removeItem('subscriberFormName');
                                localStorage.removeItem('siteVisit');
                                localStorage.removeItem('siteVisitName');
                                localStorage.removeItem('otherDocument1');
                                localStorage.removeItem('otherDocument1Name');
                                localStorage.removeItem('contract');
                                localStorage.removeItem('contractName');
                                localStorage.removeItem('otherDocument2');
                                localStorage.removeItem('otherDocument2Name');
                                localStorage.removeItem('contractDate');
                                localStorage.removeItem('contractTerm');
                                localStorage.removeItem('serviceIncluded');
                                localStorage.removeItem('customerId');
                                localStorage.removeItem('customerName');
                                localStorage.removeItem('customerSiteName');
                                localStorage.removeItem('customerSystemInformation');
                                localStorage.removeItem('alarmAccount');
                                localStorage.removeItem('systemType');
                                localStorage.removeItem('panelType');
                                localStorage.removeItem('panelLocation');
                                localStorage.removeItem('centralStationID');
                                localStorage.removeItem('customerSiteId');
                                localStorage.removeItem('renewal');
                                localStorage.removeItem('partnerTaxAmount');
                                localStorage.removeItem('additionalInfo');
                                localStorage.removeItem('partnerComments');
                                localStorage.removeItem('signalsTested');
                                localStorage.removeItem('testObject');
  
                                this.router.navigate(['incentive-entry/']);
                                //this.incentiveDashboardForm.reset();
                              }
                            )
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.other_Document1_file_name) {
                      console.log(this.myFiles[3])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.other_Document1_file_name);
                        frmData.append('file_size', this.other_Document1_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Other Doc1');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[3]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                            //return
                            var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                            updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                            updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                            updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                            updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                            this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                              result => {
                                console.log('Finished!... ');
  
                                localStorage.removeItem('installCompanyID');
                                localStorage.removeItem('totalRecurringCalc');
                                localStorage.removeItem('totalEquipMatCalc');
                                localStorage.removeItem('totalLaborChargesCalc');
                                localStorage.removeItem('invoiceDate');
                                localStorage.removeItem('invoiceNumber');
                                localStorage.removeItem('invoiceTotal');
                                localStorage.removeItem('recurringentry');
                                localStorage.removeItem('equipmatentry');
                                localStorage.removeItem('laborchargesentry');
                                localStorage.removeItem('invoiceName');
                                localStorage.removeItem('invoiceFileSize');
                                localStorage.removeItem('invoice');
                                localStorage.removeItem('subscriberForm');
                                localStorage.removeItem('subscriberFormName');
                                localStorage.removeItem('siteVisit');
                                localStorage.removeItem('siteVisitName');
                                localStorage.removeItem('otherDocument1');
                                localStorage.removeItem('otherDocument1Name');
                                localStorage.removeItem('contract');
                                localStorage.removeItem('contractName');
                                localStorage.removeItem('otherDocument2');
                                localStorage.removeItem('otherDocument2Name');
                                localStorage.removeItem('contractDate');
                                localStorage.removeItem('contractTerm');
                                localStorage.removeItem('serviceIncluded');
                                localStorage.removeItem('customerId');
                                localStorage.removeItem('customerName');
                                localStorage.removeItem('customerSiteName');
                                localStorage.removeItem('customerSystemInformation');
                                localStorage.removeItem('alarmAccount');
                                localStorage.removeItem('systemType');
                                localStorage.removeItem('panelType');
                                localStorage.removeItem('panelLocation');
                                localStorage.removeItem('centralStationID');
                                localStorage.removeItem('customerSiteId');
                                localStorage.removeItem('renewal');
                                localStorage.removeItem('partnerTaxAmount');
                                localStorage.removeItem('additionalInfo');
                                localStorage.removeItem('partnerComments');
                                localStorage.removeItem('signalsTested');
                                localStorage.removeItem('testObject');
  
                                this.router.navigate(['incentive-entry/']);
                                //this.incentiveDashboardForm.reset();
                              }
                            )
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.other_Document2_file_name) {
                      console.log(this.myFiles[4])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.other_Document2_file_name);
                        frmData.append('file_size', this.other_Document2_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Other Doc 2');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[4]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                            //return
                            var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                            updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                            updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                            updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                            updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                            this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                              result => {
                                console.log('Finished!... ');
  
                                localStorage.removeItem('installCompanyID');
                                localStorage.removeItem('totalRecurringCalc');
                                localStorage.removeItem('totalEquipMatCalc');
                                localStorage.removeItem('totalLaborChargesCalc');
                                localStorage.removeItem('invoiceDate');
                                localStorage.removeItem('invoiceNumber');
                                localStorage.removeItem('invoiceTotal');
                                localStorage.removeItem('recurringentry');
                                localStorage.removeItem('equipmatentry');
                                localStorage.removeItem('laborchargesentry');
                                localStorage.removeItem('invoiceName');
                                localStorage.removeItem('invoiceFileSize');
                                localStorage.removeItem('invoice');
                                localStorage.removeItem('subscriberForm');
                                localStorage.removeItem('subscriberFormName');
                                localStorage.removeItem('siteVisit');
                                localStorage.removeItem('siteVisitName');
                                localStorage.removeItem('otherDocument1');
                                localStorage.removeItem('otherDocument1Name');
                                localStorage.removeItem('contract');
                                localStorage.removeItem('contractName');
                                localStorage.removeItem('otherDocument2');
                                localStorage.removeItem('otherDocument2Name');
                                localStorage.removeItem('contractDate');
                                localStorage.removeItem('contractTerm');
                                localStorage.removeItem('serviceIncluded');
                                localStorage.removeItem('customerId');
                                localStorage.removeItem('customerName');
                                localStorage.removeItem('customerSiteName');
                                localStorage.removeItem('customerSystemInformation');
                                localStorage.removeItem('alarmAccount');
                                localStorage.removeItem('systemType');
                                localStorage.removeItem('panelType');
                                localStorage.removeItem('panelLocation');
                                localStorage.removeItem('centralStationID');
                                localStorage.removeItem('customerSiteId');
                                localStorage.removeItem('renewal');
                                localStorage.removeItem('partnerTaxAmount');
                                localStorage.removeItem('additionalInfo');
                                localStorage.removeItem('partnerComments');
                                localStorage.removeItem('signalsTested');
                                localStorage.removeItem('testObject');
  
                                this.router.navigate(['incentive-entry/']);
                                //this.incentiveDashboardForm.reset();
                              }
                            )
                          }
                        )
                          console.log(frmData)
                    }
                    if(this.contract_file_name) {
                      console.log(this.myFiles[5])
                        let frmData = new FormData();
  
                        // 37 = Sandbox, 6 = Production
                        frmData.append('company_id','37');
  
                        // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                        frmData.append('customer_id', this.id);
  
                        frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                        //frmData.append('customer_site_id',this.customerSiteId);
                        
                        frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                        //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                        frmData.append('job_id', this.job_id);
                        //frmData.append('job_id', '19');
                        frmData.append('security_level', this.security_level);
  
                        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                        frmData.append('file_name', this.contract_file_name);
                        frmData.append('file_size', this.contract_file_size);
                        frmData.append('upload_date', this.invoiceDate);
                        frmData.append('document_ext', '*Contracts');
                        frmData.append('user_code', 'PPC');
                        //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                        frmData.append('user_description', 'Contract');
                        frmData.append('reference1', null);
                        frmData.append('reference2', null);
                        frmData.append('reference3', null);
                        frmData.append('reference4', null);
                          // frmData.append("file_data", this.myFiles[5]);
                          for(var i = 0; i < this.myFiles.length; i++) {
                            console.log(this.myFiles[i])
                            frmData.append("file_data", this.myFiles[i]);
                          }
                          // perform http request for each file
                          //frmData.append('@file_data', this.myFiles[i]);
                        frmData.append('document_id', '1');
  
                        console.log(this.job_id)
                        // Display the key/value pairs
                        console.log(Object.entries(frmData));//returns an empty array!
                        var options = {content: frmData};
  
                        console.log(frmData);
                        console.log(this.job_id);
                        const headers = new HttpHeaders();
                        headers.append('Content-Type', 'multipart/form-data');
                        headers.append('Authorization','Bearer ' + this.loadToken());
                        headers.append('Accept', 'application/json');
                        this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                          headers: headers,
                          responseType: 'text'
                        }).subscribe(
                          data => {
                            console.log(data);
                            //return
                            var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                            updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                            updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                            updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                            updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                            this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                              result => {
                                console.log('Finished!... ');
  
                                localStorage.removeItem('installCompanyID');
                                localStorage.removeItem('totalRecurringCalc');
                                localStorage.removeItem('totalEquipMatCalc');
                                localStorage.removeItem('totalLaborChargesCalc');
                                localStorage.removeItem('invoiceDate');
                                localStorage.removeItem('invoiceNumber');
                                localStorage.removeItem('invoiceTotal');
                                localStorage.removeItem('recurringentry');
                                localStorage.removeItem('equipmatentry');
                                localStorage.removeItem('laborchargesentry');
                                localStorage.removeItem('invoiceName');
                                localStorage.removeItem('invoiceFileSize');
                                localStorage.removeItem('invoice');
                                localStorage.removeItem('subscriberForm');
                                localStorage.removeItem('subscriberFormName');
                                localStorage.removeItem('siteVisit');
                                localStorage.removeItem('siteVisitName');
                                localStorage.removeItem('otherDocument1');
                                localStorage.removeItem('otherDocument1Name');
                                localStorage.removeItem('contract');
                                localStorage.removeItem('contractName');
                                localStorage.removeItem('otherDocument2');
                                localStorage.removeItem('otherDocument2Name');
                                localStorage.removeItem('contractDate');
                                localStorage.removeItem('contractTerm');
                                localStorage.removeItem('serviceIncluded');
                                localStorage.removeItem('customerId');
                                localStorage.removeItem('customerName');
                                localStorage.removeItem('customerSiteName');
                                localStorage.removeItem('customerSystemInformation');
                                localStorage.removeItem('alarmAccount');
                                localStorage.removeItem('systemType');
                                localStorage.removeItem('panelType');
                                localStorage.removeItem('panelLocation');
                                localStorage.removeItem('centralStationID');
                                localStorage.removeItem('customerSiteId');
                                localStorage.removeItem('renewal');
                                localStorage.removeItem('partnerTaxAmount');
                                localStorage.removeItem('additionalInfo');
                                localStorage.removeItem('partnerComments');
                                localStorage.removeItem('signalsTested');
                                localStorage.removeItem('testObject');
  
                                this.router.navigate(['incentive-entry/']);
                                //this.incentiveDashboardForm.reset();
                              }
                            )
                          }
                        )
                          console.log(frmData)
                    }
                    // if(this.myFiles[6]) {
                    //   console.log(this.myFiles[6])
                    //     let frmData = new FormData();
  
                    //     // 37 = Sandbox, 6 = Production
                    //     frmData.append('company_id','37');
  
                    //     // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                    //     frmData.append('customer_id', this.id);
  
                    //     frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                    //     //frmData.append('customer_site_id',this.customerSiteId);
                        
                    //     frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                    //     //frmData.append('customer_system_id', this.customerSystemId.toString());
  
                    //     frmData.append('job_id', this.job_id);
                    //     //frmData.append('job_id', '19');
                    //     frmData.append('security_level', this.security_level);
  
                    //     //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                    //     frmData.append('file_name', this.other_Document2_file_name);
                    //     frmData.append('file_size', this.other_Document2_file_size);
                    //     frmData.append('upload_date', this.invoiceDate);
                    //     frmData.append('document_ext', '*Contracts');
                    //     frmData.append('user_code', 'PPC');
                    //     //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                    //     frmData.append('user_description', 'Invoice');
                    //     frmData.append('reference1', null);
                    //     frmData.append('reference2', null);
                    //     frmData.append('reference3', null);
                    //     frmData.append('reference4', null);
                    //       frmData.append("file_data", this.myFiles[6]);
                    //       // perform http request for each file
                    //       //frmData.append('@file_data', this.myFiles[i]);
                    //     frmData.append('document_id', '1');
  
                    //     console.log(this.job_id)
                    //     // Display the key/value pairs
                    //     console.log(Object.entries(frmData));//returns an empty array!
                    //     var options = {content: frmData};
  
                    //     console.log(frmData);
                    //     console.log(this.job_id);
                    //     const headers = new HttpHeaders();
                    //     headers.append('Content-Type', 'multipart/form-data');
                    //     headers.append('Authorization','Bearer ' + this.loadToken());
                    //     headers.append('Accept', 'application/json');
                    //     this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                    //       headers: headers,
                    //       responseType: 'text'
                    //     }).subscribe(
                    //       data => {
                    //         console.log(data);
                    //         //return
                    //         var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                    //         updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                    //         updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                    //         updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                    //         updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                    //         this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                    //           result => {
                    //             console.log('Finished!... ');
  
                    //             localStorage.removeItem('installCompanyID');
                    //             localStorage.removeItem('totalRecurringCalc');
                    //             localStorage.removeItem('totalEquipMatCalc');
                    //             localStorage.removeItem('totalLaborChargesCalc');
                    //             localStorage.removeItem('invoiceDate');
                    //             localStorage.removeItem('invoiceNumber');
                    //             localStorage.removeItem('invoiceTotal');
                    //             localStorage.removeItem('recurringentry');
                    //             localStorage.removeItem('equipmatentry');
                    //             localStorage.removeItem('laborchargesentry');
                    //             localStorage.removeItem('invoiceName');
                    //             localStorage.removeItem('invoiceFileSize');
                    //             localStorage.removeItem('invoice');
                    //             localStorage.removeItem('subscriberForm');
                    //             localStorage.removeItem('subscriberFormName');
                    //             localStorage.removeItem('siteVisit');
                    //             localStorage.removeItem('siteVisitName');
                    //             localStorage.removeItem('otherDocument1');
                    //             localStorage.removeItem('otherDocument1Name');
                    //             localStorage.removeItem('contract');
                    //             localStorage.removeItem('contractName');
                    //             localStorage.removeItem('otherDocument2');
                    //             localStorage.removeItem('otherDocument2Name');
                    //             localStorage.removeItem('contractDate');
                    //             localStorage.removeItem('contractTerm');
                    //             localStorage.removeItem('serviceIncluded');
                    //             localStorage.removeItem('customerId');
                    //             localStorage.removeItem('customerName');
                    //             localStorage.removeItem('customerSiteName');
                    //             localStorage.removeItem('customerSystemInformation');
                    //             localStorage.removeItem('alarmAccount');
                    //             localStorage.removeItem('systemType');
                    //             localStorage.removeItem('panelType');
                    //             localStorage.removeItem('panelLocation');
                    //             localStorage.removeItem('centralStationID');
                    //             localStorage.removeItem('customerSiteId');
                    //             localStorage.removeItem('renewal');
                    //             localStorage.removeItem('partnerTaxAmount');
                    //             localStorage.removeItem('additionalInfo');
                    //             localStorage.removeItem('partnerComments');
                    //             localStorage.removeItem('signalsTested');
                    //             localStorage.removeItem('testObject');
  
                    //             this.router.navigate(['incentive-entry/']);
                    //             //this.incentiveDashboardForm.reset();
                    //           }
                    //         )
                    //       }
                    //     )
                    //       console.log(frmData)
                    // }

                    //return

                    // for (var i = 0; i < this.myFiles.length; i++) {
                    //   let frmData = new FormData();

                    //   // 37 = Sandbox, 6 = Production
                    //   frmData.append('company_id','37');

                    //   // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
                    //   frmData.append('customer_id', this.id);

                    //   frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
                    //   //frmData.append('customer_site_id',this.customerSiteId);
                      
                    //   frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
                    //   //frmData.append('customer_system_id', this.customerSystemId.toString());

                    //   frmData.append('job_id', this.job_id);
                    //   //frmData.append('job_id', '19');
                    //   frmData.append('security_level', this.security_level);

                    //   //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
                    //   frmData.append('file_name', this.file_name);
                    //   frmData.append('file_size', this.file_size);
                    //   frmData.append('upload_date', this.invoiceDate);
                    //   frmData.append('document_ext', '*Contracts');
                    //   frmData.append('user_code', 'PPC');
                    //   //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
                    //   frmData.append('user_description', 'Invoice');
                    //   frmData.append('reference1', null);
                    //   frmData.append('reference2', null);
                    //   frmData.append('reference3', null);
                    //   frmData.append('reference4', null);
                    //     frmData.append("file_data", this.myFiles[i]);
                    //     // perform http request for each file
                    //     //frmData.append('@file_data', this.myFiles[i]);
                    //   frmData.append('document_id', '1');

                    //   console.log(this.job_id)
                    //   // Display the key/value pairs
                    //   console.log(Object.entries(frmData));//returns an empty array!
                    //   var options = {content: frmData};

                    //   console.log(frmData);
                    //   console.log(this.job_id);
                    //   const headers = new HttpHeaders();
                    //   headers.append('Content-Type', 'multipart/form-data');
                    //   headers.append('Authorization','Bearer ' + this.loadToken());
                    //   headers.append('Accept', 'application/json');
                    //   this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                    //     headers: headers,
                    //     responseType: 'text'
                    //   }).subscribe(
                    //     data => {
                    //       console.log(data);
                    //       return
                    //       var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                    //       updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                    //       updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                    //       updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                    //       updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                    //       this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                    //         result => {
                    //           console.log('Finished!... ');

                    //           localStorage.removeItem('installCompanyID');
                    //           localStorage.removeItem('totalRecurringCalc');
                    //           localStorage.removeItem('totalEquipMatCalc');
                    //           localStorage.removeItem('totalLaborChargesCalc');
                    //           localStorage.removeItem('invoiceDate');
                    //           localStorage.removeItem('invoiceNumber');
                    //           localStorage.removeItem('invoiceTotal');
                    //           localStorage.removeItem('recurringentry');
                    //           localStorage.removeItem('equipmatentry');
                    //           localStorage.removeItem('laborchargesentry');
                    //           localStorage.removeItem('invoiceName');
                    //           localStorage.removeItem('invoiceFileSize');
                    //           localStorage.removeItem('invoice');
                    //           localStorage.removeItem('subscriberForm');
                    //           localStorage.removeItem('subscriberFormName');
                    //           localStorage.removeItem('siteVisit');
                    //           localStorage.removeItem('siteVisitName');
                    //           localStorage.removeItem('otherDocument1');
                    //           localStorage.removeItem('otherDocument1Name');
                    //           localStorage.removeItem('contract');
                    //           localStorage.removeItem('contractName');
                    //           localStorage.removeItem('otherDocument2');
                    //           localStorage.removeItem('otherDocument2Name');
                    //           localStorage.removeItem('contractDate');
                    //           localStorage.removeItem('contractTerm');
                    //           localStorage.removeItem('serviceIncluded');
                    //           localStorage.removeItem('customerId');
                    //           localStorage.removeItem('customerName');
                    //           localStorage.removeItem('customerSiteName');
                    //           localStorage.removeItem('customerSystemInformation');
                    //           localStorage.removeItem('alarmAccount');
                    //           localStorage.removeItem('systemType');
                    //           localStorage.removeItem('panelType');
                    //           localStorage.removeItem('panelLocation');
                    //           localStorage.removeItem('centralStationID');
                    //           localStorage.removeItem('customerSiteId');
                    //           localStorage.removeItem('renewal');
                    //           localStorage.removeItem('partnerTaxAmount');
                    //           localStorage.removeItem('additionalInfo');
                    //           localStorage.removeItem('partnerComments');
                    //           localStorage.removeItem('signalsTested');
                    //           localStorage.removeItem('testObject');

                    //           this.router.navigate(['incentive-entry/']);
                    //           //this.incentiveDashboardForm.reset();
                    //         }
                    //       )
                    //     }
                    //   )
                    //     console.log(frmData)
                    // }
                    // //frmData.append('@file_data', this.myFiles[i]);
                    // frmData.append('document_id', '1');

                    // console.log(this.job_id)
                    // // Display the key/value pairs
                    // console.log(Object.entries(frmData));//returns an empty array!
                    // var options = {content: frmData};

                    // console.log(frmData);
                    // console.log(this.job_id);
                    // const headers = new HttpHeaders();
                    // headers.append('Content-Type', 'multipart/form-data');
                    // headers.append('Authorization','Bearer ' + this.loadToken());
                    // headers.append('Accept', 'application/json');
                    // this.httpService.post(this.baseUrl + "/api/Customer_Document_ADD", frmData, {
                    //   headers: headers,
                    //   responseType: 'text'
                    // }).subscribe(
                    //   data => {
                    //     console.log(data);
                    //     var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
                    //     updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
                    //     updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
                    //     updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
                    //     updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
                    //     this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
                    //       result => {
                    //         console.log('Finished!... ');

                    //         localStorage.removeItem('installCompanyID');
                    //         localStorage.removeItem('totalRecurringCalc');
                    //         localStorage.removeItem('totalEquipMatCalc');
                    //         localStorage.removeItem('totalLaborChargesCalc');
                    //         localStorage.removeItem('invoiceDate');
                    //         localStorage.removeItem('invoiceNumber');
                    //         localStorage.removeItem('invoiceTotal');
                    //         localStorage.removeItem('recurringentry');
                    //         localStorage.removeItem('equipmatentry');
                    //         localStorage.removeItem('laborchargesentry');
                    //         localStorage.removeItem('invoiceName');
                    //         localStorage.removeItem('invoiceFileSize');
                    //         localStorage.removeItem('invoice');
                    //         localStorage.removeItem('subscriberForm');
                    //         localStorage.removeItem('subscriberFormName');
                    //         localStorage.removeItem('siteVisit');
                    //         localStorage.removeItem('siteVisitName');
                    //         localStorage.removeItem('otherDocument1');
                    //         localStorage.removeItem('otherDocument1Name');
                    //         localStorage.removeItem('contract');
                    //         localStorage.removeItem('contractName');
                    //         localStorage.removeItem('otherDocument2');
                    //         localStorage.removeItem('otherDocument2Name');
                    //         localStorage.removeItem('contractDate');
                    //         localStorage.removeItem('contractTerm');
                    //         localStorage.removeItem('serviceIncluded');
                    //         localStorage.removeItem('customerId');
                    //         localStorage.removeItem('customerName');
                    //         localStorage.removeItem('customerSiteName');
                    //         localStorage.removeItem('customerSystemInformation');
                    //         localStorage.removeItem('alarmAccount');
                    //         localStorage.removeItem('systemType');
                    //         localStorage.removeItem('panelType');
                    //         localStorage.removeItem('panelLocation');
                    //         localStorage.removeItem('centralStationID');
                    //         localStorage.removeItem('customerSiteId');
                    //         localStorage.removeItem('renewal');
                    //         localStorage.removeItem('partnerTaxAmount');
                    //         localStorage.removeItem('additionalInfo');
                    //         localStorage.removeItem('partnerComments');
                    //         localStorage.removeItem('signalsTested');
                    //         localStorage.removeItem('testObject');

                    //         this.router.navigate(['incentive-entry/']);
                    //         //this.incentiveDashboardForm.reset();
                    //       }
                    //     )
                    //   }
                    // )
                  }
                )
              }
            )
          }
        )
      }
    )

    let getRecurringService = Object.assign({}, ...this.incentiveEntryService.sharedIncentiveRecurringInfo);
    let recurringItemID = getRecurringService.ItemID;
    let recurringDescription = getRecurringService.Description;
    let recurringBillCycle = getRecurringService.BillCycle;
    let recurringRMR = getRecurringService.RMR;
    let recurringPassThrough = getRecurringService.PassThrough;
    let recurringBillingStartDate = getRecurringService.BillingStartDate;
    let recurringMultiple = getRecurringService.Multiple;
    let recurringAdd2Item = getRecurringService.Add2Item;
    let recurringTotal = getRecurringService.Total;

    let getEquipMatService = Object.assign({}, ...this.incentiveEntryService.sharedIncentiveEquipMatInfo);
    let equipMatItemID = getEquipMatService.ItemID;
    let equipMatDescription = getEquipMatService.Description;
    let equipMatQuantity = getEquipMatService.Quantity;
    let equipMatCost = getEquipMatService.Cost;

    var addToObject = function (obj, key, value) {

      // Create a temp object and index variable
      var temp = {};
      var i = 0;

      // Loop through the original object
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {

          // If the indexes match, add the new item
          if (i === key && value) {
            temp[key] = value;
          }

          // Add the current item in the loop to the temp obj
          temp[prop] = obj[prop];

          // Increase the count
          i++;

        }
      }

      // If no index, add to the end
      if (key && value) {
        temp[key] = value;
      }

      return temp;

    };

    //check localstorage for the key recurringentry
    if(localStorage.getItem("recurringentry")) {
      console.log('there is a recurringentry item in localstorage')
      this.recurringFromLocalStorage = JSON.parse(localStorage.getItem("recurringentry"));
      console.log(this.recurringFromLocalStorage);
    }
    if(!localStorage.getItem("recurringentry")) {
      console.log('there is not a recurringentry item in localstorage')
      this.recurringFromLocalStorage = [];
      console.log(this.recurringFromLocalStorage);
    }

    // var updateRecurringWithJobID = addToObject({"ItemID":335,
    // "Description":"test",
    // "BillCycle":"monthly",
    // "RMR":"4",
    // "PassThrough":"2",
    // "BillingStartDate":"2021-05-13",
    // "Add2Item":1,
    // "Multiple":25,
    // "Total":"50"}, 'IncentiveID', 19);

    // if(this.incentiveEntryService.sharedIncentiveRecurringInfo[0] === []) {
    //   var updateRecurringWithJobID = addToObject(this.recurringFromLocalStorage, 'IncentiveID', 19);
    // } else {
    //   var updateRecurringWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveRecurringInfo[0], 'IncentiveID', 19);
    // }
    //if there is an item in localstorage, get this...
    // var updateRecurringWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveRecurringInfo[0], 'IncentiveID', 19);
    var updateRecurringWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveRecurringInfo[0], 'IncentiveID', this.job_id);
    //console.log(updateRecurringWithJobID)//object includes jobid

    // var updateEquipMatWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveEquipMatInfo[0], 'IncentiveID', 19);
    var updateEquipMatWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveEquipMatInfo[0], 'IncentiveID', this.job_id);
    //console.log(updateEquipMatWithJobID)//object includes jobid

    // var updateLaborChargesWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveLaborChargesInfo[0], 'IncentiveID', 19);
    var updateLaborChargesWithJobID = addToObject(this.incentiveEntryService.sharedIncentiveLaborChargesInfo[0], 'IncentiveID', this.job_id);
    //console.log(updateLaborChargesWithJobID)//object includes jobid

    var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
    // updateIncentiveAddFinishWithJobID.incentiveID = 19;
    updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
    updateIncentiveAddFinishWithJobID.partnerTaxAmount = 19;
    // updateIncentiveAddFinishWithJobID.serviceChecked = 'y';
    // updateIncentiveAddFinishWithJobID.serviceChecked = this.serviceIncluded;
    updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
    updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
    console.log(updateIncentiveAddFinishWithJobID)//pass this to the request

    this.updateRecurringStoredProc = {
      ...this.updateRecurringWithJobID
    }
    this.updateEquipMatStoredProc = {
      ...this.updateEquipMatWithJobID
    }
    this.updateLaborChargesStoredProc = {
      ...this.updateLaborChargesWithJobID
    }
    //console.log(this.incentiveEntryService.sharedIncentiveRecurringInfo[0]);
    //console.log(this.updateRecurringStoredProc)

    // this.routeService.postIncentive_Add_Recurring(updateRecurringWithJobID).subscribe(
    //   result => {
    //     console.log(result)
    //   },
    //   error => console.log('error: ', error)
    // )

    // this.routeService.postIncentive_Add_Equipment(updateEquipMatWithJobID).subscribe(
    //   result => {
    //     console.log(result)
    //   },
    //   error => console.log('error: ', error)
    // )

    // this.routeService.postIncentive_Add_Labor(updateLaborChargesWithJobID).subscribe(
    //   result => {
    //     console.log(result)
    //   },
    //   error => console.log('error: ', error)
    // )

    // this.routeService.postCustomerDocumentADD(this.incentiveDashboardForm.value).subscribe(
    //   result => {
    //     console.log(result)
    //   }
    // )

    // this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).subscribe(
    //   result => {
    //     console.log(result)
    //   }
    // )

    //Start of the Document Add. Append required parameters to the frmData
    // let frmData = new FormData();

    // //37 = Sandbox, 6 = Production
    // frmData.append('company_id','37');

    // // frmData.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
    // frmData.append('customer_id', this.id);

    // frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);

    //  frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
    // //frmData.append('customer_system_id', this.customerSystemId.toString());

    // frmData.append('@job_id', this.job_id);
    // //frmData.append('job_id', '19');
    // frmData.append('security_level', this.security_level);

    // //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
    // frmData.append('file_name', this.file_name);
    // frmData.append('file_size', this.file_size);
    // frmData.append('upload_date', this.invoiceDate);
    // frmData.append('document_ext', '*Contracts');
    // frmData.append('user_code', 'PPC');
    // //frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
    // frmData.append('user_description', 'Invoice');
    // frmData.append('reference1', null);
    // frmData.append('reference2', null);
    // frmData.append('reference3', null);
    // frmData.append('reference4', null);
    // // frmData.append('@file_data', this.myFiles[i]);
    // // frmData.append('@document_id', '1');

    // for (var i = 0; i < this.myFiles.length; i++) {
    //   frmData.append("file_data", this.myFiles[i]);
    //   console.log(frmData)
    // }
    // //frmData.append('@file_data', this.myFiles[i]);
    // frmData.append('document_id', '1');

    // console.log(this.job_id)
    // // Display the key/value pairs
    // console.log(Object.entries(frmData));//returns an empty array!
    // var options = {content: frmData};

    //submit this after the job id is returned
    // const httpOptions = {
    //   headers: new HttpHeaders(
    //       {
    //         //'Content-Type': 'application/json',
    //         'Content-Type': 'multipart/form-data',
    //         'Referer': 'http://localhost:4200',
    //         'Origin': 'http://localhost:4200',
    //         'Accept': 'application/json',
    //         //'Accept': '*/*',
    //         'Authorization':'Bearer '+ this.loadToken()
    //       }
    //     )
    //     //,responseType: 'text' as const
    //     //.set('content-type','application/json').set('content-length','6')
    // };

    return
    // const headers = new HttpHeaders();
    // headers.append('Content-Type','multipart/form-data');
    // headers.append('Authorization','Bearer '+ this.loadToken());
    // headers.append('Accept', 'application/json');
    // this.httpService.post("http://localhost:63052/api/Customer_Document_ADD", frmData, {
    //   headers:headers,
    //   responseType: 'text'
    // }).subscribe(
    //   data => {
    //     debugger
    //     console.log(data);
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log(err.message); //Show error, if any
    //   }
    // )
  }

  //Test Invoice file upload
  getFileDetails(e) {
    //console.log(e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      console.log(e.target.files[i]);

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        //console.log(reader.result);
        localStorage.setItem("invoice", reader.result as string);
        this.showInvoiceFile = true;
      });

      reader.readAsDataURL(e.target.files[i]);

      //get the file name
      this.file_name = e.target.files[i].name;
      //this.file_name = 'invoice';
      localStorage.setItem('invoiceName',this.file_name);
      //this.divInvoice.nativeElement.innerHTML = this.file_name;
      //get the file size
      this.file_size = e.target.files[i].size;
      this.file_extension = this.file_name.split('.').pop();// Get the file extension but not currently used
      console.log(this.file_extension);
      console.log(this.file_size);
      localStorage.setItem('invoiceFileSize',this.file_size);
      //this.invoiceDate = e.target.files[i].lastModified;

      this.myFiles.push(e.target.files[i]);
    }
  }

  //Test Subscriber Form file upload
  getSubscriberFileDetails(e) {
    //console.log(e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      console.log(e.target.files[i]);
      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        localStorage.setItem("subscriberForm", reader.result as string);
        this.showSubscriberFormFile = true;
      });

      reader.readAsDataURL(e.target.files[i]);

      //get the file name
      this.subscriber_file_name = e.target.files[i].name;
      //this.subscriber_file_name = 'subscriberForm';
      localStorage.setItem('subscriberFormName', this.subscriber_file_name);
      //this.divSubscriberForm.nativeElement.innerHTML = this.subscriber_file_name;
      //get the file size
      this.subscriber_file_size = e.target.files[i].size;
      console.log(this.subscriber_file_size)
      //this.invoiceDate = e.target.files[i].lastModified;

      this.myFiles.push(e.target.files[i]);
    }
  }

  //Test Site Visit Form file upload
  getSiteVisitFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      console.log(e.target.files[i]);

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        localStorage.setItem("siteVisit", reader.result as string);
        this.showSiteVisitFile = true;
      });

      reader.readAsDataURL(e.target.files[i]);

      //get the file name
      this.site_visit_file_name = e.target.files[i].name;
      //this.site_visit_file_name = 'siteVisit';
      localStorage.setItem('siteVisitName', this.site_visit_file_name);
      //this.divSiteVisit.nativeElement.innerHTML = this.site_visit_file_name;
      //get the file size
      this.site_visit_file_size = e.target.files[i].size;
      //this.invoiceDate = e.target.files[i].lastModified;

      this.myFiles.push(e.target.files[i]);
    }
  }

   //Test Other Document 1 Form file upload
   getOtherDocument1FileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      console.log(e.target.files[i]);

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        localStorage.setItem("otherDocument1", reader.result as string);
        this.showOtherDocument1File = true;
      });

      reader.readAsDataURL(e.target.files[i]);

      //get the file name
      this.other_Document1_file_name = e.target.files[i].name;
      //this.other_Document1_file_name = 'otherDocument1';
      localStorage.setItem('otherDocument1Name', this.other_Document1_file_name);
      //this.divOtherDocument1.nativeElement.innerHTML = this.other_Document1_file_name;
      //get the file size
      this.other_Document1_file_size = e.target.files[i].size;
      //this.invoiceDate = e.target.files[i].lastModified;

      this.myFiles.push(e.target.files[i]);
    }
  }

  //Test Contract Form file upload
  getContractFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      console.log(e.target.files[i]);

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        localStorage.setItem("contract", reader.result as string);
        this.showContractFile = true;
      });

      reader.readAsDataURL(e.target.files[i]);

      //get the file name
      this.contract_file_name = e.target.files[i].name;
      //this.contract_file_name = 'contract';
      localStorage.setItem('contractName', this.contract_file_name);
      //this.divContract.nativeElement.innerHTML = this.contract_file_name;
      //get the file size
      this.contract_file_size = e.target.files[i].size;
      //this.invoiceDate = e.target.files[i].lastModified;

      this.myFiles.push(e.target.files[i]);
    }
  }

  //Test Other Document 2 Form file upload
  getOtherDocument2FileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      console.log(e.target.files[i]);

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        localStorage.setItem("otherDocument2", reader.result as string);
        this.showOtherDocument2File = true;
      });

      reader.readAsDataURL(e.target.files[i]);

      //get the file name
      this.other_Document2_file_name = e.target.files[i].name;
      //this.other_Document2_file_name = 'otherDocument2';
      localStorage.setItem('otherDocument2Name', this.other_Document2_file_name);
      //this.divOtherDocument2.nativeElement.innerHTML = this.other_Document2_file_name;
      //get the file size
      this.other_Document2_file_size = e.target.files[i].size;
      //this.invoiceDate = e.target.files[i].lastModified;

      this.myFiles.push(e.target.files[i]);
    }
  }

  removeInvoiceFile(){
    // console.log('remove this file')
    localStorage.removeItem('invoiceName');
    localStorage.removeItem('invoice');
    this.divInvoice.nativeElement.value = '';
    this.showInvoiceFile = false;
    this.myFiles.pop();
  }

  removeSubscriberFormFile() {
    // console.log('remove this file')
    localStorage.removeItem('subscriberFormName');
    localStorage.removeItem('subscriberForm');
    this.divSubscriberForm.nativeElement.value = '';
    this.showSubscriberFormFile = false;
    this.myFiles.pop();
  }

  removeSiteVisitFile() {
    // console.log('remove this file')
    localStorage.removeItem('siteVisitName');
    localStorage.removeItem('siteVisit');
    this.divSiteVisit.nativeElement.value = '';
    this.showSiteVisitFile = false;
    this.myFiles.pop();
  }

  removeOtherDocument1File() {
    // console.log('remove this file')
    localStorage.removeItem('otherDocument1Name');
    localStorage.removeItem('otherDocument1');
    this.divOtherDocument1.nativeElement.value = '';
    this.showOtherDocument1File = false;
    this.myFiles.pop();
  }

  removeContractFile() {
    // console.log('remove this file')
    localStorage.removeItem('contractName');
    localStorage.removeItem('contract');
    this.divContract.nativeElement.value = '';
    this.showContractFile = false;
    this.myFiles.pop();
  }

  removeOtherDocument2File() {
    // console.log('remove this file')
    localStorage.removeItem('otherDocument2Name');
    localStorage.removeItem('otherDocument2');
    this.divOtherDocument2.nativeElement.value = '';
    this.showOtherDocument2File = false;
    this.myFiles.pop();
  }

  getLineItemSubtotal() {
    console.log('get subtotal')
  }

  onSignalsTested(e) {
    //console.log(e.target.checked);//boolean

    if(e.target.checked == true) {
      this.signalsTested = 'y'
    }
    if(e.target.checked == false) {
      this.signalsTested = 'n'
    }

    let newSignalsTested = this.incentiveDashboardForm.controls['SignalsTested'].value;
    console.log(this.signalsTested)
     console.log(newSignalsTested)
    localStorage.setItem("signalsTested", this.signalsTested);
  }

  routeToNewCustomer() {
    console.log('go to new customer')
    //Holding off on this until TBD
    //this.router.navigate(["new-customer"]);
  }

  routeToNewSite() {
    console.log('go to new site');
    //Holding off on this until TBD
    //this.router.navigate(["new-site"]);
  }

  routeToRecurring() {
    this.router.navigate(["incentive-recurring"]);
  }

  /****Recurring Modal */
  openRecurringModal(recurring) {
    this.modalService.open(recurring, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getItemName(e:any,i:number) {
    // this.counter=0;
    // for(let x of this.incentiveRecurringEntryForm.controls.entryRows['controls']){
    //   console.log(this.incentiveRecurringEntryForm.get(['entryRows',this.counter]).value)
    //   this.counter = this.counter+1;
    // }
    
    // let v = this.incentiveRecurringEntryForm.controls['entryRows'].value.forEach(function(currentRecurringRow) {
    //   console.log(currentRecurringRow.ItemID);
    //   return currentRecurringRow.ItemID;
    // })


    //get the description from listrecurringitems based on the selected ItemID
    //console.log(e.target.value)//returns 'index: item_id', as a string
    let currentID = e.target.value;

    setTimeout(() => {

      const getItemID = this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value.forEach(element => {
        console.log(element,i)
        
        const result = this.listRecurringItems.filter(x => x.item_id == element.ItemID);
        console.log(result)
        // console.log(element.ItemID);

        var string;
        result.forEach(function(e) {
          string = e.itemName.toString();
        })
        const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');
        controlArray.at(i).get('Description').setValue(string);//this is working now!!! Yeah!!!
        // for(let i = 0; i < controlArray.value.length;i++) {
        //   console.log(i)
        //   //this gets current index of FormArray plus all previous indexes
        //   controlArray.at(i).get('Description').setValue(string);
        // }
        
      });
      
      }, 4);
  }

  get r():FormArray {
    return this.incentiveRecurringEntryForm.get('entryRowsRecurring') as FormArray;
  }

  onRecurringSubmit(form: FormGroup) {
    console.log(form.value.Total)
    
    const control = <FormArray>this.incentiveRecurringEntryForm.controls['entryRowsRecurring'];
    
    this.incentiveEntryService.updateRecurring(this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].ItemID, this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].Description, this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].BillCycle, this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].RMR, this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].PassThrough, this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].BillingStartDate, this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].Multiple, this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].Add2Item, this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0].Total);
    
    // this.incentiveDashboardForm.get('LineItemSubtotal').setValue(this.totalRecurringCalc);
    //this.incentiveDashboardForm.get('LineItemSubtotal').setValue(this.totalSumRecurring);

    this.recurring=this.totalSumRecurring;

    localStorage.setItem('recurringentry',JSON.stringify(this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value[0]))
    
    this.modalService.dismissAll()
  }

  addNewItem():void {
    (<FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring'))
    .push(this.initEntryRow());
  }

  removeNewItem(i: number) {
    if(i > 0) {
      const control = (<FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring'))
    .removeAt(i);
    }

    // (<FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring'))
    // .push(this.initEntryRow());

    localStorage.removeItem("recurringentry");
    localStorage.removeItem("totalRecurringCalc");
  }

  // calculateRMR(val:any){
  //   const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');
  //   var rowVal;
  //   controlArray.controls.forEach(function(e) {
  //     rowVal = e.value;
  //   });
  //   console.log(rowVal.RMR);
  //   this.rmr = parseInt(rowVal.RMR);
  // }

  // calculatePassThrough(val:any) {
  //   const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');
  //   var rowVal;
  //   controlArray.controls.forEach(function(e) {
  //     rowVal = e.value;
  //   });
  //   console.log(rowVal.PassThrough);
  //   this.passThrough = parseInt(rowVal.PassThrough);
  // }

  // calculateMultiple(val:any,i:number) {
  //   const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');
  //   var rowVal;
  //   controlArray.controls.forEach(function(e) {
  //     rowVal = e.value;
  //   });
  //   console.log(rowVal.Multiple);
  //   this.multiple = rowVal.Multiple;
  //   this.calculateTotal(val,i)
  // }

  // calculateTotal(val:any,i:number) {
  //   let totalRecurringCalc = this.total = (this.rmr - this.passThrough) * this.multiple;
    
  //   console.log(totalRecurringCalc);

  //   this.totalRecurringCalc = totalRecurringCalc;
    
  //   localStorage.setItem('totalRecurringCalc',this.totalRecurringCalc);

  //   const getItemID = this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value.forEach(element => {
  //     const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');

  //     controlArray.at(i).get('Total').setValue('$'+this.totalRecurringCalc);

  //     console.log(controlArray.at(i).get('Total').value);
  //   })
  // }

  checkboxChanged(e) {
    const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring')
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
  /****END Recurring Modal *********************************/

  /****Equipment & Materials Modal *********************************/
  openEquipMaterialsModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',windowClass: 'my-class'}).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getEquipMatItemName(e:any,i:number) {
    setTimeout(() => {

      const getItemID = this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value.forEach(element => {
        console.log(element, i);

        const result = this.listMatItems.filter(x => x.item_id == element.ItemID);

        var string;
        result.forEach(function(e) {
          string = e.itemName.toString();//extract string from returned array
        });
        const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
        controlArray.at(i).get('Description').setValue(string);

      })
      }, 4);
  }

  onEquipMatSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'];
    //push values to the incentive component
    //not working. will use in the ngOnDestroy
    this.incentiveEntryService.updateEquipMat(this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value[0].ItemID, this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value[0].Description, this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value[0].Quantity, this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value[0].Cost, this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value[0].Total);

    // this.incentiveDashboardForm.get('LineItemSubtotal').setValue(this.totalSumEquipMat);

    this.equipmentAndMaterials=this.totalSumEquipMat;

    localStorage.setItem('equipmatentry',JSON.stringify(this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value[0]));

    this.modalService.dismissAll();
  }

  addNewEquipMatItem():void {
    (<FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat'))
    .push(this.initEquipMatEntryRow());

    //add a delete row button
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

    // (<FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat'))
    // .push(this.initEquipMatEntryRow());

    localStorage.removeItem("equipmatentry");
    localStorage.removeItem("totalEquipMatCalc");
  }

  // calculateQuantity(val:any,i:number) {
  //   const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
  //   var rowVal;
  //   controlArray.controls.forEach(function(e) {
  //     rowVal = e.value;
  //   });
  //   this.quantity = rowVal.Quantity;
  // }

  // calculateCost(val:any,i:number){
  //   const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
  //   var rowVal;
  //   controlArray.controls.forEach(function(e) {
  //     rowVal = e.value;
  //   });
  //   this.cost = parseInt(rowVal.Cost);
  //   this.calculateEquipMatTotal(val,i)
  // }

  // calculateEquipMatTotal(val:any,i:number) {
  //   let totalEquipMatCalc = this.total = (this.quantity * this.cost);

  //   this.totalEquipMatCalc = totalEquipMatCalc;
  //   localStorage.setItem('totalEquipMatCalc', this.totalEquipMatCalc);

  //   const getItemID = this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value.forEach(element => {
  //     const controlArray = <FormArray>this.incentiveEquipMatEntryForm.get('entryRowsEquipMat');
  //     controlArray.at(i).get('Total').setValue('$'+this.totalEquipMatCalc);
  //   })
  // }
  /****END Equipment & Materials Modal *********************************/

  /****Labor Charges Modal *********************************/
  openLaborChargesModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',windowClass: 'my-class'}).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getLaborChargesItemName(e:any,i:number) {
    //get the description from listrecurringitems based on the selected ItemID
    console.log(e.target.value)//returns 'index: item_id', as a string
    let currentID = e.target.value;
    setTimeout(() => {
        const getItemID = this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value.forEach(element => {
          const result = this.listLaborItems.filter(x => x.item_id == element.ItemID);

          var string;
          result.forEach(function(e) {
            string = e.itemName.toString();//extract string from returned array
          });
          // console.log(string);
          const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges');
          controlArray.at(i).get('Description').setValue(string);
        })
      }, 4);
  }

  onLaborChargesSubmit(form: FormGroup) {
    //console.log(form.value.Total)
    const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'];

    // const laborChargesArr = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges');
    // let rowVal;
    // laborChargesArr.controls.forEach(function(e) {
    //   rowVal = e.value;
    //   console.log(rowVal);
    // })

    // return
    
    this.incentiveEntryService.updateLaborCharges(this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value[0].ItemID, this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value[0].Description, this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value[0].Quantity, this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value[0].Cost, this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value[0].Total);

    // this.incentiveDashboardForm.get('LineItemSubtotal').setValue(this.totalSumLaborCharges);

    this.laborCharges=this.totalSumLaborCharges;

    localStorage.setItem('laborchargesentry', JSON.stringify(this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value[0]));
    
    this.modalService.dismissAll();
  }

  addNewLaborChargesItem():void {
    (<FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges'))
    .push(this.initLaborChargesEntryRow());

    //add a delete row button
  }

  removeNewLaborChargesItem(i: number) {
    if(i > 0) {
      const control = (<FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges'))
    .removeAt(i);
    }
    // const control = (<FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges'))
    // .removeAt(i);
    // (<FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges'))
    // .push(this.initLaborChargesEntryRow());

    localStorage.removeItem("laborchargesentry");
    localStorage.removeItem("totalLaborChargesCalc");
  }

  // calculateHours(val:any) {
  //   const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges');
  //   var rowVal;
  //   controlArray.controls.forEach(function(e) {
  //     rowVal = e.value;
  //   });
  //   //console.log(rowVal.Hours);
  //   this.laborQuantity = parseInt(rowVal.Quantity);
  // }

  // calculateCostPerHour(val:any,i:number) {
  //   const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges');
  //   var rowVal;
  //   controlArray.controls.forEach(function(e) {
  //     rowVal = e.value;
  //   });
  //   this.laborCost = parseInt(rowVal.Cost);
  //   this.calculateLaborChargesTotal(val,i);
  // }

  // calculateLaborChargesTotal(val:any,i:number) {
  //   let totalLaborChargesCalc = this.total = (this.laborQuantity * this.laborCost);
    
  //   // this.totalLaborChargesCalc = totalLaborChargesCalc.toString();
  //   this.totalLaborChargesCalc = totalLaborChargesCalc;
  //   localStorage.setItem('totalLaborChargesCalc', this.totalLaborChargesCalc);

  //   const getItemID = this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value.forEach(element => {
  //     const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges');
  //     controlArray.at(i).get('Total').setValue('$'+this.totalLaborChargesCalc);
  //   })
  // }
  /****END Labor Charges Modal *********************************/

  routeToEquipMaterials() {
    this.router.navigate(["incentive-equipment-materials"]);
  }

  routeToLaborCharges() {
    this.router.navigate(["incentive-labor-charges"]);
  }

  openSearchCustomerModal(content) {
    //bring up a modal
    this.modalService.open(content, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openSearchSiteModal(site) {
    this.modalService.open(site, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openSearchSystemModal(system) {
    this.modalService.open(system, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openAddViewCommentsModal(comments) {
    this.modalService.open(comments, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
      // console.log(result)
      // console.log(this.incentiveDashboardForm.controls['PartnerComments'].value)
      let newPartnerComments = this.incentiveDashboardForm.controls['PartnerComments'].value;
      localStorage.setItem("partnerComments", newPartnerComments);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    })
  }

  // openLaborChargesModal(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     console.log(result)
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
