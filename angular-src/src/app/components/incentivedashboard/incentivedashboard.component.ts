import { Component, OnInit, OnChanges, OnDestroy, AfterViewChecked, Input, ViewChild, ElementRef } from '@angular/core';
import { Location, formatDate, CurrencyPipe } from '@angular/common';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
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
import { CustomerSearchListDec14 } from '../../models/customersearchlistdec14';
import { CustomerSearchListSite } from '../../models/customersearchlistsite';
import { CustomerSearchListCentralStation } from 'src/app/models/customersearchlistcentralstation';
import { ListSystemTypes } from '../../models/listsystemtypes';
import { ListRecurringItems } from 'src/app/models/listrecurringitems';
import { ListMultiples } from 'src/app/models/listmultiples';
import { ListMaterialItems } from '../../models/listmaterialitems';
import { ListLaborItems } from 'src/app/models/listlaboritems';
import { CustomerSearchMatch } from 'src/app/models/customersearchmatch';
import { AuthService } from '../../services/auth.service';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashMessagesService } from 'angular2-flash-messages';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpEvent } from '@angular/common/http';
import { Incentive_Add_Recurring } from 'src/app/models/incentiveaddrecurring';
import { Incentive_Add_Equipment } from '../../models/incentiveaddequipment';
import { Incentive_Add_Labor } from '../../models/incentiveaddlabor';
import { Incentive_ADD_Finish } from 'src/app/models/incentiveaddfinish';
import {Environments} from 'src/app/models/environments';
import { fromEvent, Observable, of, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeAll, filter, switchMap, catchError, map, tap, concatMap } from 'rxjs/operators';
import { element } from 'protractor';
declare var $: any;
const moment = require('moment');

