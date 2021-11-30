import { Component, OnInit, ViewChild, OnChanges, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, mergeAll, filter } from 'rxjs/operators';
import { ListMaterialItems } from '../../models/listmaterialitems';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { CustomerSearchList } from '../../models/customersearchlist';
import { CustomerSearchListSite } from '../../models/customersearchlistsite';
import { CustomerSearchListCentralStation } from 'src/app/models/customersearchlistcentralstation';
import { ListSitesForCustomer } from 'src/app/models/listsitesforcustomer';
import { ListSystemsForSite } from 'src/app/models/listsystemsforsite';

import { JwtHelperService } from '@auth0/angular-jwt';

import { RouteService } from '../../services/route.service';


@Component({
  selector: 'app-incentive-dashboard-test',
  templateUrl: './incentive-dashboard-test.component.html',
  styleUrls: ['./incentive-dashboard-test.component.css']
})
export class IncentiveDashboardTestComponent implements OnInit, OnDestroy {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('customerRef') customerElement: ElementRef;
  @ViewChild('siteRef') siteElement: ElementRef;
  @ViewChild('systemRef') systemElement: ElementRef;

  @ViewChild("customerSearchIcon") divCustomerSearchIcon: ElementRef;
  
  incentiveEquipMatEntryForm: FormGroup;

  selectIncentiveDashboardTestForm: FormGroup;
  incentiveDashboardTestForm: FormGroup;

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
  listSystemsForSite: ListSystemsForSite[];
  p: number = 1;
  searchValue:string;
  id;
  customer;
  results: any[] = [];
  customerNumber;
  customer_Site_id;
  customerSiteName;
  alarmAccount: string;
  systemTypeID: string;
  customer_System_id: number;
  panelTypeID: any;
  panel_Location: any;
  centralStationID: any;
  additionalInfo: any;

  isSystemDisabled = true;
  isSiteDisabled = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
  }

  ngOnDestroy():void {
    console.log('ngOnDestroy was called from: ' + this.activatedRoute.url)
    //this.recurringValueChanges$.unsubscribe();
    //this.laborChargesValueChanges$.unsubscribe();
    //this.equipMatValueChanges$.unsubscribe();
  }

  public placeholderq: string = 'Type a customer number...';
  public keyword = 'customerNumber';

  getServerResponse(event){
    console.log(parseInt(event))
    console.log(this.incentiveDashboardTestForm.controls["CustomerID"])
    this.incentiveDashboardTestForm.controls["CustomerID"].valueChanges
    .pipe(debounceTime(1000),distinctUntilChanged(),filter(x => typeof x === 'string'))
    // .subscribe(queryField  => this.routeService.getCustomerSearchMatch('1116-1417')
    .subscribe(queryField  => this.routeService.getCustomerSearchMatch(queryField)
    .subscribe(response => {
      console.log(response)
      this.results = response;
      let obj = response.find(e => e.customerName === e.customerName)
      for(var i = 0; i < response.length; i++) {
        console.log(response[i].customerID)
        var x = response[i].customerID;
        this.id = response[i].customerID;
        this.customerNumber = response[i].customerNumber;
        this.customer = response[i].customerName; //this is clearing the site entry when used with ngModel
        this.routeService.getListSitesForCustomer(x).subscribe(
          res => {
            //console.log(res);
            this.listsitesforcustomer = res;
            for(var i = 0; i < this.listsitesforcustomer.length; i++) {
              console.log(this.listsitesforcustomer[i])
              this.customer_Site_id = this.listsitesforcustomer[i].customer_Site_id;

               //set customerSiteName for ngbTooltip, SiteName + Address_1
              let customerSiteName = this.listsitesforcustomer[i].siteName;
              let address_1 = this.listsitesforcustomer[i].address_1;
              this.customerSiteName = customerSiteName + ' - ' + address_1;

              this.routeService.getListSystemsForSite(this.customer_Site_id)

              // this.routeService.getListSystemsForSite(this.customer_Site_id).subscribe(
              //   res => {
              //     console.log(res)
              //     this.listSystemsForSite = res;

              //     for(var i = 0; i < this.listSystemsForSite.length; i++) {
              //       console.log(this.listSystemsForSite[i].customer_System_id)

              //       this.alarmAccount = this.listSystemsForSite[i].alarmAccount;
              //       this.systemTypeID = this.listSystemsForSite[i].systemType;
              //       this.customer_System_id = this.listSystemsForSite[i].customer_System_id;

              //       this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
              //         res => {
              //           this.alarmAccount = res.accountNumber;
              //           this.systemTypeID = res.systemType;
              //           this.panelTypeID = res.panelType;
              //           this.panelLocation = res.panelLocation;
              //           this.centralStationID = res.centralStationID;
              //           this.additionalInfo = res.additionalInfo;
              //         }
              //       )
              //     }
              // })
            }
          }
        )
        //set state for CustomerSiteID as valid
        //this.incentiveDashboardTestForm.get("CustomerSiteID").setValidators(null);
        //this.incentiveDashboardTestForm.get("CustomerSiteID").updateValueAndValidity(); 
      }
    }
      )
    )
  }

  searchCleared(){
    console.log('searchCleared');
  }

  selectEvent(item) {
    console.log(item.customerID)
    this.incentiveDashboardTestForm.controls["CustomerID"].setValue(this.customerNumber+ " - " +this.customer)
  }

  onChangeSearch(val: string) {
    
  }

  onFocused(e){
    // here we can write our code for doing something when input is focused
  }

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

  //Select a Customer from modal instead of autocomplete
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
          console.log(this.listsitesforcustomer[i].customer_Site_id)

          this.incentiveDashboardTestForm.controls["CustomerID"].setValue(this.listsitesforcustomer[i].customer_Site_id)
          this.customer_Site_id = this.listsitesforcustomer[i].customer_Site_id
        }

        //get site
        //this.getSiteAfterCustomer()
        this.routeService.getListSystemsForSite(this.customer_Site_id).subscribe(
          res => {
            console.log(res)
            this.listSystemsForSite = res;
    
            for(var i = 0; i < this.listSystemsForSite.length; i++) {
              console.log(this.listSystemsForSite[i].customer_System_id)
    
              this.alarmAccount = this.listSystemsForSite[i].alarmAccount;
              this.systemTypeID = this.listSystemsForSite[i].systemType;
              this.customer_System_id = this.listSystemsForSite[i].customer_System_id;
    
              this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
                res => {
                  this.alarmAccount = res.accountNumber;
                  this.systemTypeID = res.systemType;
                  this.panelTypeID = res.panelType;
                  this.panel_Location = res.panelLocation;
                  this.centralStationID = res.centralStationID;
                  this.additionalInfo = res.additionalInfo;
                }
              )
            }
        })
      }
    )
  }

  getSiteAfterCustomer() {
    console.log('get site after customer')
    this.routeService.getListSitesForCustomer(this.customer_Site_id).subscribe(
      res => {
        console.log(res)
      }
    )
  }

  routeToNewCustomer() {
    console.log('routeToNewCustomer was clicked from incentive dashboard test')
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