@Component({
  selector: 'app-incentivedashboard',
  templateUrl: './incentivedashboard.component.html',
  styleUrls: ['./incentivedashboard.component.css']
})
export class IncentivedashboardComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() incentiveEntryOutput:[];
  //@Input() environment: string;
  environment: number;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('customerRef') customerElement: ElementRef;
  @ViewChild('siteRef') siteElement: ElementRef;
  @ViewChild('systemRef') systemElement: ElementRef;

  @ViewChild("customerSearchIcon") divCustomerSearchIcon: ElementRef;
  @ViewChild("siteSearchIcon") divSiteSearchIcon: ElementRef;
  @ViewChild("systemSearchIcon") divSystemSearchIcon: ElementRef;
  @ViewChild("newSiteDisplay") divNewSiteDisplay: ElementRef;
  @ViewChild("newSystemDisplayCheckbox") divNewSystemDisplayCheckbox: ElementRef;
  @ViewChild("newSystemDisplayLabel") divNewSystemDisplayLabel: ElementRef;
  @ViewChild("invoice") divInvoice: ElementRef;
  @ViewChild("subscriberForm") divSubscriberForm: ElementRef;
  @ViewChild("siteVisit") divSiteVisit: ElementRef;
  @ViewChild("otherDocument1") divOtherDocument1: ElementRef;
  @ViewChild("contract") divContract: ElementRef;
  @ViewChild("otherDocument2") divOtherDocument2: ElementRef;

  baseUrl = environment.baseUrl;

  public value;

  systemPopUp: boolean = false;
  isCustomerSearchResetButton: boolean = false;

  updateRecurringWithJobID;
  updateEquipMatWithJobID;
  updateLaborChargesWithJobID;
  updateRecurringStoredProc;
  updateEquipMatStoredProc;
  updateLaborChargesStoredProc;

  showValidateInvoice = "Validate the invoice";
  showAddViewComments = "Add or view comments";
  showResetInvoice = "Reset the invoice"

  dateString = new Date("1899-12-30");
  //barWidth: string = "0%";
  uploadText;

  authToken: any;
  user:any = Object;
  userEmailAddress: '';
  customerEmailAddress;
  enrollInEmailInvoices;

  ticket_Number;
  customer_Number;
  customerNumber; //used for getServerResponse ng-autocomplete
  companyName;
  partnerCode;
  installCompanyID;

  id;
  customersiteid;
  CustomerSearchMatch:CustomerSearchMatch[];
  incentiveEntry: IncentiveEntry[];
  incentivedashboard:any[];
  listpaneltypes: ListPanelTypes[];
  listcentralstations: ListCentralStations[];
  listsitesforcustomer: ListSitesForCustomer[];
  listSystemsForSite: ListSystemsForSite[];
  customerSearchList: CustomerSearchList[];
  customerSearchListDec14: CustomerSearchListDec14[];
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
  customersearchmatch :CustomerSearchMatch[];
  results: any[] = [];

  dashboardSelectForLocalStorage = new IncentiveDashboard;

  selectedValue: number;

  p: number = 1;
  searchValue:string;
  searchByCustomer:boolean;
  customerSearch:boolean = false;
  searchByBillingAddress:boolean;
  isSiteSelectionFirst: boolean = false;
  isSystemSelectionFirst: boolean = false;
  isRemoveDropdown: boolean = true;
  isRemoveSystemDropdown: boolean = true;
  customerPreselected: boolean = false;
  systemTypePreselected: boolean = false;
  ticket_NumberPreSelected: boolean = false;
  panelTypePreselected: boolean = false;
  centralStationPreselected: boolean = false;
  alarmAccountPreSelected: boolean = false;
  panelLocationPreSelected: boolean = false;
  serviceIncluded: '';
  renewalMonths = '12';
  customer_Site_id: any;
  customer_System_id: any;
  systemName: string;
  panel_Type_Id: number;
  panelName: string;

  closeResult = '';
  incentiveDashboardForm: FormGroup;
  recurringItemEntryForm: FormGroup;
  incentiveRecurringEntryForm: FormGroup;
  incentiveEquipMatEntryForm: FormGroup;
  incentiveLaborChargesEntryForm: FormGroup;
  partnerCommentsEntryForm: FormGroup;

  rmr: number;
  passThrough=0;
  multiple: number;
  total: number;
  totalRecurringCalc;
  itemID;
  description;
  quantity = 1;
  cost: number;
  laborQuantity: number;
  laborCost: number;
  totalEquipMatCalc;
  totalLaborChargesCalc;
  placeholder ="$0.00";

  customer: string;
  siteName: string;
  customerSiteId: number;
  systemTypeID;
  customerSystemId: number;
  alarmAccount: string;
  systemType;
  system_Id;
  systemCode: string;
  site: '';
  system: '';
  newSystem: '';
  newCustomer: '';
  newSite: '';
  accountNumber: '';
  panelTypeID;
  panel_Location;
  centralStationID;

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
  // partnerTaxAmount=0;
  partnerTaxAmount = 0;
  recurring;
  equipmentAndMaterials;
  laborCharges;
  recurringFromLocalStorage;

  lineItemSubtotal;
  startDate: '';
  contractTerm;
  renewal;
  signalsTested;
  additionalInfo;
  partnerComments;

  customer_id;
  customer_Name;
  customerStatus;
  pendingCancel;
  collectionsStatus;
  cust_Numb_Name; // customer_Number + customer_Name
  business_Name;
  address_1;
  bus_Name_Add1; // business name + address_1
  csAccount;
  sysType_csAccount; // systemType + csAccount

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
  //myFiles:string [] = [];
  myFiles = {
    Invoice: "",
    SubForm: "",
    SiteVisit: "",
    Other1: "",
    Other2: "",
    Contract: ""
  };

  showInvoiceFile: boolean = true;
  showSubscriberFormFile: boolean = true;
  showSiteVisitFile: boolean = true;
  showOtherDocument1File: boolean = true;
  showContractFile: boolean = true;
  showOtherDocument2File: boolean = true;

  columns: string[];
  public mySelection: string[] = [];

  selectedInvoiceFile;
  selectedSiteVisitFile;
  selectedContractFile;
  selectedSubscriberFile;
  selectedOtherDocument1File;
  selectedOtherDocument2File;

  getCustomerSearchMatch$;

  billingStartDate;
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

  taxToolTip = "Enter dollars and cents"
  viewAvailableDocuments = "View available documents"
  // resetCustomerToolTip = "Reset using Reset button at bottom right of screen"

  submitted = false;
  showValidateInvoiceButton = true;
  showSubmitInvoiceButton = false;
  customerIDValidated: boolean = true;
  customerSiteIDValidated: boolean = true;
  customerSystemIDValidated: boolean = true;
  invoiceTotalValidated: boolean = false;
  systemInformationSectionValidated: boolean = false;
  invoiceDocValidated: boolean = false;
  customerVisitDocValidated: boolean = false;
  contractDocValidated: boolean = false;
  workOrderDocValidated: boolean = false;
  contractTermsValidated: boolean = false;
  addViewCommentsSignalsValidated: boolean = false;
  addViewCommentsSystemValidated: boolean = false;
  addViewCommentsPanelValidated: boolean = false;
  addNewRMRServiceBoxCheckedValidated: boolean = false;
  laborChargesValidated: boolean = false;
  otherChargesValidated: boolean = false;
  contractInPresentOrFutureValidated: boolean = false;
  contractInPastValidated: boolean = false;

  fullTextValidated: boolean = false;
  partialTextValidated: boolean = false;
  collectionsStatusValidated: boolean = false;
  customerStatusValidated: boolean = false;

  invoiceTotalValidatedNonPartner: boolean = false;
  systemInformationSectionValidatedNonPartner: boolean = false;
  invoiceDocValidatedNonPartner: boolean = false;
  customerVisitDocValidatedNonPartner: boolean = false;
  contractDocValidatedNonPartner: boolean = false;
  workOrderDocValidatedNonPartner: boolean = false;
  contractTermsValidatedNonPartner: boolean = false;
  addViewCommentsSignalsValidatedNonPartner: boolean = false;
  addViewCommentsSystemValidatedNonPartner: boolean = false;
  addViewCommentsPanelValidatedNonPartner: boolean = false;

  formIsValidText: boolean = false;
  signalsCheckedText: boolean = false;

  target;
  clicked = false;//disables button after click
  frmData; // Invoice
  frmData2; // Site Visit
  frmData3; // Contract
  frmData4; // Subscriber Form
  frmData5; // Other Document 1
  frmData6; // Other Document 2

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private incentiveEntryService: IncentiveEntryService,
    public authService: AuthService,
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    private spinnerService: NgxSpinnerService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private httpService: HttpClient,
    private location: Location,
    private cp: CurrencyPipe
  ) {
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        if(event.navigationTrigger === 'popstate') {
          console.log(event);
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
          localStorage.removeItem('checkBoxAutoInsertList');
          localStorage.removeItem('totalEquipMatCalc');
          localStorage.removeItem('customer_Id');
          localStorage.removeItem('customer_Site_Id');
          localStorage.removeItem('customer_System_Id');
          localStorage.removeItem('ticket_Number');
          localStorage.removeItem('customer_Number');
          localStorage.removeItem('customer_Name');
          localStorage.removeItem("business_Name");
          localStorage.removeItem("address_1");
          localStorage.removeItem("systemType");
          localStorage.removeItem("csAccount");
          localStorage.removeItem("panelType");
          localStorage.removeItem("panel_Location");
          localStorage.removeItem("centralStation");
          localStorage.removeItem("panel_Type_Id");
          localStorage.removeItem("central_Station_ID");
          localStorage.removeItem("system_Id");
          // allow the user to navigate to the incentive entry. Just remove the items passed from incentive entry;
          // router.navigate(['/incentive-dashboard'], {replaceUrl:true});
          // location.replaceState('/incentive-dashboard');
        } 
      }
    })

    router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (event.id === 1 && event.url === event.urlAfterRedirects) {
          console.log('the page was refreshed')
          //alert('using the back button will reset all of your currently entered information')

          setTimeout(() => {
            this.removeDocumentsFromUIOnPageRefresh()
          }, 8);

        }
    });
  }
  

  ngOnInit() {
    if(this.baseUrl === 'http://localhost:63052') {
      this.environment = 4;
    } else if (this.baseUrl === 'https://thepartnershipconnectionbeta-api.azurewebsites.net') {
      this.environment = 3;
    } else if (this.baseUrl === 'https://thepartnershipconnectionapi-staging.azurewebsites.net') {
      this.environment = 2;
    } else if (this.baseUrl === 'https://thepartnershipconnectionapi.azurewebsites.net') {
      this.environment = 1;
    } else {
      this.environment = 0;
    }

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
      localStorage.removeItem('invoiceName');
      localStorage.removeItem('invoiceDate');
      localStorage.removeItem('invoiceFileSize');
      localStorage.removeItem('invoiceTotal');
      localStorage.removeItem('serviceIncluded');
      localStorage.removeItem('siteName');
      localStorage.removeItem('customerName');
      localStorage.removeItem('signalsTested');
      localStorage.removeItem('checkBoxAutoInsertList');
      localStorage.removeItem('InstructionsShown');
      localStorage.removeItem('customer_Id');
      localStorage.removeItem('customer_Site_Id');
      localStorage.removeItem('customer_System_Id');
      localStorage.removeItem('ticket_Number');
      localStorage.removeItem("customer_Number");
      localStorage.removeItem("customer_Name");
      localStorage.removeItem("systemType");
      localStorage.removeItem('csAccount');
      localStorage.removeItem('panelType');
      localStorage.removeItem('panel_Location');
      localStorage.removeItem('centralStation');

      localStorage.clear();

      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    $("#wrapper").addClass("toggled");

    this.companyName = localStorage.getItem('companyName');
    this.partnerCode = localStorage.getItem('partnerCode');
    this.installCompanyID = localStorage.getItem('installCompanyID');
    this.invoiceNumber = localStorage.getItem('invoiceNumber');
    this.invoiceDate = localStorage.getItem('invoiceDate');
    this.invoiceTotal = parseFloat(localStorage.getItem('invoiceTotal'));
    // this.invoiceTotal = parseInt(localStorage.getItem('invoiceTotal'));
    // console.log(this.invoiceTotal); // 100 parseInt, 100 parseFloat

    // //Get Files from local storage if page is refreshed
    this.invoiceFile = localStorage.getItem("invoice");
    if(localStorage.getItem('invoiceName')) {
      this.file_name = localStorage.getItem('invoiceName')
    }
    if(localStorage.getItem('subscriberFormName')) {
      this.subscriber_file_name = localStorage.getItem('subscriberFormName')
    }
    if(localStorage.getItem('siteVisitName')) {
      this.site_visit_file_name = localStorage.getItem('siteVisitName')
    }
    if(localStorage.getItem('otherDocument1Name')) {
      this.other_Document1_file_name = localStorage.getItem('otherDocument1Name')
    }
    if(localStorage.getItem('otherDocument2Name')) {
      this.other_Document2_file_name = localStorage.getItem('otherDocument2Name')
    }
    if(localStorage.getItem('contractName')) {
      this.contract_file_name = localStorage.getItem('contractName')
    }
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

    // this.contractTerm = localStorage.getItem("contractTerm");
    // this.renewal = localStorage.getItem("renewal");
    this.contractTerm = 36;
    this.renewal = 12;

    this.recurring = 0.00;
    this.equipmentAndMaterials = parseInt(localStorage.getItem('totalEquipMatCalc'));
    this.laborCharges = 0.00;

    // this.lineItemSubtotal = this.recurring + this.equipmentAndMaterials + this.laborCharges;
    //console.log(this.equipmentAndMaterials)

    //Total = Subtotal + tax: Validation
    // setTimeout(() => {
    //   if(this.lineItemSubtotal !== this.invoiceTotal) {
    //     console.log(this.lineItemSubtotal)
    //     console.log(this.invoiceTotal)
        
    //     this.invoiceTotalValidated = !this.invoiceTotalValidated;
    //   }
    //   if(this.lineItemSubtotal === this.invoiceTotal) {
    //     console.log(this.lineItemSubtotal)
    //     console.log(this.invoiceTotal)

    //     // this.invoiceTotalValidated = false;
    //   }   
    // }, 1000);
    
    
    this.selectedForCheckBoxAutoInsert = JSON.parse(localStorage.getItem('checkBoxAutoInsertList'));
    //console.log(this.selectedForCheckBoxAutoInsert) //object 

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
    }).subscribe(
      (data: any[]) => {

        // console.log(data) 

        if(data === undefined || data.length === 0) {

          console.log('the data is empty')

          let fakeEquipMat = [{
            // ItemID: ["", Validators.required],
            // Description: ["", Validators.required],
            // Quantity: ["", Validators.required],
            // Cost: ["", Validators.required],
            // Total: [0, Validators.required]
            ItemID: [0, Validators.required],
            Description: ["", Validators.required],
            Quantity: [1, Validators.required],
            Cost: [0, Validators.required],
            Total: [0, Validators.required]
          }];

          this.incentiveEquipMatEntryForm = this.fb.group({
            //if there is no data entered from the incentive entry, populate fake data
            entryRowsEquipMat: this.fb.array(fakeEquipMat.map(datum => this.generateFakeDatumFormGroup(datum)))
            // entryRowsEquipMat: this.fb.array(data.map(datum => this.generateDatumFormGroup(datum)))
          });

        } else if(data.length > 0) {

          // console.log('there is data present')

          this.incentiveEquipMatEntryForm = this.fb.group({

            //if there is data present from the incentive entry, populate real data
  
            entryRowsEquipMat: this.fb.array(data.map(datum => this.generateDatumFormGroup(datum)))
          })
        }

        localStorage.setItem('equipmatentry', JSON.stringify(data));

        // the following gets the equipment and materials totals and assign to the variable equipmentAndMaterials
        let mappedDefaultAmounts = data.map(a => a.defaultAmount);
        
        // get sum from mappedDefaultAmounts
        let sumMappedDefaultAmounts = mappedDefaultAmounts.reduce(function(a,b) {
          return a + b
        },0)
        // console.log(sumMappedDefaultAmounts); // number
        // localStorage.setItem("totalEquipMatCalc", JSON.stringify(sumMappedDefaultAmounts));
        
        // this.totalSumRecurring = sumMappedDefaultAmounts;
        // this.totalSumLaborCharges = sumMappedDefaultAmounts;

        this.totalSumEquipMat = sumMappedDefaultAmounts;
        this.equipmentAndMaterials = sumMappedDefaultAmounts;
        this.lineItemSubtotal = this.recurring + this.equipmentAndMaterials + this.laborCharges;

        setTimeout(() => {
          if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
            if(this.lineItemSubtotal !== this.invoiceTotal + this.partnerTaxAmount) {
              this.invoiceTotalValidatedNonPartner = true;
            }
            if(this.lineItemSubtotal === this.invoiceTotal + this.partnerTaxAmount) {
              this.invoiceTotalValidatedNonPartner = false;
            }
          }

          if(this.user.afaRole === 5) {
            if(this.lineItemSubtotal !== this.invoiceTotal + this.partnerTaxAmount) {
            
              this.invoiceTotalValidated = true;
              
            }
            if(this.lineItemSubtotal === this.invoiceTotal + this.partnerTaxAmount) {
  
              this.invoiceTotalValidated = false;
  
            }
          }
        }, 1000);

        let fakeRecurringData = [{
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
        }];

        // let fakeEquipMat = [{
        //   ItemID: ["", Validators.required],
        //   Description: ["", Validators.required],
        //   Quantity: ["", Validators.required],
        //   Cost: ["", Validators.required],
        //   Total: ["", Validators.required]
        // }];

        let fakeLaborChargesData = [{
          ItemID: ["", Validators.required],
          Description: ["", Validators.required],
          Quantity: ["", Validators.required],
          Cost: ["", Validators.required],
          Total: ["", Validators.required]
        }];

        this.incentiveRecurringEntryForm = this.fb.group({
          entryRowsRecurring: this.fb.array(fakeRecurringData.map(datumRecurring => this.generateRecurringDatumFormGroup(datumRecurring)))
        })

        // this.incentiveEquipMatEntryForm = this.fb.group({
        //   //if there is no data entered from the incentive entry, populate fake data
        //   //entryRowsEquipMat: this.fb.array(fakeEquipMat.map(datum => this.generateDatumFormGroup(datum)))

        //   entryRowsEquipMat: this.fb.array(data.map(datum => this.generateDatumFormGroup(datum)))
        // })
        
        this.incentiveLaborChargesEntryForm = this.fb.group({
          entryRowsLaborCharges: this.fb.array(fakeLaborChargesData.map(datumLabor => this.generateLaborChargesDatumFormGroup(datumLabor)))
        })

        // console.log(this.incentiveRecurringEntryForm.get('entryRowsRecurring').value)
        // console.log(this.incentiveEquipMatEntryForm.get('entryRowsEquipMat').value)
        // console.log(this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges').value)

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
    });

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        //console.log(this.userEmailAddress = JSON.parse(localStorage.getItem('user')).email)
      },
      err => {
        console.log(err)
      }
    )

    // this.incentiveRecurringEntryForm = this.fb.group({
    //   entryRowsRecurring: this.fb.array([this.initEntryRow()])
    // });

    this.incentiveRecurringEntryForm = this.fb.group({
      entryRowsRecurring: this.fb.group({
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
    });

    this.incentiveEquipMatEntryForm = this.fb.group({
      entryRowsEquipMat: this.fb.group({
        ItemID: ["", Validators.required],
        Description: ["", Validators.required],
        Quantity: ["", Validators.required],
        Cost: ["", Validators.required],
        Total: ["", Validators.required]
      })
    });

    this.incentiveLaborChargesEntryForm = this.fb.group({
      entryRowsLaborCharges: this.fb.group({
        ItemID: ["", Validators.required],
        Description: ["", Validators.required],
        Quantity: ["", Validators.required],
        Cost: ["", Validators.required],
        Total: ["", Validators.required]
      })
    });

    this.incentiveDashboardForm = this.fb.group({
      UserEmailAddress: this.userEmailAddress = JSON.parse(localStorage.getItem('user')).email, //@UserEmailAddress
      CustomerEmailAddress:[""], //@CustomerEmailAddress
      //CustomerID: this.id, //@CustomerID
      InstallCompanyID: this.installCompanyID = JSON.parse(localStorage.getItem('installCompanyID')),
      CustomerID: ["", Validators.required], //@CustomerID
      CustomerSiteID: ["", Validators.required], //@CustomerSiteID
      CustomerSystemID: ["", Validators.required], //@CustomerSystemID
      SystemTypeID: ["", Validators.required], //@SystemTypeID
      SystemCode: [""],
      NewSystem: [""],
      NewCustomer: [""],
      NewSite: [""],
      TicketNumber: [""],
      AlarmAccount: ["", Validators.required], //@AlarmAccount
      PanelTypeID: ["", Validators.required], //@PanelTypeID
      PanelLocation: [""], //@PanelLocation
      CentralStationID: ["", Validators.required], //@CentralStationID
      AdditionalInfo: [""], //@AdditionalInfo
      InvoiceUpload: ["", Validators.required],
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
      PartnerComments: [""], //@PartnerComments
      //SourceApp: this.environment,
      Environment: this.environment,
      EnrollInEmailInvoices: [""]
    });

    this.partnerCommentsEntryForm = this.fb.group({
      PartnerComments: [""]
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

    this.routeService.getListMultiples().subscribe(
      res => {
        this.listMultiples = res;
      }
    )

    this.routeService.getListSystemTypes().subscribe(
      res => {
        this.listsystemtypes = res;
      }
    )

    //Move these 2 methods
    // this.routeService.getListPanelTypes().subscribe(
    //   res => {
    //     this.listpaneltypes = res;
    //   }
    // )

    // this.routeService.getListCentralStations().subscribe(
    //   res => {
    //     this.listcentralstations = res;
    //   }
    // )

    // If the partner already selected a customer from the Incentive Entry page, get the ticket_Number, customer_Id, customer_Site_Id, and customer_System_Id from localstorage
    // Convert the values from localstorage from strings to integers
    // Call the API for Customer, Site, and System
    if(localStorage.getItem('customer_Id')) {
      this.customer_id = parseInt(localStorage.getItem('customer_Id'));
    }

    if(localStorage.getItem('customer_Site_Id')) {
      this.customer_Site_id = parseInt(localStorage.getItem('customer_Site_Id'));
    }

    if(localStorage.getItem('customer_System_Id')) {
      this.customer_System_id = parseInt(localStorage.getItem('customer_System_Id'));
    }
    
    this.ticket_Number = localStorage.getItem('ticket_Number');
    if(this.ticket_Number) {
      this.ticket_NumberPreSelected = true;
    }

    this.customer_Number = localStorage.getItem('customer_Number');
    this.customer_Name = localStorage.getItem('customer_Name');
    this.business_Name = localStorage.getItem('business_Name');
    this.address_1 = localStorage.getItem('address_1');
    this.systemType = localStorage.getItem('systemType');
    this.csAccount = localStorage.getItem('csAccount');
    if(this.csAccount) {
      this.alarmAccountPreSelected = true
    }
    this.alarmAccount = localStorage.getItem('csAccount');
    this.systemType = localStorage.getItem('systemType');
    this.system_Id = localStorage.getItem('system_Id');
    this.panelTypeID = localStorage.getItem('panelType');
    if(this.panelTypeID) {
      this.routeService.getListPanelTypes(parseInt(localStorage.getItem('panel_Type_Id'))).subscribe(
        res => {
          this.listpaneltypes = res;
        }
      )
    }
    this.panel_Location = localStorage.getItem('panel_Location');
    if(this.panel_Location) {
      this.panelLocationPreSelected = true;
    }
    this.centralStationID = localStorage.getItem('centralStation');
    if(this.centralStationID) {
      this.routeService.getListCentralStations(parseInt(localStorage.getItem('central_Station_ID'))).subscribe(
        res => {
          this.listcentralstations = res;
        }
      )
    }

    // if the user is an employee, set the formcontrol fields InvoiceUpload and SiteVisitUpload valid
    setTimeout(() => {
      if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
        console.log('set InvoiceUpload and SiteVisitUpload valid')
      }
    }, 4);
  }

  ngAfterViewChecked() {
    //If there's a recurring, materials and equipment, and labor total in the service that's available...
    //then display in the total in the recurring, materials and equipment, and labor inputs
    //this.getRecurringFromLocalStorage();

    setTimeout(() => {

      this.incentiveDashboardForm.controls["TicketNumber"].setValue(this.ticket_Number);

      this.cust_Numb_Name = this.customer_Number + ' - ' + this.customer_Name;
      this.bus_Name_Add1 = this.business_Name + ' - ' + this.address_1;
      this.sysType_csAccount = this.systemType + ' - ' + this.csAccount;

      if(localStorage.getItem("customer_Number") && localStorage.getItem("customer_Name")){
        this.customerPreselected = true;
        this.customer = this.cust_Numb_Name;
        this.incentiveDashboardForm.get("CustomerID").setValue(this.customer_id);
      }

      if(localStorage.getItem("business_Name") && localStorage.getItem("address_1")) {
        this.isSiteSelectionFirst = true;
        this.isRemoveDropdown = false;
        this.divSiteSearchIcon.nativeElement.style.display = 'none';
        this.divNewSiteDisplay.nativeElement.style.display = 'none'
        this.siteName = this.bus_Name_Add1;
        //set CustomerSiteID
        //this.incentiveDashboardForm.get("CustomerSiteID").setValue(this.customer_Site_id);
      }

      if(localStorage.getItem("systemType") && localStorage.getItem("csAccount")) {
        this.isSystemSelectionFirst = true;
        this.isRemoveSystemDropdown = false;
        this.divSystemSearchIcon.nativeElement.style.display = 'none';
        this.divNewSystemDisplayCheckbox.nativeElement.style.display = 'none';
        this.divNewSystemDisplayLabel.nativeElement.style.display = 'none';
        this.systemCode = this.sysType_csAccount;
        // set CustomerSystemID
        //this.incentiveDashboardForm.get("CustomerSystemID").setValue(this.customer_System_id);
      }

      if(localStorage.getItem("csAccount")) {
        this.alarmAccount = this.alarmAccount;
      }

      if(localStorage.getItem("systemType")) {
        //this.systemTypePreselected = true;
        this.systemTypeID = this.systemType;
        // set SystemTypeID (required)
        this.incentiveDashboardForm.controls["SystemTypeID"].setValue(parseInt(this.system_Id));
      }
      
      if(localStorage.getItem("panelType")) {
        //this.panelTypePreselected = true;
        this.panelTypeID = this.panelTypeID;
        
        this.panelTypeID = parseInt(localStorage.getItem('panel_Type_Id'));
      }

      if(localStorage.getItem("panel_Location")) {
        this.panel_Location = this.panel_Location;
      }

      if(localStorage.getItem("centralStation")) {
        //this.centralStationPreselected = true;
        this.centralStationID = parseInt(localStorage.getItem('central_Station_ID'));
        //this.centralStationID = this.centralStationID;
        this.incentiveDashboardForm.controls["CentralStationID"].setValue(this.centralStationID)
      }

      if(!isNaN(parseFloat(this.recurring))) {
        this.incentiveDashboardForm.controls["Recurring"].setValue(this.recurring);
        this.incentiveDashboardForm.controls["Recurring"].setValue(this.recurring);
        this.incentiveDashboardForm.controls["Recurring"].updateValueAndValidity();
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

      if(this.recurring && this.partnerTaxAmount) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + this.partnerTaxAmount);
      }

      if(this.equipmentAndMaterials) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.equipmentAndMaterials));
      }

      if(this.equipmentAndMaterials && this.partnerTaxAmount) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.equipmentAndMaterials) + this.partnerTaxAmount);
      }

      if(this.laborCharges) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.laborCharges));
      }

      if(this.laborCharges && this.partnerTaxAmount) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.laborCharges) + this.partnerTaxAmount);
      }

      if(this.equipmentAndMaterials && this.laborCharges) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.equipmentAndMaterials) + parseInt(this.laborCharges));
      }

      if(this.equipmentAndMaterials && this.laborCharges && this.partnerTaxAmount) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.equipmentAndMaterials) + parseInt(this.laborCharges) + this.partnerTaxAmount);
      }

      if(this.recurring && this.equipmentAndMaterials) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.equipmentAndMaterials));
      }

      if(this.recurring && this.equipmentAndMaterials && this.partnerTaxAmount) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.equipmentAndMaterials) + this.partnerTaxAmount);
      }

      if(this.recurring && this.laborCharges) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.laborCharges));
      }

      if(this.recurring && this.laborCharges && this.partnerTaxAmount) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.laborCharges) + this.partnerTaxAmount);
      }

      if(this.recurring && this.equipmentAndMaterials && this.laborCharges) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.equipmentAndMaterials) + parseInt(this.laborCharges));
      }

      if(this.recurring && this.equipmentAndMaterials && this.laborCharges && this.partnerTaxAmount) {
        this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.equipmentAndMaterials) + parseInt(this.laborCharges) + this.partnerTaxAmount);
      }

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

  removeNaN(e){
    if(e.code === 'Backspace' || e.code === 'Delete') {
      this.invoiceTotal = '';
    }
    // if(e.code === 'Backspace' || e.code === 'Delete') {
    //   this.partnerTaxAmount = null;
    // }
  }

  onChangeInvoiceTotal(e) {
    console.log(e)
    // this.invoiceTotal = parseInt(e.target.value)
    // if(this.incentiveDashboardForm.get('LineItemSubtotal').value === this.invoiceTotal) {
    //   console.log('match')
    //   //this.invoiceTotalValidated = false;
    //   this.invoiceTotal = parseInt(e.target.value)
    //   //
    // } else {
    //   console.log('no match')
    //   //this.invoiceTotalValidated = true;
    //   this.calculateInvoiceTotal()
    // }
    // this.removeNaN(e)
  }

  calculateCost(e,i) {
    console.log(e.target.value);
  }

  calculateInvoiceTotal() {
    
    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {

      // this.lineItemSubtotal = this.recurring + this.equipmentAndMaterials + this.laborCharges;
      this.lineItemSubtotal = +(this.recurring + this.equipmentAndMaterials + this.laborCharges).toFixed(12);

      if(this.lineItemSubtotal + this.partnerTaxAmount !== this.invoiceTotal) {
        //console.log('the line items and tax don\'t equal the total');
        
        this.invoiceTotalValidatedNonPartner = true;
      }

      if(this.lineItemSubtotal + this.partnerTaxAmount === this.invoiceTotal) {
        //console.log('the line items and tax equal the total');

        this.invoiceTotalValidatedNonPartner = false;
      }
    
      // if(this.invoiceTotal + this.partnerTaxAmount !== this.lineItemSubtotal) {
      //   this.invoiceTotalValidatedNonPartner = true;
      // }
      // if(this.invoiceTotal + this.partnerTaxAmount === this.lineItemSubtotal) {
      //   this.invoiceTotalValidatedNonPartner = false;
      //   this.incentiveDashboardForm.get('InvoiceTotal').setValue(this.lineItemSubtotal);
      // }
    }

    if(this.user.afaRole === 5) {

      // this.lineItemSubtotal = this.recurring + this.equipmentAndMaterials + this.laborCharges;
      this.lineItemSubtotal = +(this.recurring + this.equipmentAndMaterials + this.laborCharges).toFixed(12);

      console.log(this.lineItemSubtotal + this.partnerTaxAmount);

      if(this.lineItemSubtotal + this.partnerTaxAmount !== this.invoiceTotal) {
        //console.log('the line items and tax don\'t equal the total');
        
        this.invoiceTotalValidated = true;
        this.formIsValidText = false;
        
        //set the InvoiceTotal reactive form control to invalid
       
      }

      if(this.lineItemSubtotal + this.partnerTaxAmount === this.invoiceTotal) {
        //console.log('the line items and tax equal the total');

        this.invoiceTotalValidated = false;
        this.formIsValidText = true;
      }
    
      // if(this.invoiceTotal + this.partnerTaxAmount !== this.lineItemSubtotal) {
      //   this.invoiceTotalValidated = true;
      //   // set InvoiceTotal invalid if InvoiceTotal plus PartnerTaxAmount doesn't match LineItemSubtotal
      //   this.incentiveDashboardForm.controls['InvoiceTotal'].setErrors({});
      // }
      // if(this.invoiceTotal + this.partnerTaxAmount === this.lineItemSubtotal) {
      //   console.log(this.lineItemSubtotal)

      //   // this is possibly changing the total
      //   // this.incentiveDashboardForm.get('InvoiceTotal').setValue(this.lineItemSubtotal);
        
      //   this.invoiceTotalValidated = false;
      // }
    }
  }

  onChangeGetSystemType(e) {
    localStorage.removeItem('system_Id');
    localStorage.removeItem('systemType');
    this.systemTypeID = parseInt(e.target.value.substring(3));

    //console.log(this.systemTypeID);
  }

  onChangeGetPanelType(e) {
    this.panelTypeID = Number(e.target.value);
    // this.panelTypeID = parseInt(e.target.value.substring(3));
    // console.log(this.panelTypeID)
    // console.log(typeof this.panelTypeID)

    localStorage.removeItem('panelType');
    this.panelTypeID = Number(e.target.value);
  }

  onChangeGetCentralStation(e) {
    localStorage.removeItem('central_Station_ID');
    localStorage.removeItem('centralStation');
    this.centralStationID = parseInt(e.target.value.substring(3))
  }

  onChangeNewSystem(e) {

    if(e.target.checked) {
      //console.log('the input is checked')
      // the CustomerSystemID should get a value of 1
      this.incentiveDashboardForm.controls["CustomerSystemID"].setValue(1)
      // validate this field
      this.incentiveDashboardForm.get("CustomerSystemID").setValidators(null);
      //this.incentiveDashboardForm.controls['CustomerSystemID'].clearValidators()
      this.incentiveDashboardForm.get("CustomerSystemID").updateValueAndValidity();

      // List Panel Types
      this.routeService.getListPanelTypes(1).subscribe(
        res => {
          this.listpaneltypes = res;
        }
      )

      // List Central Station
      this.routeService.getListCentralStations(1).subscribe(
        res => {  
          this.listcentralstations = res;
        }
      )
      
      //this.incentiveDashboardForm.controls['CustomerSystemID'].disable();

      // this.systemInformationSectionValidated = true;
      // this.customerSystemIDValidated = true;

      //console.log('display error message')
    }
    if(!e.target.checked) {
      //console.log('the input is unchecked')
      // the SystemID should not get a value
      this.incentiveDashboardForm.controls["CustomerSystemID"].setValue('')
      // if there is a value present, then remove the value and invalidate the field
      this.incentiveDashboardForm.get("CustomerSystemID").setValidators(Validators.required);
      this.incentiveDashboardForm.get("CustomerSystemID").updateValueAndValidity();

      this.incentiveDashboardForm.controls['CustomerSystemID'].enable();

      // this.systemInformationSectionValidated = false;

    }
  }

  //Recurring
  private generateRecurringDatumFormGroup(datumRecurring) {
    return this.fb.group({
      // ItemID: this.fb.control(datumRecurring.itemID),
      ItemID: this.fb.control(0),
      Description: this.fb.control(datumRecurring.itemDescription),
      BillCycle: this.fb.control(datumRecurring.billCycle),
      // RMR: this.fb.control(datumRecurring.rmr),
      RMR: this.fb.control(0),
      // PassThrough: this.fb.control(datumRecurring.passThrough),
      PassThrough: this.fb.control(0),
      BillingStartDate: this.fb.control(datumRecurring.billStartDate),
      Add2Item: this.fb.control(0),
      // Multiple: this.fb.control(datumRecurring.multiple),
      Multiple: this.fb.control(25),
      // Total: this.fb.control((datumRecurring.rmr - datumRecurring.passThrough)*datumRecurring.multiple)
      Total: this.fb.control(0)
    })
  }

  //Equip & Mat
  private generateFakeDatumFormGroup(datum) {
    return this.fb.group({
      // ItemID: this.fb.control(datum.itemID),
      // Description: this.fb.control(datum.itemDescription),
      // Quantity: this.fb.control(1),
      // Cost: this.fb.control(datum.defaultAmount ),
      // Total: this.fb.control(0)
      ItemID: this.fb.control(0),
      Description: this.fb.control(datum.itemDescription),
      Quantity: this.fb.control(1),
      Cost: this.fb.control(0),
      Total: this.fb.control(0)
    })
  }

  private generateDatumFormGroup(datum) {
    return this.fb.group({
      ItemID: this.fb.control(datum.itemID),
      Description: this.fb.control(datum.itemDescription),
      Quantity: this.fb.control(1),
      Cost: this.fb.control(datum.defaultAmount ),
      Total: this.fb.control(this.quantity * datum.defaultAmount)
      //Total: this.fb.control(0)
    })
  }

  //Labor
  private generateLaborChargesDatumFormGroup(datumLabor) {
    return this.fb.group({
      // ItemID: this.fb.control(datumLabor.itemID),
      ItemID: this.fb.control(0),
      Description: this.fb.control(datumLabor.itemDescription),
      Quantity: this.fb.control(1),
      // Cost: this.fb.control(datumLabor.defaultAmount ),
      Cost: this.fb.control(0),
      // Total: this.fb.control(this.quantity * datumLabor.defaultAmount)
      Total: this.fb.control(0)
    })
  }

  updateTotalRecurring(entryRowsRecurring:any) {
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

  updateTotalEquipMat(entryRowsEquipMat:any) {
    //console.log('updateTotalEquipMat was called')
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

  updateTotalLaborCharges(entryRowsLaborCharges:any) {
    //console.log('updateTotalLaborCharges was called')
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
      localStorage.removeItem('checkBoxAutoInsertList');
      localStorage.removeItem('totalEquipMatCalc');
      localStorage.removeItem('customer_Id');
      localStorage.removeItem('customer_Site_Id');
      localStorage.removeItem('customer_System_Id');
      localStorage.removeItem('ticket_Number');
      localStorage.removeItem('customer_Number');
      localStorage.removeItem('customer_Name');
      localStorage.removeItem("business_Name");
      localStorage.removeItem("address_1");
      localStorage.removeItem("systemType");
      localStorage.removeItem("csAccount");
      localStorage.removeItem("panelType");
      localStorage.removeItem("panel_Location");
      localStorage.removeItem("centralStation");
      localStorage.removeItem("panel_Type_Id");
      localStorage.removeItem("central_Station_ID");
      localStorage.removeItem("system_Id");

      this.router.navigate(['incentive-entry/']);
    }

  }

  getAdditionalInfo(e){
    let newAdditionalInfo = e.target.value;
    localStorage.setItem("additionalInfo", newAdditionalInfo);
  }

  onChangePartnerTaxAmount(e) {
    // console.log(e)
    // console.log(this.incentiveDashboardForm.controls["PartnerTaxAmount"].value)

    if(this.incentiveDashboardForm.controls["PartnerTaxAmount"].value == null) {
      this.partnerTaxAmount = 0;
      this.incentiveDashboardForm.controls["PartnerTaxAmount"].setValue(0.00)
    }
    if(this.partnerTaxAmount == NaN) {
      this.partnerTaxAmount = 0;
      this.incentiveDashboardForm.controls["PartnerTaxAmount"].setValue(0.00)
    }
    //this.removeNaN(e);
    this.calculateInvoiceTotal();
  }

  onKeyupGetPartnerTaxAmount(e) {
    // console.log(this.incentiveDashboardForm.get('PartnerTaxAmount').value)
    // console.log(typeof e.target.value)
    //get period(.) on keyboad
    // if . is pressed, this.partnerTaxAmount = 0.00
    // console.log(e)
    // console.log(e.target.value)
    // console.log(parseFloat(e.target.value))
    this.partnerTaxAmount = parseFloat(e.target.value)
    //console.log(typeof this.partnerTaxAmount)

    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
      if(this.lineItemSubtotal === this.invoiceTotal + this.partnerTaxAmount){
        this.invoiceTotalValidatedNonPartner = true;
      }
  
      if(this.lineItemSubtotal !== this.invoiceTotal + this.partnerTaxAmount){
        this.invoiceTotalValidatedNonPartner = false;
      }
    }

    if(this.user.afaRole === 5) {
      if(this.lineItemSubtotal === this.invoiceTotal + this.partnerTaxAmount){
        this.invoiceTotalValidated = true;
      }
  
      if(this.lineItemSubtotal !== this.invoiceTotal + this.partnerTaxAmount){
        this.invoiceTotalValidated = false;
      }
    }

    // if(this.lineItemSubtotal === this.invoiceTotal + this.partnerTaxAmount){
    //   this.invoiceTotalValidated = true;
    // }

    // if(this.lineItemSubtotal !== this.invoiceTotal + this.partnerTaxAmount){
    //   this.invoiceTotalValidated = false;
    // }

    this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(parseInt(this.recurring) + parseInt(this.equipmentAndMaterials) + parseInt(this.laborCharges) + this.partnerTaxAmount);

  }

  resetPartnerTaxAmount(e) {  
    console.log('reset')
    if(e.target.value === "" || e.target.value === null) {
      this.incentiveDashboardForm.controls["PartnerTaxAmount"].valueChanges.subscribe(
        x => {
          console.log(x)
        }
      )
    }
  }

  onChangeVerifyContractDate(e) {
    console.log(e);
    console.log(e.target.value); //this is the contract date format in the form
   
    let todaysDate = new Date();
    let todaysDateString = e.target.value;

    todaysDateString = todaysDate.getFullYear() + '-' + ('0' + (todaysDate.getMonth()+1)).slice(-2) + '-' + ('0' + todaysDate.getDate()).slice(-2);

    if(e.target.value === todaysDateString) {
      console.log('you selected today\'s date')
      // this.contractInPresentOrFutureValidated = true;
      this.contractInPresentOrFutureValidated = false;
    }

    if(e.target.value > todaysDateString) {
      console.log('the selected date is in the future')
      this.contractInPresentOrFutureValidated = true;
    }

    if(e.target.value < todaysDateString) {
      console.log('the selected date is in the past')
      console.log(todaysDateString)
      this.contractInPresentOrFutureValidated = false;
      // this.contractInPastValidated = true;
      // if the entered contract start date is greater than 3 months in the past
    }

    var threeMonthsAgo = moment().subtract(3, 'months');
    var threeMonthsAgoFormatted = threeMonthsAgo.format(moment.HTML5_FMT.DATE);

    if(e.target.value === threeMonthsAgoFormatted) {
      // console.log('date selected is exactly 3 months ago')
    }

    if(e.target.value < threeMonthsAgoFormatted) {
      // console.log('date selected is more than 3 months ago');
      this.contractInPastValidated = true;
    }

    if(e.target.value > threeMonthsAgoFormatted) {
      // console.log('date selected is more than 3 months ago');
      this.contractInPastValidated = false;
    }

    // console.log(threeMonthsAgo.format()); // 2015-10-13T09:37:35+02:00
    // console.log(threeMonthsAgoFormatted);

  }

  getContractTerm(e) {
    let newContractTerm = e.target.value;
    //console.log(newContractTerm);
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

  onResetCustomer() {
    this.incentiveDashboardForm.get('CustomerID').reset();
    this.incentiveDashboardForm.get('CustomerSiteID').reset();
    this.incentiveDashboardForm.get('CustomerSystemID').reset();
    this.incentiveDashboardForm.get('AlarmAccount').reset();
    this.incentiveDashboardForm.get('SystemTypeID').reset();
    this.incentiveDashboardForm.get('PanelTypeID').reset();
    this.panelTypeID = '';
    this.incentiveDashboardForm.get('PanelLocation').reset();
    this.incentiveDashboardForm.get('CentralStationID').reset();
    this.centralStationID = '';

    this.customerIDValidated = true;
    this.customerSiteIDValidated = true;
    this.customerSystemIDValidated = true;

    this.isCustomerSearchResetButton = true;
  }

  delete(e) { 
    //console.log(e.keyCode)
    if(e && e.code === 'Backspace' || e.code === 'Delete') {
      e.preventDefault();
    }
  }

  public placeholderq: string = 'Type a customer number...';
  public keyword = 'customerNumber';
  public historyHeading: string = 'Recently selected';

  search = (text$: Observable<any>) => text$.pipe(
    debounceTime(1000), //changed from debounceTime(200) on 03/18/2022
    distinctUntilChanged(),
    switchMap(
      (searchText) => this.getCustomerSearchMatch$ = this.routeService.getCustomerSearchMatch(searchText)),
      tap(res => {
        this.customerSearch = !this.customerSearch;
        let x = res.forEach(x =>{
          console.log(x.customerID)
          this.id = x.customerID;
        });
      }),
      // tap(()=>{
        // this.routeService.getCustomerSearchMatch(searchText).subscribe
        //this.doGetCustomerID()
      // }),
      tap(() => this.routeService.getListSitesForCustomer(this.id).subscribe(res => {
        // console.log(res)
        this.listsitesforcustomer = res;
        for(var i = 0; i < this.listsitesforcustomer.length; i++) {
          this.listsitesforcustomer[i].customer_Site_id;

          this.customer_Site_id = this.listsitesforcustomer[i].customer_Site_id;
          this.incentiveDashboardForm.get("CustomerSiteID").setValue(this.customer_Site_id);

          this.routeService.getListSystemsForSite(this.customer_Site_id).subscribe(
            res => {
              this.listSystemsForSite = res;

              for(var i = 0; i < this.listSystemsForSite.length; i ++) {
                
                if(this.listSystemsForSite.length > 1) {
                  //console.log('there are more than 1 system')
                  this.systemPopUp = true;

                  return this.getAndDisplayCentralStationInfo();
                }

                if(this.listSystemsForSite.length == 1) {
                  // console.log('there is only 1 system')
                  // console.log(this.listSystemsForSite[i].systemType)
                  // console.log(this.listSystemsForSite[i].alarmAccount)
                  this.customer_System_id = this.listSystemsForSite[i].customer_System_id;
                  this.incentiveDashboardForm.get("CustomerSystemID").setValue(this.customer_System_id);
                  this.selectedValue = this.listSystemsForSite[i].customer_System_id

                  //console.log(this.listSystemsForSite[i].customer_System_id)
                  //added to fix autopopulate fields
                  this.incentiveDashboardForm.get("CustomerSystemID").setValue(this.customer_System_id);

                  this.alarmAccount = this.listSystemsForSite[i].alarmAccount;
                  this.systemTypeID = this.listSystemsForSite[i].systemType;
                  this.customer_System_id = this.listSystemsForSite[i].customer_System_id;

                  this.routeService.getListCentralStations(this.customer_System_id).subscribe(
                    res => {
                      //console.log(res);
                      this.listcentralstations = res;
                    }
                  )

                  this.routeService.getListPanelTypes(this.customer_System_id).subscribe(
                    res => {
                      //console.log(res);
                      this.listpaneltypes = res;
                    }
                  )
                  
                  this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
                    res => {
                      //console.log(res)
                      this.alarmAccount = res.accountNumber;
                      this.systemTypeID = res.systemType;
                      this.panelTypeID = res.panelType;
                      this.panel_Location = res.panelLocation;
                      this.centralStationID = res.centralStationID;
                      this.additionalInfo = res.additionalInfo;
                    }
                  )
                }
              }
              //this.getAndDisplayCentralStationInfo();
            }
          )
        }
      }))
  )

  getAndDisplayCentralStationInfo() {
    //get the value on change
    this.incentiveDashboardForm.get('CustomerSystemID').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged()
      )
    .subscribe(
      res => {
        //console.log(res)
        this.routeService.getListCentralStations(this.customer_System_id).subscribe(res => {
          //console.log(res);
          this.listcentralstations = res;
        });

        this.routeService.getListPanelTypes(this.customer_System_id).subscribe(res => {
          this.listpaneltypes = res;
        })
      }
    )
  }

  removeCustomerValidationIfSelected() {
    if(this.id && this.customer_Site_id && this.customer_System_id) {
      this.customerIDValidated = false;
      // console.log(this.id);
      // console.log(this.customer_Site_id);
      // console.log(this.customer_System_id);
    }
  }

  resultFormatCustomerListValue(value:any) {
    return value.customerNumber + ' ' + value.customerName
  }

  inputFormatCustomerListValue(value:any) {
    if(value.customerName) 
      return value.customerNumber + ' - ' + value.customerName
      return value;
  }

  onChangeFocus(e) {
    //console.log(e);
    this.siteElement.nativeElement.focus();
  }

  doSetCustomerIDSystemID(){
    this.incentiveDashboardForm.controls['CustomerID'].setValue(this.id);
    this.incentiveDashboardForm.controls['CustomerSystemID'].setValue(this.customer_System_id);
    // console.log('get customerID');
   }

  getServerResponse(event){
    // console.log(parseInt(event));
    // console.log(this.incentiveDashboardForm.controls["CustomerID"]);
  }

  searchCleared(){
    //console.log('searchCleared');
    this.results = [];

    this.listsitesforcustomer = [];
    this.listSystemsForSite = [];
    
    this.id = "";
    this.customer = "";
    this.customer_Site_id = "";
    this.customerSiteName = "";
    this.customer_System_id = "";
    this.systemName = "";

    this.incentiveDashboardForm.controls["CustomerID"].reset();
    this.incentiveDashboardForm.controls["CustomerSiteID"].reset();
    this.incentiveDashboardForm.controls["CustomerSystemID"].reset();
    this.incentiveDashboardForm.controls["AlarmAccount"].reset();
    this.incentiveDashboardForm.controls["SystemTypeID"].reset();
    this.incentiveDashboardForm.controls["PanelTypeID"].reset();
    this.incentiveDashboardForm.controls["PanelLocation"].reset();
    this.incentiveDashboardForm.controls["CentralStationID"].reset();
  }

  selectEvent(item) {
    //console.log(item.customerID)
    //console.log(this.customerElement.nativeElement) //undefined
    //this.customerElement.nativeElement.innerHTML = this.customerSiteName
    // here we can write code for doing something with selected item
    // this.incentiveDashboardForm.controls["CustomerID"].setValue(this.customer+ " - " +this.customerNumber)
    this.incentiveDashboardForm.controls["CustomerID"].setValue(this.customerNumber + " - " + this.customer)
    this.siteElement.nativeElement.focus()
  }

  onChangeSearch(val: string) {
    // here we can fetch data from remote location here
    // And reassign the 'data' which is binded to 'data' property.
    // this.incentiveDashboardForm.controls["CustomerID"].valueChanges
    // .pipe(debounceTime(1000),distinctUntilChanged())
    // .subscribe(queryField  => this.routeService.getCustomerSearchMatch(queryField)
    // .subscribe(response => {
    //   console.log(response)
    //   this.results = response;
    //   // let obj = response.find(e => e.customerName === e.customerName)
    //   for(var i = 0; i < response.length; i++) {
    //     console.log(response[i].customerID)
    //     var x = response[i].customerID;
    //     this.routeService.getListSitesForCustomer(x).subscribe(
    //       res => {
    //         //console.log(res);
    //         this.listsitesforcustomer = res;
    //         for(var i = 0; i < this.listsitesforcustomer.length; i++) {
    //           console.log(this.listsitesforcustomer[i])

              

      
    //         }
    //       }
    //     )
    //   }
    // }
    //   )
    // )
  }

  onFocused(e){
    // here we can write our code for doing something when input is focused
  }

  //filter cancelled customers or by customerStatus (active or cancel)
  onItemChangeToInclude(value) {
    //console.log("Include cancelled customers: ", value)
    if(value === '0') {
      console.log('filter the table by active customers: ', value)
      //filter the table by active customers
      let cancel = this.customerSearchListCentralStation.filter(x => x.customerStatus === 'Cancel');
      console.log(cancel);
    }
  }

  onItemChangeToExclude(value) {
    //this is the default selected radio value
    //console.log("Exclude cancelled customers: ", value)
    if(value === '1') {
      //this.searchValue = "Active"
      console.log('filter the table by cancelled customers: ', value)
      //filter the table by cancelled customers
      let active = this.customerSearchListCentralStation.filter(x => x.customerStatus === 'Active');
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

  //*********SELECT Customer 1st*********//
  openSearchCustomerModal(content) {
    this.modalService.open(content, {
      size: 'lg',
      windowClass: 'modal-xl',
      centered: true,
      scrollable: true, 
      //windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    });

    this.spinnerService.show();

    this.siteName = '';
    this.incentiveDashboardForm.get('CustomerSiteID').setValue('');
    this.systemCode = '';
    this.incentiveDashboardForm.get('CustomerSystemID').setValue('');

    this.routeService.getCustomerSearchListDec14().subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
        }
        this.customerSearchListDec14 = res.body;

        // let full = this.customerSearchListDec14.filter(x => x.pendingCancel === 'Full');
        // console.log(full);
      }
    )
  }

  selectCustomer(customer_id:number, customer_Name:string, customer_Number:string, customerStatus:string, pendingCancel:string, collectionsStatus:string,e) {
    // console.log(this.divSiteSearchIcon.nativeElement);
    this.divSiteSearchIcon.nativeElement.style.display = 'none';
    this.divSystemSearchIcon.nativeElement.style.display = 'none';

    let selectedCustomerName = customer_Name;
    let selectedCustomerid = customer_id;
    let selectedCustomerNumber = customer_Number;
    
    this.customerStatus = customerStatus;
    this.pendingCancel = pendingCancel;
    this.collectionsStatus = collectionsStatus;

    this.customer = selectedCustomerNumber + ' - ' + selectedCustomerName;
    this.id = selectedCustomerid;
    this.incentiveDashboardForm.get("CustomerID").setValue(this.customer); // this is setting and passing the value 1234-5 John Doe, for example

    this.modalService.dismissAll();

    //focus Site
    this.siteElement.nativeElement.focus()

    this.routeService.getListSitesForCustomer(this.id).subscribe(
      res => {
        this.listsitesforcustomer = res;
        for(var i = 0; i < this.listsitesforcustomer.length; i++) {
          // console.log(this.listsitesforcustomer[i].siteName);
          // console.log(this.listsitesforcustomer[i].address_1);
          // console.log(this.listsitesforcustomer[i].customer_Site_id);
          // if there is only 1 site
          // if there is more than 1 site
          this.customer_Site_id = this.listsitesforcustomer[i].customer_Site_id;

          this.routeService.getListSystemsForSite(this.customer_Site_id).subscribe(
            res => {
              console.log(res);
              this.listSystemsForSite = res;
              if(this.listSystemsForSite.length === 0) {
                console.log('there are no systems')
                // this.routeService.getListSystemsForSite(1).subscribe(
                //   res => {
                //     console.log(res);
                //   }
                // )
              }

              for(var i = 0; i < this.listSystemsForSite.length; i ++) {
                // if(this.listSystemsForSite.length === 0) {
                //   console.log('there are no systems')
                // }
                console.log(this.listSystemsForSite[i].customer_System_id)
                //Get Customer_system_id for dbo.CustomerSystemInfoGet
                //this.customer_System_id = e.target.value;
                this.alarmAccount = this.listSystemsForSite[i].alarmAccount;
                this.systemTypeID = this.listSystemsForSite[i].systemType;
                this.customer_System_id = this.listSystemsForSite[i].customer_System_id;

                this.getAndDisplayCentralStationInfo();
                
                this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
                  res => {
                    console.log(res)
                    this.alarmAccount = '';
                    this.systemTypeID = '';
                    this.panelTypeID = '';
                    this.panel_Location = '';
                    this.centralStationID = '';
                    this.additionalInfo = '';

                    this.alarmAccount = res.accountNumber;
                    this.systemTypeID = res.systemType;
                    this.panelTypeID = res.panelType;
                    this.panel_Location = res.panelLocation;
                    this.centralStationID = res.centralStationID;
                    this.additionalInfo = res.additionalInfo;

                    this.incentiveDashboardForm.get("CustomerSystemID").setValue(this.customer_System_id);
                    this.incentiveDashboardForm.get("AlarmAccount").setValue(this.alarmAccount);
                  }
                )
              }
            }
          )
          this.incentiveDashboardForm.get("CustomerSiteID").setValue(this.customer_Site_id);
        }
      }
    )
  }

  onChangeSite(e){
    //focus System
    this.systemElement.nativeElement.focus()
    console.log(e.target.value)

    for(var i = 0; i < this.listsitesforcustomer.length; i++) {
      // console.log(this.listsitesforcustomer[i].customer_Site_id)
      // console.log(e.target.value)
      // this.customer_Site_id = 182015;
      this.alarmAccount = '';
      this.systemTypeID = '';
      this.panelTypeID = '';
      this.panel_Location = '';
      this.centralStationID = '';
      this.additionalInfo = '';

      this.customer_Site_id = parseInt(e.target.value);
      this.incentiveDashboardForm.get("CustomerSiteID").setValue(this.customer_Site_id);

      console.log(e.target.options[e.target.options.selectedIndex].text)
      this.customerSiteName = e.target.options[e.target.options.selectedIndex].text

      this.routeService.getListSystemsForSite(this.customer_Site_id).subscribe(
        res => {
          //console.log(res)
          this.listSystemsForSite = res;

          for(var i = 0; i < this.listSystemsForSite.length; i ++) {
            console.log(this.listSystemsForSite[i].customer_System_id)
            //Get Customer_system_id for dbo.CustomerSystemInfoGet
            //this.customer_System_id = e.target.value;
            this.alarmAccount = this.listSystemsForSite[i].alarmAccount;
            this.systemTypeID = this.listSystemsForSite[i].systemType;
            this.customer_System_id = this.listSystemsForSite[i].customer_System_id;
            
            this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
              res => {
                console.log(res)
                this.alarmAccount = res.accountNumber;
                this.systemTypeID = res.systemType;
                this.panelTypeID = res.panelType;
                this.panel_Location = res.panelLocation;
                this.centralStationID = res.centralStationID;
                this.additionalInfo = res.additionalInfo;
              }
            )
          }
        }
      )
    }
  }

  onChangeSystem(e) {
    console.log(e.target.value) 
    for(var i = 0; i < this.listSystemsForSite.length; i ++) {
      //console.log(this.listSystemsForSite[i].customer_System_id)
      //Get Customer_system_id for dbo.CustomerSystemInfoGet
      this.alarmAccount = '';
      this.systemTypeID ='';
      this.panelTypeID = '';
      this.panel_Location = '';
      this.centralStationID = '';
      this.additionalInfo = '';

      this.customer_System_id = parseInt(e.target.value);
      this.incentiveDashboardForm.get("CustomerSystemID").setValue(this.customer_System_id);

      console.log(e.target.options[e.target.options.selectedIndex].text)
      this.systemName = e.target.options[e.target.options.selectedIndex].text

      this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
        res => {
          // console.log(res)
          // console.log(res.accountNumber)
          //this.incentiveDashboardForm.get('AlarmAccount').setValue(res.alarmAccount)
          this.alarmAccount = res.accountNumber;
          this.systemTypeID = res.systemType;
          this.panelTypeID = res.panelType;
          this.panel_Location = res.panelLocation;
          this.centralStationID = res.centralStationID;
          this.additionalInfo = res.additionalInfo;
        }
      )
    }
  }

  openSearchSiteModal(site) {
    this.modalService.open(site, {
      // windowClass: 'my-class',
      size: 'lg',
      windowClass: 'modal-xl',
      centered: true,
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title'
    });

    this.spinnerService.show();
    
    this.routeService.getCustomerSearchListSite().subscribe(
      res => {
        if(res.status === 200) {
          this.spinnerService.hide();
        }
        this.customerSearchListSite = res.body;
        console.log(this.customerSearchListSite)
        for(var i = 0; i < this.customerSearchListSite.length; i++) {
          // console.log(this.customerSearchListSite[i])
        }
      }
    )
  }

  //*********SELECT Site 1st*********//
  selectSite(customer_id:number,customer_Name:string, siteName:string, customer_Site_Id:number,customer_Number:string) {
    this.divSystemSearchIcon.nativeElement.style.display='none';
    
    let selectedCustomerName = customer_Name;
    let selectedCustomerid = customer_id;
    let selectedSiteName = siteName;
    let selectedCustomerSiteId = customer_Site_Id;
    let selectedCustomerNumber = customer_Number;

    //push the selectedSiteName to the UI
    //once a site is selected, push the siteName to site on Incentive Entry
    this.id = selectedCustomerid;
    this.customerSiteId = selectedCustomerSiteId;
    this.siteName = selectedSiteName;
    this.customer = selectedCustomerName + ' - ' + selectedCustomerNumber;

    // localStorage.setItem("siteName", this.siteName);
    // localStorage.setItem("customerName", this.customer);

    this.modalService.dismissAll();

    this.routeService.getListSitesForCustomer(this.id).subscribe(
      res => {
        //console.log(res);
        this.listsitesforcustomer = res;
        for(var i = 0; i < this.listsitesforcustomer.length; i++) {
          // console.log(this.listsitesforcustomer[i])
          this.incentiveDashboardForm.controls["CustomerID"].setValue(this.customer);
        }
      }
    )

    this.getAndDisplayCentralStationInfo();

    //focus Site
    this.siteElement.nativeElement.focus()

  }

  openSearchSystemModal(system) {
    this.modalService.open(system, {
      // windowClass: 'my-class',
      size: 'lg',
      windowClass: 'modal-xl',
      centered: true,
      scrollable: true,
      ariaLabelledBy: 'modal-basic-title'
    });

    this.routeService.getCustomerSearchListCentralStation().subscribe(
      res => {
        this.customerSearchListCentralStation = res;
        // console.log(this.customerSearchListCentralStation)
        for(var i = 0; i < this.customerSearchListCentralStation.length; i++) {
          // console.log(this.customerSearchListCentralStation[i])
        }
      }
    )
  }

  //*********SELECT System/Central Station 1st*********//
  selectCentralStation(customer_id:number, customer_Site_Id:number, customer_System_Id:number, alarmAccount:string, system_Code: string, customer_Name:string, customer_Number:string) {
    let selectedCustomerid = customer_id;
    let selectedCustomerSiteId = customer_Site_Id;
    let selectedCustomerSystemId = customer_System_Id;
    let selectedAlarmAccount = alarmAccount;
    let selectedSystemCode = system_Code;
    let selectedCustomerName = customer_Name;
    let selectedCustomerNumber = customer_Number;

    this.id = selectedCustomerid;
    this.customerSystemId = selectedCustomerSystemId;
    this.alarmAccount = selectedAlarmAccount;
    this.customer_Number = selectedCustomerNumber;
    this.systemCode = selectedAlarmAccount + ' - ' + selectedSystemCode;
    this.customer = selectedCustomerName + ' - ' + selectedCustomerNumber;

    console.log(selectedCustomerSiteId);
    console.log(selectedAlarmAccount+' - '+selectedSystemCode)
    // this.isRemoveSystemDropdown=false
    // this.isSystemSelectionFirst=true
    // this.alarmAccountPreSelected=true

    this.modalService.dismissAll();

    this.routeService.getListSitesForCustomer(this.id).subscribe(
      res => {
        // console.log(res);

        this.listsitesforcustomer = res;
        this.customerPreselected=true

        for(var i = 0; i < this.listsitesforcustomer.length; i++) {
          // console.log(this.listsitesforcustomer[i].customer_Site_id)

          //focus Site
          this.siteElement.nativeElement.focus()

          //focus System

          // capture the chosen customer_Site_id
          // compare selectedCustomerSiteId vs
          // this.routeService.getListSystemsForSite(selectedCustomerSiteId).subscribe(
          //   res => {
          //     console.log(res)
          //     this.selectedValue = res
          //   }
          // )
        }
      }
    )
    
  }

  selectSystemsForCustomer(customersiteid:number) {
    this.routeService.getListSystemsForSite(this.customersiteid).subscribe(
      res => {
        //console.log(res)
      }
    )
  }

  // private getEventMessage(event: HttpEvent<any>, file:File) {
  //   switch(event.type) {
  //     case HttpEventType.Sent:
  //       return `Uploading file "${file.name}" of size ${file.size}.`;

  //       case HttpEventType.UploadProgress:
  //     // Compute and show the % done:
  //     const percentDone = Math.round(100 * event.loaded / event.total);
  //     return `File "${file.name}" is ${percentDone}% uploaded.`;

  //   case HttpEventType.Response:
  //     return `File "${file.name}" was completely uploaded!`;

  //   default:
  //     return `File "${file.name}" surprising upload event: ${event.type}.`;
  //   }
  // }

  // get f() {
  //   return this.incentiveDashboardForm.controls
  // }

  
  onSubmit(form: FormGroup) {

    this.submitted = true;

    // get environment from app component
    // app this.environment to Incentive_ADD_Start

    //Incentive_ADD_Start
    console.log('@UserEmailAddress:' + form.value.UserEmailAddress) // @UserEmailAddress NVarChar(50),
    if(localStorage.getItem('customer_Id')) {
      this.customer_id = localStorage.getItem('customer_Id');
      // console.log('@CustomerID:' + this.customer_id)
    } else {
      // console.log('@CustomerID:' + parseInt(this.id)) // @CustomerID Int,
    }
    // console.log('@CustomerID :' + parseInt(this.id)) // @CustomerID Int,
    //console.log(form.value.CustomerID) // @CustomerID Int, Get this instead of the id
    if(localStorage.getItem('customer_Site_Id')) {
      this.customer_Site_id = localStorage.getItem('customer_Site_Id')
      // console.log('@CustomerSiteID:' + this.customer_Site_id)
    } else {
      // console.log('@CustomerSiteID:' + parseInt(form.value.CustomerSiteID)) // @CustomerSiteID Int,
    }
    // console.log('@CustomerSiteID :' + parseInt(form.value.CustomerSiteID)) // @CustomerSiteID Int,

    if(localStorage.getItem('customer_System_Id')){
      this.customer_System_id = localStorage.getItem('customer_System_Id')
      // console.log('@CustomerSystemID:' + this.customer_System_id)
    } else {
      // console.log('@CustomerSystemID:' + parseInt(form.value.CustomerSystemID)) // @CustomerSystemID Int,
    }
    if(localStorage.getItem('panel_Type_Id')) {
      this.panelTypeID = localStorage.getItem('panel_Type_Id')
      // console.log('@PanelTypeID:' + this.panelTypeID)
    } else {
      // console.log('@PanelTypeID:' + parseInt(form.value.PanelTypeID)) // @PanelTypeID Int,
    }
    if(localStorage.getItem('central_Station_ID')) {
      this.centralStationID = localStorage.getItem('central_Station_ID')
      // console.log('@CentralStationID:' + this.centralStationID)
    } else {
      // console.log('@CentralStationID:' + parseInt(form.value.CentralStationID)) // @CentralStationID Int,
    }

    // //Replaces CustomerID with customer_id from the database instead of the customer_Name
    // this.incentiveDashboardForm.controls["CustomerID"].setValue(this.id);
    // this.incentiveDashboardForm.controls["CustomerID"].setValue(this.customer_id); //other way breaks if customer pre-selected
    if(localStorage.getItem('customer_Id')) {
      this.incentiveDashboardForm.controls["CustomerID"].setValue(parseInt(this.customer_id));
    } else {
      this.incentiveDashboardForm.controls["CustomerID"].setValue(this.id)
      // this.incentiveDashboardForm.controls["CustomerID"].setValue(this.customer_id); //other way breaks if customer pre-selected
    }
    if(localStorage.getItem('customer_Site_Id')) {
      this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(parseInt(this.customer_Site_id))
    } else {
      this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id);
    }
    // this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id);
    if(localStorage.getItem('customer_System_Id')) {
      this.incentiveDashboardForm.controls['CustomerSystemID'].setValue(parseInt(this.customer_System_id))
    } else {
      this.incentiveDashboardForm.controls['CustomerSystemID'].setValue(this.customer_System_id); //fix for error encountered on 06/23/2021
    }
    // this.incentiveDashboardForm.controls['CustomerSystemID'].setValue(this.customer_System_id); //fix for error encountered on 06/23/2021
    //this.incentiveDashboardForm.controls['SystemTypeID'].setValue(parseInt(form.value.SystemTypeID));
    if(localStorage.getItem('system_Id')) {
      this.incentiveDashboardForm.controls['SystemTypeID'].setValue(parseInt(this.system_Id))
    } else {
      this.incentiveDashboardForm.controls['SystemTypeID'].setValue(parseInt(form.value.SystemTypeID));
    }
    if(localStorage.getItem('panel_Type_Id')) {
      this.incentiveDashboardForm.controls['PanelTypeID'].setValue(parseInt(this.panelTypeID))
    } else {
      this.incentiveDashboardForm.controls['PanelTypeID'].setValue(parseInt(form.value.PanelTypeID));
    }
    // this.incentiveDashboardForm.controls['PanelTypeID'].setValue(parseInt(form.value.PanelTypeID));
    if(localStorage.getItem('central_Station_ID')) {
      this.incentiveDashboardForm.controls['CentralStationID'].setValue(parseInt(this.centralStationID))
    } 

    if(this.enrollInEmailInvoices === true) {
      // console.log(this.customerEmailAddress + '/Auto')
      this.customerEmailAddress = this.customerEmailAddress+'/Auto';
    }
    if(this.enrollInEmailInvoices === false) {
      // console.log('Just pass the customer email addressss')
    }

    // if the tax is Null, insert a zero value
    if(this.incentiveDashboardForm.get('PartnerTaxAmount').value == null) {
      this.incentiveDashboardForm.controls['PartnerTaxAmount'].setValue(0);
    }

    // confirm('Click ok to confirm form submission')

    this.spinnerService.show();

    // This gets executed 1st to return the required Job ID for the subsequent HTTP requests
    // begin switchmap

    var updateIncentiveAddFinishWithJobID = new Incentive_ADD_Finish();
    // updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
    // updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
    // updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
    // updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;

    var addToObject = function(obj, key, value) {
      var temp = {};
      var i = 0; for (var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
          if(i === key && value) {
            temp[key] = value;
          }
          temp[prop] = obj[prop];
          i++;
        }
      }
      if(key && value) {
        temp[key] = value;
      }
      return temp;
    }

    // INVOICE //
    this.frmData = new FormData();
    // 37 = Sandbox, 6 = Production
    this.frmData.append('company_id','37');
    this.frmData.append('customer_id', this.id);

    this.frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
    //this.frmData.append('customer_site_id',this.customerSiteId);
    
    this.frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
    //this.frmData.append('customer_system_id', this.customerSystemId.toString());

    this.frmData.append('job_id', this.job_id);
    //this.frmData.append('job_id', '19');
    this.frmData.append('security_level', this.security_level);

    //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
    this.frmData.append('file_name', this.file_name);
    this.frmData.append('file_size', this.file_size);
    // this.frmData.append('upload_date', this.invoiceDate);
    this.frmData.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date 
    this.frmData.append('document_ext', '*Contracts');
    this.frmData.append('user_code', 'TPC');
    //this.frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
    this.frmData.append('user_description', 'Invoice');
    this.frmData.append('reference1', null);
    this.frmData.append('reference2', null);
    this.frmData.append('reference3', null);
    this.frmData.append('reference4', null);
    this.frmData.append("file_data", this.selectedInvoiceFile);
    this.frmData.append('document_id', '1');

    // Display the key/value pairs
    console.log(Object.entries(this.frmData));//returns an empty array!
    var options = {content: this.frmData};

    // SITE VISIT //
    // 37 = Sandbox, 6 = Production
    this.frmData2 = new FormData();
    this.frmData2.append('company_id','37');

    // this.frmData2.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
    this.frmData2.append('customer_id', this.id);

    this.frmData2.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
    //this.frmData2.append('customer_site_id',this.customerSiteId);
    
    this.frmData2.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
    //this.frmData2.append('customer_system_id', this.customerSystemId.toString());

    this.frmData2.append('job_id', this.job_id);
    //this.frmData2.append('job_id', '19');
    this.frmData2.append('security_level', this.security_level);

    //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
    this.frmData2.append('file_name', this.site_visit_file_name);
    this.frmData2.append('file_size', this.site_visit_file_size);
    // this.frmData2.append('upload_date', this.invoiceDate);
    this.frmData2.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
    this.frmData2.append('document_ext', '*Contracts');
    this.frmData2.append('user_code', 'TPC');
    //this.frmData2.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
    this.frmData2.append('user_description', 'Site Visit');
    this.frmData2.append('reference1', null);
    this.frmData2.append('reference2', null);
    this.frmData2.append('reference3', null);
    this.frmData2.append('reference4', null);
    this.frmData2.append("file_data", this.selectedSiteVisitFile);
    // this.frmData2.append("file_data", this.myFiles.SiteVisit);
      // for(var i = 0; i < this.myFiles.length; i++) {
      //   console.log(this.myFiles[i])
      //   this.frmData2.append("file_data", this.myFiles[i]);
      // }
      // perform http request for each file
      //this.frmData2.append('@file_data', this.myFiles[i]);
    this.frmData2.append('document_id', '1');

    // CONTRACT //
    // 37 = Sandbox, 6 = Production
    this.frmData3 = new FormData();
    this.frmData3.append('company_id','37');

    // this.frmData3.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
    this.frmData3.append('customer_id', this.id);

    this.frmData3.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
    //this.frmData3.append('customer_site_id',this.customerSiteId);
    
    this.frmData3.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
    //this.frmData3.append('customer_system_id', this.customerSystemId.toString());

    this.frmData3.append('job_id', this.job_id);
    //this.frmData3.append('job_id', '19');
    this.frmData3.append('security_level', this.security_level);

    //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
    this.frmData3.append('file_name', this.contract_file_name);
    this.frmData3.append('file_size', this.contract_file_size);
    // this.frmData3.append('upload_date', this.invoiceDate);
    this.frmData3.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
    this.frmData3.append('document_ext', '*Contracts');
    this.frmData3.append('user_code', 'TPC');
    //this.frmData3.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
    this.frmData3.append('user_description', 'Contract');
    this.frmData3.append('reference1', null);
    this.frmData3.append('reference2', null);
    this.frmData3.append('reference3', null);
    this.frmData3.append('reference4', null);
    this.frmData3.append("file_data", this.selectedContractFile);
    // this.frmData3.append("file_data", this.myFiles.SiteVisit);
      // for(var i = 0; i < this.myFiles.length; i++) {
      //   console.log(this.myFiles[i])
      //   this.frmData3.append("file_data", this.myFiles[i]);
      // }
      // perform http request for each file
      //this.frmData3.append('@file_data', this.myFiles[i]);
    this.frmData3.append('document_id', '1');

    // SUBSCRIBER FORM //
    // 37 = Sandbox, 6 = Production
    this.frmData4 = new FormData();
    this.frmData4.append('company_id','37');

    // this.frmData4.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
    this.frmData4.append('customer_id', this.id);

    this.frmData4.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
    //this.frmData4.append('customer_site_id',this.customerSiteId);
    
    this.frmData4.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
    //this.frmData4.append('customer_system_id', this.customerSystemId.toString());

    this.frmData4.append('job_id', this.job_id);
    //this.frmData4.append('job_id', '19');
    this.frmData4.append('security_level', this.security_level);

    //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
    this.frmData4.append('file_name', this.subscriber_file_name);
    this.frmData4.append('file_size', this.subscriber_file_size);
    // this.frmData4.append('upload_date', this.invoiceDate);
    this.frmData4.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
    this.frmData4.append('document_ext', '*Contracts');
    this.frmData4.append('user_code', 'TPC');
    //this.frmData4.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
    this.frmData4.append('user_description', 'Subscriber Form');
    this.frmData4.append('reference1', null);
    this.frmData4.append('reference2', null);
    this.frmData4.append('reference3', null);
    this.frmData4.append('reference4', null);
    this.frmData4.append("file_data", this.selectedSubscriberFile);
    // this.frmData4.append("file_data", this.myFiles.SiteVisit);
      // for(var i = 0; i < this.myFiles.length; i++) {
      //   console.log(this.myFiles[i])
      //   this.frmData4.append("file_data", this.myFiles[i]);
      // }
      // perform http request for each file
      //this.frmData4.append('@file_data', this.myFiles[i]);
    this.frmData4.append('document_id', '1');

    // OTHER DOCUMENT 1 //
    // 37 = Sandbox, 6 = Production
    this.frmData5 = new FormData();
    this.frmData5.append('company_id','37');

    // this.frmData5.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
    this.frmData5.append('customer_id', this.id);

    this.frmData5.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
    //this.frmData5.append('customer_site_id',this.customerSiteId);
    
    this.frmData5.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
    //this.frmData5.append('customer_system_id', this.customerSystemId.toString());

    this.frmData5.append('job_id', this.job_id);
    //this.frmData5.append('job_id', '19');
    this.frmData5.append('security_level', this.security_level);

    //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
    this.frmData5.append('file_name', this.other_Document1_file_name);
    this.frmData5.append('file_size', this.other_Document1_file_size);
    // this.frmData5.append('upload_date', this.invoiceDate);
    this.frmData5.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
    this.frmData5.append('document_ext', '*Contracts');
    this.frmData5.append('user_code', 'TPC');
    //this.frmData5.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
    this.frmData5.append('user_description', 'Other Document 1');
    this.frmData5.append('reference1', null);
    this.frmData5.append('reference2', null);
    this.frmData5.append('reference3', null);
    this.frmData5.append('reference4', null);
    this.frmData5.append("file_data", this.selectedOtherDocument1File);
    // this.frmData5.append("file_data", this.myFiles.SiteVisit);
      // for(var i = 0; i < this.myFiles.length; i++) {
      //   console.log(this.myFiles[i])
      //   this.frmData5.append("file_data", this.myFiles[i]);
      // }
      // perform http request for each file
      //this.frmData5.append('@file_data', this.myFiles[i]);
    this.frmData5.append('document_id', '1');

    // OTHER DOCUMENT 2 //
    // 37 = Sandbox, 6 = Production
    this.frmData6 = new FormData();
    this.frmData6.append('company_id','37');

    // this.frmData6.append('customer_id', this.incentiveDashboardForm.get('CustomerID').value);
    this.frmData6.append('customer_id', this.id);

    this.frmData6.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
    //this.frmData6.append('customer_site_id',this.customerSiteId);
    
    this.frmData6.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
    //this.frmData6.append('customer_system_id', this.customerSystemId.toString());

    this.frmData6.append('job_id', this.job_id);
    //this.frmData6.append('job_id', '19');
    this.frmData6.append('security_level', this.security_level);

    //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
    this.frmData6.append('file_name', this.other_Document2_file_name);
    this.frmData6.append('file_size', this.other_Document2_file_size);
    // this.frmData6.append('upload_date', this.invoiceDate);
    this.frmData6.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
    this.frmData6.append('document_ext', '*Contracts');
    this.frmData6.append('user_code', 'TPC');
    //this.frmData6.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
    this.frmData6.append('user_description', 'Other Document 2');
    this.frmData6.append('reference1', null);
    this.frmData6.append('reference2', null);
    this.frmData6.append('reference3', null);
    this.frmData6.append('reference4', null);
    this.frmData6.append("file_data", this.selectedOtherDocument2File);
    // this.frmData6.append("file_data", this.myFiles.SiteVisit);
      // for(var i = 0; i < this.myFiles.length; i++) {
      //   console.log(this.myFiles[i])
      //   this.frmData6.append("file_data", this.myFiles[i]);
      // }
      // perform http request for each file
      //this.frmData6.append('@file_data', this.myFiles[i]);
    this.frmData6.append('document_id', '1');

    this.routeService.postIncentiveADDStartE(this.incentiveDashboardForm.value).pipe(
      tap(
        (res) => {
          this.job_id = res;
          //console.log(this.job_id);
          console.log('Invoice submission started!');
          this.flashMessage.show('Invoice submission started!', {
            cssClass: 'text-center alert-success',
            timeout: 5000
          });
        }
      ),
      map(() => this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value.forEach(r => {
        this.updateRecurringWithJobID = addToObject(r, 'IncentiveID', this.job_id);
        console.log(this.updateRecurringWithJobID)
        return this.routeService.postIncentive_Add_Recurring(this.updateRecurringWithJobID).subscribe(
          res => {
            //console.log(res);
            console.log('Processing Recurring!');
            this.flashMessage.show('Now Processing Recurring!', {
              cssClass: 'text-center alert-success',
              timeout: 5000
            });
          }
        )
      })),
      tap((res) => console.log('Recurring result: ', res)),
      map(() => this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value.forEach(r => {
        this.updateEquipMatWithJobID = addToObject(r, 'IncentiveID', this.job_id);
        console.log(this.updateEquipMatWithJobID)
        return this.routeService.postIncentive_Add_Equipment(this.updateEquipMatWithJobID).subscribe(
          res => {
            console.log(res);
            this.flashMessage.show('Now Processing Equipment + Materials!', {
              cssClass: 'text-center alert-success',
              timeout: 5000
            });
            console.log('Processing Equipment + Materials!');
          }
        )
      })),
      tap((res) => console.log('Equipment Mat result: ', res)),
      map(() => this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'].value.forEach(r => {
        this.updateLaborChargesWithJobID = addToObject(r, 'IncentiveID', this.job_id);
        console.log(this.updateLaborChargesWithJobID)
        return this.routeService.postIncentive_Add_Labor(this.updateLaborChargesWithJobID).subscribe(
          res => {
            console.log(res);
            this.flashMessage.show('Now Processing Labor Charges!', {
              cssClass: 'text-center alert-success',
              timeout: 5000
            });
            console.log('Processing Labor Charges!')
          }
        )
      })),
      tap((res) => console.log('Labor result: ', res)),
      switchMap(result => {
        // INVOICE //
        // 37 = Sandbox, 6 = Production
        this.frmData = new FormData();
        this.frmData.append('company_id','37');
        
        // this.frmData.append('customer_id', this.id);
        if(localStorage.getItem('customer_Id')) {
          this.id = parseInt(localStorage.getItem('customer_Id'));
          this.frmData.append('customer_id', this.id);
        } else {
          this.frmData.append('customer_id', this.id);
        }

        // this.frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        if(localStorage.getItem('customer_Site_Id')) {
          this.customer_Site_id = parseInt(localStorage.getItem('customer_Site_Id'));
          this.frmData.append('customer_site_id', this.customer_Site_id);
          // this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id)
        } else {
          this.frmData.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        }
        
        // this.frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        if(localStorage.getItem('customer_System_Id')) {
          this.customer_System_id = parseInt(localStorage.getItem('customer_System_Id'));
          this.frmData.append('customer_system_id', this.customer_System_id);
        } else {
          this.frmData.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        }

        this.frmData.append('job_id', this.job_id);
        //this.frmData.append('job_id', '19');
        this.frmData.append('security_level', this.security_level);

        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
        this.frmData.append('file_name', this.file_name);
        this.frmData.append('file_size', this.file_size);
        // this.frmData.append('upload_date', this.invoiceDate);
        this.frmData.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date 
        this.frmData.append('document_ext', '*Contracts');
        this.frmData.append('user_code', 'TPC');
        //this.frmData.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
        this.frmData.append('user_description', 'Invoice');
        this.frmData.append('reference1', null);
        this.frmData.append('reference2', null);
        this.frmData.append('reference3', null);
        this.frmData.append('reference4', null);
        this.frmData.append("file_data", this.selectedInvoiceFile);
        this.frmData.append('document_id', '1');

        // Display the key/value pairs
        console.log(Object.entries(this.frmData));//returns an empty array!
        var options = {content: this.frmData};

        updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
        updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
        updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
        //updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
        if(this.ticket_Number === null) {
          updateIncentiveAddFinishWithJobID.serviceTicketNumber = '0'
        }
        updateIncentiveAddFinishWithJobID.serviceTicketNumber = this.ticket_Number;
        if(this.customerEmailAddress == null || this.customerEmailAddress === '' || !this.customerEmailAddress || typeof this.customerEmailAddress == 'undefined') {
          updateIncentiveAddFinishWithJobID.customerEmailAddress = ''
        } else {
          updateIncentiveAddFinishWithJobID.customerEmailAddress = this.customerEmailAddress;
        }
        
        updateIncentiveAddFinishWithJobID.test = localStorage.getItem('signalsTested');

        if(!this.file_name) {
          console.log(this.file_name)
          return of(result)
        } else {
          return this.routeService.postCustomerDocumentADD(this.frmData).pipe(
            map(res => 
              console.log(res.type),
              this.flashMessage.show('Now Processing Submitted Invoice!', {
                cssClass: 'text-center alert-success',
                timeout: 5000
              })
              //console.log('Processing Invoice!')
            )

            // map(
            //   event => {
            //     if (event.type == HttpEventType.UploadProgress) {
            //       // this.barWidth = Math.round((100 / (event.total || 0) * event.loaded)) + "%";
            //       this.uploadText = 'Now uploading your invoice...'
            //     } else if (event.type == HttpEventType.Response) {
            //       // this.barWidth = "0%";
            //       this.uploadText = 'Processing...'
            //     }
            //   }
            // )
          )
        }
      }),
      switchMap(result => {
        // SITE VISIT //
        // 37 = Sandbox, 6 = Production
        this.frmData2 = new FormData();
        this.frmData2.append('company_id','37');

        // this.frmData2.append('customer_id', this.id);
        if(localStorage.getItem('customer_Id')) {
          this.id = parseInt(localStorage.getItem('customer_Id'));
          this.frmData2.append('customer_id', this.id);
        } else {
          this.frmData2.append('customer_id', this.id);
        }

        // this.frmData2.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        if(localStorage.getItem('customer_Site_Id')) {
          this.customer_Site_id = parseInt(localStorage.getItem('customer_Site_Id'));
          this.frmData2.append('customer_site_id', this.customer_Site_id);
          // this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id)
        } else {
          this.frmData2.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        }
        
        // this.frmData2.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        if(localStorage.getItem('customer_System_Id')) {
          this.customer_System_id = parseInt(localStorage.getItem('customer_System_Id'));
          this.frmData2.append('customer_system_id', this.customer_System_id);
        } else {
          this.frmData2.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        }

        this.frmData2.append('job_id', this.job_id);
        //this.frmData2.append('job_id', '19');
        this.frmData2.append('security_level', this.security_level);

        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
        this.frmData2.append('file_name', this.site_visit_file_name);
        this.frmData2.append('file_size', this.site_visit_file_size);
        // this.frmData2.append('upload_date', this.invoiceDate);
        this.frmData2.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
        this.frmData2.append('document_ext', '*Contracts');
        this.frmData2.append('user_code', 'TPC');
        //this.frmData2.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
        this.frmData2.append('user_description', 'Site Visit');
        this.frmData2.append('reference1', null);
        this.frmData2.append('reference2', null);
        this.frmData2.append('reference3', null);
        this.frmData2.append('reference4', null);
        this.frmData2.append("file_data", this.selectedSiteVisitFile);
        // this.frmData2.append("file_data", this.myFiles.SiteVisit);
          // for(var i = 0; i < this.myFiles.length; i++) {
          //   console.log(this.myFiles[i])
          //   this.frmData2.append("file_data", this.myFiles[i]);
          // }
          // perform http request for each file
          //this.frmData2.append('@file_data', this.myFiles[i]);
        this.frmData2.append('document_id', '1');

        updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
        updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
        updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
        // updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
        updateIncentiveAddFinishWithJobID.serviceTicketNumber = this.ticket_Number;
        if(this.customerEmailAddress == null || this.customerEmailAddress == '') {
          updateIncentiveAddFinishWithJobID.customerEmailAddress = ''
        }
        updateIncentiveAddFinishWithJobID.customerEmailAddress = this.customerEmailAddress;
        updateIncentiveAddFinishWithJobID.test = localStorage.getItem('signalsTested');

        if(!this.site_visit_file_name) {
          console.log(this.site_visit_file_name)
          return of(result)
        } else {
          return this.routeService.postCustomerDocumentADD(this.frmData2)
        }
      }),
      switchMap(result => {
        // CONTRACT //
        // 37 = Sandbox, 6 = Production
        this.frmData3 = new FormData();
        this.frmData3.append('company_id','37');

        // this.frmData3.append('customer_id', this.id);
        if(localStorage.getItem('customer_Id')) {
          this.id = parseInt(localStorage.getItem('customer_Id'));
          this.frmData3.append('customer_id', this.id);
        } else {
          this.frmData3.append('customer_id', this.id);
        }

        // this.frmData3.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        if(localStorage.getItem('customer_Site_Id')) {
          this.customer_Site_id = parseInt(localStorage.getItem('customer_Site_Id'));
          this.frmData3.append('customer_site_id', this.customer_Site_id);
          // this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id)
        } else {
          this.frmData3.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        }
        
        // this.frmData3.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        if(localStorage.getItem('customer_System_Id')) {
          this.customer_System_id = parseInt(localStorage.getItem('customer_System_Id'));
          this.frmData3.append('customer_system_id', this.customer_System_id);
        } else {
          this.frmData3.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        }

        this.frmData3.append('job_id', this.job_id);
        //this.frmData3.append('job_id', '19');
        this.frmData3.append('security_level', this.security_level);

        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
        this.frmData3.append('file_name', this.contract_file_name);
        this.frmData3.append('file_size', this.contract_file_size);
        // this.frmData3.append('upload_date', this.invoiceDate);
        this.frmData3.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
        this.frmData3.append('document_ext', '*Contracts');
        this.frmData3.append('user_code', 'TPC');
        //this.frmData3.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
        this.frmData3.append('user_description', 'Contract');
        this.frmData3.append('reference1', null);
        this.frmData3.append('reference2', null);
        this.frmData3.append('reference3', null);
        this.frmData3.append('reference4', null);
        this.frmData3.append("file_data", this.selectedContractFile);
        // this.frmData3.append("file_data", this.myFiles.SiteVisit);
          // for(var i = 0; i < this.myFiles.length; i++) {
          //   console.log(this.myFiles[i])
          //   this.frmData3.append("file_data", this.myFiles[i]);
          // }
          // perform http request for each file
          //this.frmData3.append('@file_data', this.myFiles[i]);
        this.frmData3.append('document_id', '1');

        updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
        updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
        updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
        // updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
        updateIncentiveAddFinishWithJobID.serviceTicketNumber = this.ticket_Number;
        if(this.customerEmailAddress == null || this.customerEmailAddress == '') {
          updateIncentiveAddFinishWithJobID.customerEmailAddress = ''
        }
        updateIncentiveAddFinishWithJobID.customerEmailAddress = this.customerEmailAddress;
        updateIncentiveAddFinishWithJobID.test = localStorage.getItem('signalsTested');

        if(!this.contract_file_name) {
          console.log(this.contract_file_name)
          return of(result)
        } else {
          return this.routeService.postCustomerDocumentADD(this.frmData3)
        }
      }),
      switchMap(result => {
        // SUBSCRIBER FORM //
        // 37 = Sandbox, 6 = Production
        this.frmData4 = new FormData();
        this.frmData4.append('company_id','37');

        // this.frmData4.append('customer_id', this.id);
        if(localStorage.getItem('customer_Id')) {
          this.id = parseInt(localStorage.getItem('customer_Id'));
          this.frmData4.append('customer_id', this.id);
        } else {
          this.frmData4.append('customer_id', this.id);
        }

        // this.frmData4.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        if(localStorage.getItem('customer_Site_Id')) {
          this.customer_Site_id = parseInt(localStorage.getItem('customer_Site_Id'));
          this.frmData4.append('customer_site_id', this.customer_Site_id);
          // this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id)
        } else {
          this.frmData4.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        }
        
        // this.frmData4.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        if(localStorage.getItem('customer_System_Id')) {
          this.customer_System_id = parseInt(localStorage.getItem('customer_System_Id'));
          this.frmData4.append('customer_system_id', this.customer_System_id);
        } else {
          this.frmData4.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        }

        this.frmData4.append('job_id', this.job_id);
        //this.frmData4.append('job_id', '19');
        this.frmData4.append('security_level', this.security_level);

        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
        this.frmData4.append('file_name', this.subscriber_file_name);
        this.frmData4.append('file_size', this.subscriber_file_size);
        // this.frmData4.append('upload_date', this.invoiceDate);
        this.frmData4.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
        this.frmData4.append('document_ext', '*Contracts');
        this.frmData4.append('user_code', 'TPC');
        //this.frmData4.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
        // this.frmData4.append('user_description', 'Subscriber Form');
        this.frmData4.append('user_description', 'Work Order');
        this.frmData4.append('reference1', null);
        this.frmData4.append('reference2', null);
        this.frmData4.append('reference3', null);
        this.frmData4.append('reference4', null);
        this.frmData4.append("file_data", this.selectedSubscriberFile);
        // this.frmData4.append("file_data", this.myFiles.SiteVisit);
          // for(var i = 0; i < this.myFiles.length; i++) {
          //   console.log(this.myFiles[i])
          //   this.frmData4.append("file_data", this.myFiles[i]);
          // }
          // perform http request for each file
          //this.frmData4.append('@file_data', this.myFiles[i]);
        this.frmData4.append('document_id', '1');

        updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
        updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
        updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
        // updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
        updateIncentiveAddFinishWithJobID.serviceTicketNumber = this.ticket_Number;
        if(this.customerEmailAddress == null || this.customerEmailAddress == '') {
          updateIncentiveAddFinishWithJobID.customerEmailAddress = ''
        }
        updateIncentiveAddFinishWithJobID.customerEmailAddress = this.customerEmailAddress;
        updateIncentiveAddFinishWithJobID.test = localStorage.getItem('signalsTested');

        if(!this.subscriber_file_name) {
          console.log(this.subscriber_file_name)
          return of(result)
        } else {
          return this.routeService.postCustomerDocumentADD(this.frmData4)
        }
      }),
      switchMap(result => {
        // OTHER DOCUMENT 1 //
        // 37 = Sandbox, 6 = Production
        this.frmData5 = new FormData();
        this.frmData5.append('company_id','37');

        // this.frmData5.append('customer_id', this.id);
        if(localStorage.getItem('customer_Id')) {
          this.id = parseInt(localStorage.getItem('customer_Id'));
          this.frmData5.append('customer_id', this.id);
        } else {
          this.frmData5.append('customer_id', this.id);
        }

        // this.frmData5.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        if(localStorage.getItem('customer_Site_Id')) {
          this.customer_Site_id = parseInt(localStorage.getItem('customer_Site_Id'));
          this.frmData5.append('customer_site_id', this.customer_Site_id);
          // this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id)
        } else {
          this.frmData5.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        }
        
        // this.frmData5.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        if(localStorage.getItem('customer_System_Id')) {
          this.customer_System_id = parseInt(localStorage.getItem('customer_System_Id'));
          this.frmData5.append('customer_system_id', this.customer_System_id);
        } else {
          this.frmData5.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        }

        this.frmData5.append('job_id', this.job_id);
        //this.frmData5.append('job_id', '19');
        this.frmData5.append('security_level', this.security_level);

        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
        this.frmData5.append('file_name', this.other_Document1_file_name);
        this.frmData5.append('file_size', this.other_Document1_file_size);
        // this.frmData5.append('upload_date', this.invoiceDate);
        this.frmData5.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
        this.frmData5.append('document_ext', '*Contracts');
        this.frmData5.append('user_code', 'TPC');
        //this.frmData5.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
        this.frmData5.append('user_description', 'Other Document 1');
        this.frmData5.append('reference1', null);
        this.frmData5.append('reference2', null);
        this.frmData5.append('reference3', null);
        this.frmData5.append('reference4', null);
        this.frmData5.append("file_data", this.selectedOtherDocument1File);
        // this.frmData5.append("file_data", this.myFiles.SiteVisit);
          // for(var i = 0; i < this.myFiles.length; i++) {
          //   console.log(this.myFiles[i])
          //   this.frmData5.append("file_data", this.myFiles[i]);
          // }
          // perform http request for each file
          //this.frmData5.append('@file_data', this.myFiles[i]);
        this.frmData5.append('document_id', '1');

        updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
        updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
        updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
        // updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
        updateIncentiveAddFinishWithJobID.serviceTicketNumber = this.ticket_Number;
        if(this.customerEmailAddress == null || this.customerEmailAddress == '') {
          updateIncentiveAddFinishWithJobID.customerEmailAddress = ''
        }
        updateIncentiveAddFinishWithJobID.customerEmailAddress = this.customerEmailAddress;
        updateIncentiveAddFinishWithJobID.test = localStorage.getItem('signalsTested');

        if(!this.other_Document1_file_name) {
          console.log(this.other_Document1_file_name)
          return of(result)
        } else {
          return this.routeService.postCustomerDocumentADD(this.frmData5)
        }
      }),
      switchMap(result => {
        // OTHER DOCUMENT 2 //
        // 37 = Sandbox, 6 = Production
        this.frmData6 = new FormData();
        this.frmData6.append('company_id','37');

        // this.frmData6.append('customer_id', this.id);
        if(localStorage.getItem('customer_Id')) {
          this.id = parseInt(localStorage.getItem('customer_Id'));
          this.frmData6.append('customer_id', this.id);
        } else {
          this.frmData6.append('customer_id', this.id);
        }

        // this.frmData6.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        if(localStorage.getItem('customer_Site_Id')) {
          this.customer_Site_id = parseInt(localStorage.getItem('customer_Site_Id'));
          this.frmData6.append('customer_site_id', this.customer_Site_id);
          // this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.customer_Site_id)
        } else {
          this.frmData6.append('customer_site_id', this.incentiveDashboardForm.get('CustomerSiteID').value);
        }
        
        // this.frmData6.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        if(localStorage.getItem('customer_System_Id')) {
          this.customer_System_id = parseInt(localStorage.getItem('customer_System_Id'));
          this.frmData6.append('customer_system_id', this.customer_System_id);
        } else {
          this.frmData6.append('customer_system_id', this.incentiveDashboardForm.get('CustomerSystemID').value);
        }

        this.frmData6.append('job_id', this.job_id);
        //this.frmData6.append('job_id', '19');
        this.frmData6.append('security_level', this.security_level);

        //This should be Invoice, SiteVisit, Contract, SubscriberForm, OtherDocument1, or OtherDocument2
        this.frmData6.append('file_name', this.other_Document2_file_name);
        this.frmData6.append('file_size', this.other_Document2_file_size);
        // this.frmData6.append('upload_date', this.invoiceDate);
        this.frmData6.append('upload_date', new Date().toISOString().slice(0, 19).replace('T',' ')); // get today's date
        this.frmData6.append('document_ext', '*Contracts');
        this.frmData6.append('user_code', 'TPC');
        //this.frmData6.append('user_description', this.file_name); // Needs to be Invoice, Site Visit, Contract, Subscriber Form, Other Document 1, or Other Document 2
        this.frmData6.append('user_description', 'Other Document 2');
        this.frmData6.append('reference1', null);
        this.frmData6.append('reference2', null);
        this.frmData6.append('reference3', null);
        this.frmData6.append('reference4', null);
        this.frmData6.append("file_data", this.selectedOtherDocument2File);
        // this.frmData6.append("file_data", this.myFiles.SiteVisit);
          // for(var i = 0; i < this.myFiles.length; i++) {
          //   console.log(this.myFiles[i])
          //   this.frmData6.append("file_data", this.myFiles[i]);
          // }
          // perform http request for each file
          //this.frmData6.append('@file_data', this.myFiles[i]);
        this.frmData6.append('document_id', '1');

        updateIncentiveAddFinishWithJobID.incentiveID = this.job_id;
        updateIncentiveAddFinishWithJobID.partnerTaxAmount = form.value.PartnerTaxAmount;
        updateIncentiveAddFinishWithJobID.serviceChecked = localStorage.getItem('serviceIncluded');
        // updateIncentiveAddFinishWithJobID.comments = form.value.PartnerComments;
        updateIncentiveAddFinishWithJobID.serviceTicketNumber = this.ticket_Number;
        //the customer's email address and not the partner's email
        if(this.customerEmailAddress == null || this.customerEmailAddress == '') {
          updateIncentiveAddFinishWithJobID.customerEmailAddress = ''
        }
        updateIncentiveAddFinishWithJobID.customerEmailAddress = this.customerEmailAddress;
        updateIncentiveAddFinishWithJobID.test = localStorage.getItem('signalsTested');
        
        if(!this.other_Document2_file_name) {
          console.log(this.other_Document2_file_name)
          return of(result)
        } else {
          return this.routeService.postCustomerDocumentADD(this.frmData6)
        }
      }),
      switchMap(result => 
        this.routeService.postIncentive_ADD_Finish(updateIncentiveAddFinishWithJobID).pipe(
        map(res => {

          console.log(res.status)

          // return window to top of page to display confirmation message to user
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          
          this.modalService.dismissAll();

          if(res.status === 200) {
            this.flashMessage.show('Your invoice was successfully uploaded', {
              cssClass: 'text-center alert-success',
              timeout: 5000
            })
            console.log(res.status);
            
            this.incentiveDashboardForm.disable();

            this.spinnerService.hide();

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
            localStorage.removeItem('results');
            localStorage.removeItem('customer_Id');
            localStorage.removeItem('customer_Site_Id');
            localStorage.removeItem('customer_System_Id');
            localStorage.removeItem('ticket_Number');
            localStorage.removeItem('customer_Number');
            localStorage.removeItem('customer_Name');
            localStorage.removeItem('business_Name');
            localStorage.removeItem('address_1');
            localStorage.removeItem('csAccount');
            localStorage.removeItem('panel_Location');
            localStorage.removeItem('centralStation');
            localStorage.removeItem('panel_Type_Id');
            localStorage.removeItem('central_Station_ID');
            localStorage.removeItem('system_Id');

            setTimeout(() => {
              this.router.navigate(['incentive-entry/']);  
            }, 5000);

          } else {
            this.flashMessage.show('There was a problem with your invoice upload', {
              cssClass: 'text-center alert-danger',
              timeout: 5000
            })
            console.log(res.status)
            this.spinnerService.hide();
          }
          
          console.log('Finished!...');
          this.spinnerService.hide();

          }, (err: HttpErrorResponse) => {
            alert(err + ' there was a problem. Please contact an administrator');
            this.flashMessage.show('There may have been a problem with your invoice submission. Please contact invoices@alarmconnections.com to confirm.', {
              cssClass: 'text-center alert-danger',
              timeout: 5000
            });
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
            localStorage.removeItem('results');
            localStorage.removeItem('customer_Id');
            localStorage.removeItem('customer_Site_Id');
            localStorage.removeItem('customer_System_Id');
            localStorage.removeItem('ticket_Number');
            localStorage.removeItem('customer_Number');
            localStorage.removeItem('customer_Name');
            localStorage.removeItem('business_Name');
            localStorage.removeItem('address_1');
            localStorage.removeItem('csAccount');
            localStorage.removeItem('panel_Location');
            localStorage.removeItem('centralStation');
            localStorage.removeItem('panel_Type_Id');
            localStorage.removeItem('central_Station_ID');
            localStorage.removeItem('system_Id');
            this.spinnerService.hide();
            this.router.navigate(['incentive-entry/']);
          })
        ))
      ).subscribe(res => {
        console.log(res)
      })
  }

  getFileData(e) {
    console.log(e);
    // get index for each file
    // parameters 0 - 6
  }

  removeDocumentsFromUIOnPageRefresh() {
    if(!this.incentiveDashboardForm.controls['InvoiceUpload'].valid) {
      //console.log('this invoice upload is INVALID');
      this.showInvoiceFile = false;
      localStorage.removeItem('invoiceName');
      localStorage.removeItem('invoiceFileSize');
    }
    if(this.incentiveDashboardForm.controls['InvoiceUpload'].valid) {
      console.log('this invoice upload is valid')
    }

    if(this.incentiveDashboardForm.get('SiteVisitUpload').value === "") {
      //console.log('this customer/site visit upload is INVALID');
      this.showSiteVisitFile = false;
      localStorage.removeItem('siteVisitName');
    }

    if(this.incentiveDashboardForm.get('ContractUpload').value === "") {
      //console.log('this contract upload is INVALID');
      this.showContractFile = false;
      localStorage.removeItem('contractName');
    }

    if(this.incentiveDashboardForm.get('SubscriberFormUpload').value === "") {
      //console.log('this subscriber/work order upload is INVALID');
      this.showSubscriberFormFile = false;
      localStorage.removeItem('subscriberFormName');
    }

    if(this.incentiveDashboardForm.get('OtherDocument1Upload').value == "") {
      //console.log('this other document 1 upload is INVALID');
      this.showOtherDocument1File = false;
      localStorage.removeItem('otherDocument1Name');
    }

    if(this.incentiveDashboardForm.get('OtherDocument2Upload').value == "") {
      //console.log('this other document 2 upload is INVALID');
      this.showOtherDocument2File = false;
      localStorage.removeItem('otherDocument2Name');
    }
  }

  //Test Invoice file upload
  getInvoiceFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      //console.log(e.target.files[i]);
      this.selectedInvoiceFile = e.target.files[0];

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        //console.log(reader.result);
        //localStorage.setItem("invoice", reader.result as string);

        // Show the name = false
        // Show 'No File Selected' = true
        // if the control is invalid, showInvoiceFile is false
        this.showInvoiceFile = true;
      });

      // var msg = this.invoiceUpload.replace(/Item:/g, "");
      // console.log(msg)

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

      //this.myFiles.push(e.target.files[i]);
      this.myFiles.Invoice = e.target.files[i];

    }
  }

  //Test Site Visit Form file upload
  getSiteVisitFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      this.selectedSiteVisitFile = e.target.files[0];

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        //localStorage.setItem("siteVisit", reader.result as string);
        this.showSiteVisitFile = true;
        console.log(this.showSiteVisitFile) //true
      });

      reader.readAsDataURL(e.target.files[i]);

      //get the file name
      this.site_visit_file_name = e.target.files[i].name;
      localStorage.setItem('siteVisitName', this.site_visit_file_name);
      //get the file size
      this.site_visit_file_size = e.target.files[i].size;

      this.myFiles.SiteVisit = e.target.files[i];
    }
  }

  //Test Contract Form file upload
  getContractFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      //console.log(e.target.files[i]);
      this.selectedContractFile = e.target.files[0];

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        //localStorage.setItem("contract", reader.result as string);
        this.showContractFile = true;
      });

      reader.readAsDataURL(e.target.files[i]);

      //get the file name
      this.contract_file_name = e.target.files[i].name;
      localStorage.setItem('contractName', this.contract_file_name);
      //get the file size
      this.contract_file_size = e.target.files[i].size;

      this.myFiles.Contract = e.target.files[i];
    }
  }

  //Test Subscriber Form file upload
  getSubscriberFileDetails(e) {
    //console.log(e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      //console.log(e.target.files[i]);
      this.selectedSubscriberFile = e.target.files[0];
      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        //localStorage.setItem("subscriberForm", reader.result as string);
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
      //console.log(this.subscriber_file_size)
      //this.invoiceDate = e.target.files[i].lastModified;

      //this.myFiles.push(e.target.files[i]);
      this.myFiles.SubForm = e.target.files[i];
    }
  }

   //Test Other Document 1 Form file upload
  getOtherDocument1FileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      //console.log(e.target.files[i]);
      this.selectedOtherDocument1File = e.target.files[0]

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        //localStorage.setItem("otherDocument1", reader.result as string);
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

      // this.myFiles.push(e.target.files[i]);
      this.myFiles.Other1 = e.target.files[i];
    }
  }

  //Test Other Document 2 Form file upload
  getOtherDocument2FileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      //push the files to the array
      //console.log(e.target.files[i]);
      this.selectedOtherDocument2File = e.target.files[0];

      //upload to localstorage
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        //localStorage.setItem("otherDocument2", reader.result as string);
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

      // this.myFiles.push(e.target.files[i]);
      this.myFiles.Other2 = e.target.files[i];
    }
  }

  removeInvoiceFile(){
    localStorage.removeItem('invoiceName');
    localStorage.removeItem('invoice');
    // this.divInvoice.nativeElement.value = '<p></p>';
    this.showInvoiceFile = false;
    this.invoiceUpload = '';
    this.incentiveDashboardForm.get('InvoiceUpload').reset();

    this.selectedInvoiceFile = {};

  }

  removeSiteVisitFile() {
    localStorage.removeItem('siteVisitName');
    localStorage.removeItem('siteVisit');
    // this.divSiteVisit.nativeElement.value = '';
    this.showSiteVisitFile = false;
    this.siteVisitUpload = '';
    this.incentiveDashboardForm.get('SiteVisitUpload').reset();

    this.selectedSiteVisitFile = {};
  }

  removeContractFile() {
    localStorage.removeItem('contractName');
    localStorage.removeItem('contract');
    // this.divContract.nativeElement.value = '';
    this.showContractFile = false;
    this.contractUpload = '';
    this.incentiveDashboardForm.get('ContractUpload').reset();
    this.incentiveDashboardForm.controls["ContractUpload"].setValidators(null);

    this.selectedContractFile = {};
  }

  removeSubscriberFormFile() {
    localStorage.removeItem('subscriberFormName');
    localStorage.removeItem('subscriberForm');
    // this.divSubscriberForm.nativeElement.value = '';
    this.showSubscriberFormFile = false;
    this.subscriberFormUpload = '';
    this.incentiveDashboardForm.get('SubscriberFormUpload').reset();

    this.selectedSubscriberFile = {};
  }

  removeOtherDocument1File() {
    localStorage.removeItem('otherDocument1Name');
    localStorage.removeItem('otherDocument1');
    // this.divOtherDocument1.nativeElement.value = '';
    this.showOtherDocument1File = false;
    this.otherDocument1Upload = '';
    this.incentiveDashboardForm.get('OtherDocument1Upload').reset();

    this.selectedOtherDocument1File = {};
  }

  removeOtherDocument2File() {
    localStorage.removeItem('otherDocument2Name');
    localStorage.removeItem('otherDocument2');
    // this.divOtherDocument2.nativeElement.value = '';
    this.showOtherDocument2File = false;
    this.otherDocument2Upload = '';
    this.incentiveDashboardForm.get('OtherDocument2Upload').reset();

    this.selectedOtherDocument2File = {};
  }

  onOpenDocumentsModal(documentUpload){
    this.modalService.open(documentUpload,
      {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'my-class950'
    });
  }

  getLineItemSubtotal() {
    console.log('get subtotal')
  }

  onSignalsTested(e) {
    // console.log(e.target.checked);//boolean
    // console.log(e.target.value)
    // console.log(e)
    if(e.target.value == 1) {
      console.log(e.target.value)
      // The signals were tested, pass a 'Y'
      this.signalsTested = 'Y';
      let newSignalTested = this.incentiveDashboardForm.controls['SignalsTested'].value;
      console.log(newSignalTested);
      localStorage.setItem("signalsTested", this.signalsTested);
    }
    if(e.target.value == 2) {
      console.log(e.target.value)
      // The signals were NOT tested, pass a 'N'
      this.signalsTested = 'N';
      let newSignalTested = this.incentiveDashboardForm.controls['SignalsTested'].value;
      console.log(newSignalTested);
      localStorage.setItem("signalsTested", this.signalsTested);
    }
    return
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
  }

  routeToNewSite() {
    console.log('go to new site');
  }

  routeToRecurring() {
    this.router.navigate(["incentive-recurring"]);
  }

  /****Recurring Modal */
  openRecurringModal(recurring) {
    this.modalService.open(recurring, {
      size: 'xl',
      windowClass: 'modal-xl',
      centered: true,
      scrollable: true,
      //windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getItemName(e:any,i:number) {
    //let currentID = e.target.value;

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
        controlArray.at(i).get('Description').setValue(string);
      });
      
      }, 4);
  }

  get r():FormArray {
    return this.incentiveRecurringEntryForm.get('entryRowsRecurring') as FormArray;
  }

  onRecurringSubmit(form: FormGroup) {
    
    const control = <FormArray>this.incentiveRecurringEntryForm.controls['entryRowsRecurring'];
    
    this.incentiveDashboardForm.get('LineItemSubtotal').setValue(this.totalSumRecurring);

    this.recurring = this.totalSumRecurring;

    localStorage.setItem('recurringentry',JSON.stringify(this.incentiveRecurringEntryForm.get('entryRowsRecurring').value))
    
    this.lineItemSubtotal = this.recurring + this.equipmentAndMaterials + this.laborCharges;

    //this.lineItemSubtotal = Number(this.lineItemSubtotal.toFixed(2));
    this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(this.lineItemSubtotal);

    this.modalService.dismissAll();
  }

  initEntryRow() {
    this.billingStartDate = moment('12-30-1899', 'DD-MM-YYYY');
    return this.fb.group({
      ItemID: [0, Validators.required],
      Description: ["", Validators.required],
      BillCycle: ["", Validators.required],
      RMR: [0, Validators.required],
      // PassThrough: ["", Validators.required],
      PassThrough: [this.passThrough, Validators.required],
      BillingStartDate: [this.billingStartDate, Validators.required],
      Add2Item: [0],
      Multiple: [25, Validators.required],
      Total: ["", Validators.required]
    })
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

    if(i == 0) {
      const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');
      controlArray.at(i).get('ItemID').setValue(0);
      controlArray.at(i).get('Description').setValue('');
      controlArray.at(i).get('BillCycle').setValue('');
      controlArray.at(i).get('RMR').setValue('');
      controlArray.at(i).get('PassThrough').setValue(this.passThrough);
      controlArray.at(i).get('BillingStartDate').setValue('');
      controlArray.at(i).get('Add2Item').setValue(0);
      controlArray.at(i).get('Multiple').setValue('');
      controlArray.at(i).get('Total').setValue('');
    }

    localStorage.removeItem("recurringentry");
    localStorage.removeItem("totalRecurringCalc");
  }

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
    this.modalService.open(content, 
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        windowClass: 'modal-xl',
        centered: true,
        scrollable: true,
        // windowClass: 'my-class'
      }).result.then((result) => {
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
    const control = <FormArray>this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'];

    this.incentiveDashboardForm.get('LineItemSubtotal').setValue(this.totalSumEquipMat);

    this.equipmentAndMaterials = this.totalSumEquipMat;
    console.log(this.incentiveEquipMatEntryForm.get('entryRowsEquipMat').value)
    localStorage.setItem('equipmatentry', JSON.stringify(this.incentiveEquipMatEntryForm.get('entryRowsEquipMat').value));

    this.lineItemSubtotal = this.recurring + this.equipmentAndMaterials + this.laborCharges;
    // console.log(Math.round(this.lineItemSubtotal).toFixed(2));
    // console.log(this.lineItemSubtotal.toFixed(2));
    // console.log(typeof this.lineItemSubtotal);
    console.log(this.equipmentAndMaterials.toFixed(2))
    //this.lineItemSubtotal = Number(this.lineItemSubtotal.toFixed(2));
    console.log(this.lineItemSubtotal)
    this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(this.lineItemSubtotal);

    this.modalService.dismissAll();
  }

  initEquipMatEntryRow() {
    return this.fb.group({
      ItemID: [0, Validators.required],
      Description: ["", Validators.required],
      Quantity: [0, Validators.required],
      Cost: [0, Validators.required],
      Total: ["", Validators.required]
    })
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
      controlArray.at(i).get('ItemID').setValue(0);
      controlArray.at(i).get('Description').setValue('');
      controlArray.at(i).get('Quantity').setValue('');
      controlArray.at(i).get('Cost').setValue('');
      controlArray.at(i).get('Total').setValue('');
    }

    localStorage.removeItem("equipmatentry");
    localStorage.removeItem("totalEquipMatCalc");
  }

  /****END Equipment & Materials Modal *********************************/

  /****Labor Charges Modal *********************************/
  openLaborChargesModal(content) {
    this.modalService.open(content, 
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        windowClass: 'modal-xl',
        centered: true,
        scrollable: true,
        // windowClass: 'my-class'
      }).result.then((result) => {
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getLaborChargesItemName(e:any,i:number) {
    //get the description from listrecurringitems based on the selected ItemID
    //console.log(e.target.value)//returns 'index: item_id', as a string
    //let currentID = e.target.value;
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
    const control = <FormArray>this.incentiveLaborChargesEntryForm.controls['entryRowsLaborCharges'];

    this.incentiveDashboardForm.get('LineItemSubtotal').setValue(this.totalSumLaborCharges);

    this.laborCharges = this.totalSumLaborCharges;

    localStorage.setItem('laborchargesentry', JSON.stringify(this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges').value));

    this.lineItemSubtotal = this.recurring + this.equipmentAndMaterials + this.laborCharges;
    
    this.incentiveDashboardForm.controls["LineItemSubtotal"].setValue(this.lineItemSubtotal);

    this.modalService.dismissAll();
  }

  initLaborChargesEntryRow() {
    return this.fb.group({
      ItemID: [0, Validators.required],
      Description: ["", Validators.required],
      Quantity: [0, Validators.required],
      Cost: [0, Validators.required],
      Total: ["", Validators.required]
    })
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

    if(i == 0) {
      const controlArray = <FormArray>this.incentiveLaborChargesEntryForm.get('entryRowsLaborCharges');
      controlArray.at(i).get('ItemID').setValue('');
      controlArray.at(i).get('Description').setValue('');
      controlArray.at(i).get('Quantity').setValue('');
      controlArray.at(i).get('Cost').setValue('');
      controlArray.at(i).get('Total').setValue('');
    }

    localStorage.removeItem("laborchargesentry");
    localStorage.removeItem("totalLaborChargesCalc");
  }
  /****END Labor Charges Modal *********************************/

  routeToEquipMaterials() {
    this.router.navigate(["incentive-equipment-materials"]);
  }

  routeToLaborCharges() {
    this.router.navigate(["incentive-labor-charges"]);
  }

  openAddViewCommentsModal(comments) {
    this.modalService.open(comments, {
      windowClass: 'my-class',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
      let newPartnerComments = this.incentiveDashboardForm.controls['PartnerComments'].value;
      localStorage.setItem("partnerComments", newPartnerComments);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    })
  }

  onPartnerCommentsSubmit(form: FormGroup) {
    this.incentiveDashboardForm.get('PartnerComments').setValue(this.partnerCommentsEntryForm.get('PartnerComments').value);

    this.modalService.dismissAll();
  }

  openValidateItemsModal(required,e) {
    //this.doSetCustomerIDSystemID();
    this.removeCustomerValidationIfSelected();
    this.verifyCustomerSiteSystem();
    this.verifySystemInformationSection();
    this.verifyInvoiceDoc();
    this.verifyCustomerVisitDoc();
    this.verifyContractDoc();
    this.verifyWorkOrderDoc();
    this.verifyContractTerms(e);
    this.verifyAddViewCommentsSignals();
    this.verifyAddViewCommentsSystem();
    this.verifyAddViewCommentsPanel();
    this.verifyAddNewRMRServiceBoxChecked();
    this.verifyLaborCharges();
    this.verifyOtherCharges();
    this.verifyPendingCancelCollectionsStatus();
    this.verifyCancelledCustomer();

    //calculate the total at each validation check as these totals could change
    this.calculateInvoiceTotal();

    // this is the text that will remind the user to check if signals were tested or not, regardless of partner or employee
    if(!this.incentiveDashboardForm.controls['SignalsTested'].valid) {
      this.signalsCheckedText = true;
    }
    if(this.incentiveDashboardForm.controls['SignalsTested'].valid) {
      this.signalsCheckedText = false;
    }
    

    if(this.incentiveDashboardForm.valid && this.partnerCommentsEntryForm.valid) {
      this.formIsValidText = true;
    }
    if(this.incentiveDashboardForm.invalid && this.partnerCommentsEntryForm.invalid) {
      this.formIsValidText = false;
    }

    this.modalService.open(required, {
      windowClass: 'my-class1050',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    })
  }

  verifyCustomerSiteSystem(){
    if(this.incentiveDashboardForm.controls['CustomerID'].valid) {
      // this.customerIDValidated = true;
      this.customerIDValidated = false;
      //this.systemInformationSectionValidated = true;
    }
    if(this.incentiveDashboardForm.controls['CustomerSiteID'].valid) {
      // this.customerSiteIDValidated = true;
      this.customerSiteIDValidated = false;
      //this.systemInformationSectionValidated = true;
    }
    if(this.incentiveDashboardForm.controls['CustomerSystemID'].valid) {
      // this.customerSystemIDValidated = true;
      this.customerSystemIDValidated = false;
      //this.systemInformationSectionValidated = true;
    }

    // If This is a new system checkbox is uncheck, display customerSystemIDValidated text
    // if(this.incentiveDashboardForm.controls['CustomerSystemID'].invalid) {
    //   // this.customerSystemIDValidated = true;
    //   this.customerSystemIDValidated = false;
    //   this.systemInformationSectionValidated = true;
    // }
  }

  verifySystemInformationSection() {
    let newSystemCheckbox = this.incentiveDashboardForm.controls['NewSystem'].value; 

    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
      console.log(newSystemCheckbox);
      if(newSystemCheckbox === true) {
        this.systemInformationSectionValidatedNonPartner = true;
      }
      if(newSystemCheckbox === false) {
        this.systemInformationSectionValidatedNonPartner = false;
      }
    }

    if(this.user.afaRole === 5) {
      let newSystemCheckbox = this.incentiveDashboardForm.controls['NewSystem'].value;

      let alarmAccountValue = this.incentiveDashboardForm.controls['AlarmAccount'].invalid; 
      let systemTypeIDValue = this.incentiveDashboardForm.controls['SystemTypeID'].invalid;
      let panelTypeValue = this.incentiveDashboardForm.controls['PanelTypeID'].invalid;
      let centralStationValue = this.incentiveDashboardForm.controls['CentralStationID'].invalid;

      
      console.log(newSystemCheckbox)
      if(newSystemCheckbox === true) {

        if(alarmAccountValue && systemTypeIDValue && panelTypeValue && centralStationValue) {
          this.systemInformationSectionValidated = true;
        }
        if(!alarmAccountValue || !systemTypeIDValue || !panelTypeValue || !centralStationValue) {
          this.systemInformationSectionValidated = false;
        }

        //this.systemInformationSectionValidated = true;
      }
      if(newSystemCheckbox === false) {
        this.systemInformationSectionValidated = false;
      }
    }
  }

  verifyInvoiceDoc() {
    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
      
      // the reactive form value InvoiceUpload should be valid to allow submission. 
      // the only requirement for anyone other than a Partner is the InvoiceUpload
      this.incentiveDashboardForm.get('InvoiceUpload').setErrors(null);
       
      if(this.incentiveDashboardForm.controls['InvoiceUpload'].valid) {
        this.invoiceDocValidatedNonPartner = false;
      }
      if(!this.incentiveDashboardForm.controls['InvoiceUpload'].valid) {
        this.invoiceDocValidatedNonPartner = true;
      }
      // if(!this.invoiceUpload) {
      //   this.invoiceDocValidatedNonPartner = true; 
      // }

      // if(this.invoiceUpload) {
      //   this.invoiceDocValidatedNonPartner = false; 
      // }
    }

    if(this.user.afaRole === 5) {
      if(this.incentiveDashboardForm.controls['InvoiceUpload'].valid) {
        this.invoiceDocValidated = false;
      }
      if(!this.incentiveDashboardForm.controls['InvoiceUpload'].valid) {
        this.invoiceDocValidated = true;
      }
    }

    // if(this.incentiveDashboardForm.controls['InvoiceUpload'].valid) {
    //   this.invoiceDocValidated = false;
    // }
    // if(this.incentiveDashboardForm.controls['InvoiceUpload'].value === null) {
    //   this.invoiceDocValidated = true;
    // }
  }

  verifyCustomerVisitDoc() {
    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {

      // the reactive form value SiteVisitUpload should be valid to allow submission. 
      // the only requirement for anyone other than a Partner is the InvoiceUpload
      //this.incentiveDashboardForm.get('SiteVisitUpload').setErrors(null);


      this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value.forEach(element => {
        if(element.ItemID === 610 || element.ItemID === 635) {
          this.customerVisitDocValidatedNonPartner = true;

          if(this.incentiveDashboardForm.controls['SiteVisitUpload'].value === null) {
            this.customerVisitDocValidatedNonPartner = true;
          }

        }
        if(element.ItemID === 0) {
          this.customerVisitDocValidatedNonPartner = false;
        }
      })

      if(this.incentiveDashboardForm.controls['SiteVisitUpload'].valid) {
        this.customerVisitDocValidatedNonPartner = false;
      }

    }

    if(this.user.afaRole === 5) {
      // the reactive form value SiteVisitUpload should get a valid state . 
      // this.incentiveDashboardForm.get('SiteVisitUpload').clearValidators();
      // this.incentiveDashboardForm.get('SiteVisitUpload').updateValueAndValidity();

      // if there is a recurring item, require a customer visit form
      // if there isn't a recurring item, do not require a customer visit form
      // if the recurring item was add and then removed, do not require a customer visit form
      // are ItemID 610 or 635 present?

      this.incentiveEquipMatEntryForm.controls['entryRowsEquipMat'].value.forEach(element => {
        if(element.ItemID === 610 || element.ItemID === 635) {
          this.incentiveDashboardForm.get('SiteVisitUpload').setValidators(Validators.required);
          this.incentiveDashboardForm.get('SiteVisitUpload').updateValueAndValidity();
          this.customerVisitDocValidated = true;

          if(this.incentiveDashboardForm.controls['SiteVisitUpload'].value === null) {
            this.customerVisitDocValidated = true;
          }

        }
        if(element.ItemID === 0) {
          this.customerVisitDocValidated = false;
        }
      })

      if(this.incentiveDashboardForm.controls['SiteVisitUpload'].valid) {
        this.customerVisitDocValidated = false;
      }
    }

  }

  checkForContractUploadNonPartner() {
    // if(this.contractUpload) {
    //   this.contractDocValidatedNonPartner = false;
    // }
    if(!!this.incentiveDashboardForm.get('ContractUpload').value) {
      this.contractDocValidated = false;
    }
  }

  checkForContractUpload() {
    // if(this.contractUpload) {
    //   this.contractDocValidated = false;
    // }
    if(!!this.incentiveDashboardForm.get('ContractUpload').value) {
      this.contractDocValidated = false;
    }
  }

  verifyContractDoc() {
    // if add rmr (modal) has more than 1 recurring item
    const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');

    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {

      // check if the form value is value or not valid
      // if ContractUpload value is valid, contractDocValidated value equals false
      // if ContractUpload value is invalid, contractDocValidated value equals true
      // if(this.incentiveDashboardForm.controls['ContractUpload'].value === null) {
      //   this.contractDocValidatedNonPartner = true
      // } 

      // if(this.incentiveDashboardForm.controls['ContractUpload'].valid) {
      //   this.contractDocValidatedNonPartner = false;
      // }

      this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value.forEach(element => {
        if(element.ItemID === 0) {
          this.contractDocValidatedNonPartner = false;
        }
        if(element.ItemID !== 0) {
          this.contractDocValidatedNonPartner = true;

          this.checkForContractUploadNonPartner();
        }
      })
    }

    if(this.user.afaRole === 5) {
  
      this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value.forEach(element => {
        if(element.ItemID === 0) {
          this.contractDocValidated = false;
        }
        if(element.ItemID !== 0) {
          this.contractDocValidated = true;

          this.checkForContractUpload();
        }
      });
    }
  }

  verifyWorkOrderDoc() {
    
    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
      if(this.ticket_Number || this.incentiveDashboardForm.controls['ServiceIncluded'].value === 'y') {
        this.workOrderDocValidatedNonPartner = true;
     }
 
     //if the work order upload exists, remove the validation text
     if(this.subscriberFormUpload) {
       this.workOrderDocValidatedNonPartner = false;
     }
    }

    if(this.user.afaRole === 5) {
      if(this.ticket_Number || this.incentiveDashboardForm.controls['ServiceIncluded'].value === 'y') {
        this.workOrderDocValidated = true;
     }
 
     //if the work order upload exists, remove the validation text
     if(this.subscriberFormUpload || this.incentiveDashboardForm.get('SubscriberFormUpload').value) {
      this.workOrderDocValidated = false;
    }
     //  if(this.subscriberFormUpload || this.incentiveDashboardForm.controls['SubscriberFormUpload'].valid) {
    //    this.workOrderDocValidated = false;
    //  }
    }

    // if(this.ticket_Number || this.incentiveDashboardForm.controls['ServiceIncluded'].value === 'y') {
    //    this.workOrderDocValidated = true;
    // }

    // //if the work order upload exists, remove the validation text
    // if(this.subscriberFormUpload) {
    //   this.workOrderDocValidated = false;
    // }
  }

  disableBackSpaceAndDelete(e) {
    if(e.keyCode === 8 || e.keyCode === 46) {
      e.preventDefault();
    }
  }

  getKeyPress(e) {
    const keyID = e.keyCode;
    switch(keyID)
    {
      case 8:
        // alert("backspace");
        // console.log(this.incentiveDashboardForm.get('ContractDate').value);
        // if the value of ContractDate is false, do something
        // the validation text cannot appear
        this.contractTermsValidatedNonPartner = true;
        break;
      case 46:
        // alert("delete");
        // console.log(this.incentiveDashboardForm.get('ContractDate').value);
        // if the value of ContractDate is empty or null, show the contractTermsValidatedNonPartner text
        if(this.incentiveDashboardForm.get('ContractDate').value === null || this.incentiveDashboardForm.get('ContractDate').value === "") {
          this.contractTermsValidated = true;
        }
        
        this.contractTermsValidatedNonPartner = true;
        break;
        default:
        break;
    }

    if(keyID === 8 || keyID === 46) {
      e.preventDefault();
    }

    console.log(e);
  }

  verifyContractTerms(e) {
    const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');
    
    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {

      this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value.forEach(element => {
        if(element.ItemID === 0) {
          this.contractTermsValidatedNonPartner = false;
        }

        if(element.ItemID !== 0) {
          this.contractTermsValidatedNonPartner = true;

          // check if the reactive form value ContractDate has been touched
          if(this.incentiveDashboardForm.controls['ContractDate'].touched && this.incentiveDashboardForm.get('ContractDate').value) {
            this.contractTermsValidatedNonPartner = false;

            // if the ContractDate has been manually removed, the validation text should be visible
            // get the keys for Delete and Backspace
            if(this.incentiveDashboardForm.get('ContractDate').value === null || this.incentiveDashboardForm.get('ContractDate').value === "") {
              this.contractInPastValidated = false;
            }
            
            this.getKeyPress(e);
          }
          
        }
      })
      
  
    }

    if(this.user.afaRole === 5) {

      this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value.forEach(element => {
        if(element.ItemID === 0) {
          this.contractTermsValidated = false;
        }

        // if entryrowsrecurring has a value, require contract date
        if(element.ItemID !== 0) {
          this.contractTermsValidated = true;
          this.incentiveDashboardForm.get("ContractDate").setValidators(Validators.required);
          this.incentiveDashboardForm.controls["ContractDate"].updateValueAndValidity();
        }

        // if entryrowsrecurring and contract date has a value, remove validation text and declare contract date valid
        if(element.ItemID !== 0 && this.incentiveDashboardForm.controls["ContractDate"].valid) {
          this.contractTermsValidated = false;
        }
        // if(element.ItemID !== 0 && this.incentiveDashboardForm.controls["ContractDate"].valid) {
        //   this.contractTermsValidated = true;
        // }
      })

      // if(controlArray.length > 1) {
      //   this.contractTermsValidated = true;
      //   this.incentiveDashboardForm.get("ContractDate").setValidators(Validators.required);
      //   this.incentiveDashboardForm.controls["ContractDate"].updateValueAndValidity();
      // }
  
      // if(this.incentiveDashboardForm.controls["ContractDate"].valid) {
      //   this.contractTermsValidated = false;
      // }
    }

    // if(controlArray.length > 1) {
    //   this.contractTermsValidated = true;
    //   // console.log('RMR items require a contract start date');
    //   this.incentiveDashboardForm.get("ContractDate").setValidators(Validators.required);
    //   this.incentiveDashboardForm.controls["ContractDate"].updateValueAndValidity();
    // }

    // if(this.incentiveDashboardForm.controls["ContractDate"].valid) {
    //   this.contractTermsValidated = false;
    // }
  }

  verifyAddViewCommentsSignals() {

    // If you check the option "Not All Signals Tested", you need to provide detail in the Comments section.

    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
      //resolve bug
      if(this.incentiveDashboardForm.controls['SignalsTested'].value === '2') {
        this.addViewCommentsSignalsValidatedNonPartner = true;

        //if there is a value present for PartnerComments, set the validity text to false
        if(this.partnerCommentsEntryForm.get('PartnerComments').value) {
          this.addViewCommentsSignalsValidatedNonPartner = false;
        }
      }
      if(this.incentiveDashboardForm.controls['SignalsTested'].value === '1') {
        this.addViewCommentsSignalsValidatedNonPartner = false;
        // the partner comments isn't a required item, so no action is required
      }
    }

    if(this.user.afaRole === 5) {
      if(this.incentiveDashboardForm.controls['SignalsTested'].value === '2') {
        // make the partner comments a required item
        this.partnerCommentsEntryForm.get('PartnerComments').setValidators(Validators.required);
        this.partnerCommentsEntryForm.controls['PartnerComments'].updateValueAndValidity();

        //console.log(this.incentiveDashboardForm.controls['PartnerComments'].status)
        this.incentiveDashboardForm.get('PartnerComments').setValidators(Validators.required);
        this.incentiveDashboardForm.controls['PartnerComments'].updateValueAndValidity();
        
        this.addViewCommentsSignalsValidated = true;

        if(this.partnerCommentsEntryForm.get('PartnerComments').value) {
          this.addViewCommentsSignalsValidated = false;
        }
      }
  
      if(this.incentiveDashboardForm.controls['SignalsTested'].value === '1') {
        this.addViewCommentsSignalsValidated = false;
        this.partnerCommentsEntryForm.get('PartnerComments').setErrors(null);
      }
    }

  }

  verifyAddViewCommentsSystem() {
    // You selected the System Type "Other". Please provide details in the Comments section.

    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
      
      if(this.incentiveDashboardForm.controls['SystemTypeID'].value === 98) {
        this.addViewCommentsSystemValidatedNonPartner = true;
      }
      if(this.incentiveDashboardForm.controls['SystemTypeID'].value !== 98) {
        
        this.addViewCommentsSystemValidatedNonPartner = false;
      }

    }

    if(this.user.afaRole === 5) {
      
      if(this.incentiveDashboardForm.controls['SystemTypeID'].value === 98) {
        this.incentiveDashboardForm.get('PartnerComments').setValidators(Validators.required);
        this.incentiveDashboardForm.controls['PartnerComments'].updateValueAndValidity();
        this.addViewCommentsSystemValidated = true;
      }
  
      if(this.incentiveDashboardForm.controls['PartnerComments'].value) {
        this.addViewCommentsSystemValidated = false;
      }

    }
  }

  verifyAddViewCommentsPanel() {
    // You selected the Panel Type "Other". Please provide details in the Comments section.
    // console.log('You selected the Panel Type "Other". Please provide details in the Comments section.');

    if(this.user.afaRole === 19 || this.user.afaRole === 14 || this.user.afaRole === 9) {
      
      if(this.incentiveDashboardForm.controls['PanelTypeID'].value === 675) {
        // this.incentiveDashboardForm.get('PartnerComments').setValidators(Validators.required);
        // this.incentiveDashboardForm.controls['PartnerComments'].updateValueAndValidity();
        
        this.addViewCommentsPanelValidatedNonPartner = true;
      }

      if(this.incentiveDashboardForm.controls['PanelTypeID'].value !== 675) {
        
        this.addViewCommentsPanelValidatedNonPartner = false;
      }

    }

    if(this.user.afaRole === 5) {

      if(this.incentiveDashboardForm.controls['PanelTypeID'].value === 675) {
        this.incentiveDashboardForm.get('PartnerComments').setValidators(Validators.required);
        this.incentiveDashboardForm.controls['PartnerComments'].updateValueAndValidity();
        this.addViewCommentsPanelValidated = true;
      }
  
      if(this.incentiveDashboardForm.controls['PartnerComments'].value) {
        this.addViewCommentsPanelValidated = false;
      }

      if(this.incentiveDashboardForm.controls['PanelTypeID'].value !== 675) {
        this.incentiveDashboardForm.controls["PanelTypeID"].valid;
        this.addViewCommentsPanelValidated = false;
        this.incentiveDashboardForm.get('PartnerComments').setErrors(null);
      }
    }

    // if(this.incentiveDashboardForm.controls['PanelTypeID'].value === '675') {
    //   this.incentiveDashboardForm.get('PartnerComments').setValidators(Validators.required);
    //   this.incentiveDashboardForm.controls['PartnerComments'].updateValueAndValidity();
    //   this.addViewCommentsPanelValidated = true;
    // }

    // if(this.incentiveDashboardForm.controls['PartnerComments'].value) {
    //   this.addViewCommentsPanelValidated = false;
    // }
  }

  verifyAddNewRMRServiceBoxChecked() {
    // Add RMR Section should have at least one entry

    const controlArray = <FormArray>this.incentiveRecurringEntryForm.get('entryRowsRecurring');

    this.incentiveRecurringEntryForm.controls['entryRowsRecurring'].value.forEach(element => {
      // console.log(element)
      if(element.ItemID === 0 && this.selectedForCheckBoxAutoInsert[6] === 'y') {

        // console.log('Display the validation text. The partner has not manually entered a recurring item');

        this.addNewRMRServiceBoxCheckedValidated = true;

        // if(this.selectedForCheckBoxAutoInsert[6] === 'y' && controlArray.length === 1) {

        //   this.addNewRMRServiceBoxCheckedValidated = true;
        // }
      }
      if(element.ItemID !== 0 || element.ItemID === '' && this.selectedForCheckBoxAutoInsert[6] === 'y') {

        // console.log('Remove the validation text. The partner has manually entered a recurring item');

        this.addNewRMRServiceBoxCheckedValidated = false;
        // if(this.selectedForCheckBoxAutoInsert[6] === 'y' && controlArray.length > 1) {

        //   this.addNewRMRServiceBoxCheckedValidated = false;
    
        // }
      }
    });

    // if(this.selectedForCheckBoxAutoInsert[6] === 'y' && controlArray.length === 1) {

    //   this.addNewRMRServiceBoxCheckedValidated = true;
    // }

    // if(this.selectedForCheckBoxAutoInsert[6] === 'y' && controlArray.length > 1) {

    //   this.addNewRMRServiceBoxCheckedValidated = false;

    // }
  }

  verifyLaborCharges() {
    if(this.ticket_Number || this.incentiveDashboardForm.controls['ServiceIncluded'].value === 'y') {
       // show  the error if the ticket number exists
       this.laborChargesValidated = true;
    }

    //if the work order upload exists, remove the validation text
    if(this.subscriberFormUpload) {
      this.laborChargesValidated = false;
    }
  }

  verifyOtherCharges() {
    if(this.ticket_Number || this.incentiveDashboardForm.controls['ServiceIncluded'].value === 'y') {
      // show  the error if the ticket number exists
      this.otherChargesValidated = true;
   }

   //if the work order upload exists, remove the validation text
   if(this.subscriberFormUpload) {
     this.otherChargesValidated = false;
   }
  }

  verifyPendingCancelCollectionsStatus() {
    if(this.pendingCancel === 'Full') {
      this.fullTextValidated = true;
      // console.log(this.pendingCancel);
    }
    if(this.pendingCancel === 'Partial') {
      this.partialTextValidated = true;
      // console.log(this.pendingCancel);
    }

    if(this.collectionsStatus) {
      // console.log('collections');
      this.collectionsStatusValidated = true;
    }
  }

  verifyCancelledCustomer() {
    if(this.customerStatus === 'Cancel') {
      this.customerStatusValidated = true;
    }

    if(this.customerStatus !== 'Cancel') {
      this.customerStatusValidated = false;
    }
  }

  onChangeSystemType(e) {
    console.log(e)
  }

  onClickRemoveSystemType(){
    this.systemTypeID = '';
    localStorage.removeItem('systemType');
    this.systemTypePreselected = false;
  }

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
