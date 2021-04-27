import { Component, OnInit, OnChanges, OnDestroy, AfterViewChecked, Input, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
import { AuthService } from '../../services/auth.service';
import { IncentiveEntryService } from '../../services/incentive-entry.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-incentivedashboard',
  templateUrl: './incentivedashboard.component.html',
  styleUrls: ['./incentivedashboard.component.css']
})
export class IncentivedashboardComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() incentiveEntryOutput:[];
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridData: CustomerSearchList[];
  public gridView: CustomerSearchList[];

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

  selectedValue: number;

  p: number = 1;
  searchValue:string;
  searchByCustomer:boolean;
  searchByBillingAddress:boolean;
  isSiteSelectionFirst: boolean = false;
  isSystemSelectionFirst: boolean = false;
  isRemoveDropdown: boolean = true;
  isRemoveSystemDropdown: boolean = true;
  serviceIncluded = 'Y';
  renewalMonths='12';
  customer_Site_id: any;
  customer_System_id:number;
  systemName: string;
  panel_Type_Id: number;
  panelName: string;

  closeResult = '';
  incentiveDashboardForm: FormGroup;
  recurringItemEntryForm: FormGroup;
  customer: string;
  siteName: string;
  customerSiteId: number;
  systemType: string;
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
  panelType: '';
  panelLocation: '';
  centralStationID: '';
  additionalInfo: '';
  invoiceUpload: '';
  siteVisitUpload: '';
  contractUpload: '';
  subscriberFormUpload: '';
  otherDocument1Upload: '';
  otherDocument2Upload: '';
  partnerInvoiceNumber: '';
  partnerInvoiceDate: '';
  invoiceTotal: '';
  tax: '';
  recurring: '';
  equipmentAndMaterials: '';
  laborCharges: '';
  lineItemSubtotal: '';
  startDate: '';
  term: '';
  signalsTested: '';

  customer_id;

  columns: string[];
  public mySelection: string[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private incentiveEntryService: IncentiveEntryService,
    public authService: AuthService,
    private routeService: RouteService,
    public jwtHelper: JwtHelperService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) { 
    this.columns = ['Item', 'Description', 'Bill Cycle', 'RMR', 'Pass Through', 'Billing Starts', 'Add To An Existing RMR Item', 'Multiple', 'Total']
  }

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('companyName');
      localStorage.removeItem('installCompanyID');
      localStorage.removeItem('partnerCode');
      this.router.navigate(["login"]);
    } else {
      console.log('your logged in')
    }

    //console.log(this.incentiveEntryService.sharedIncentiveInfo)//object

    //If there's a recurring, materials and equipment, and labor total in the service that's available...
    //then display in the total in the recurring, materials and equipment, and labor inputs
    const v = Object.keys(this.incentiveEntryService.sharedIncentiveRecurringInfo)[14];
    console.log(v)//object

    //get the company name and partner code from shared service
    // this.companyName = Object.values(this.incentiveEntryService.sharedIncentiveInfo)[0];
    this.companyName = localStorage.getItem('companyName');
    // this.partnerCode = Object.values(this.incentiveEntryService.sharedIncentiveInfo)[1];
    this.partnerCode = localStorage.getItem('partnerCode');
    this.installCompanyID = localStorage.getItem('installCompanyID');
    // console.log(Object.values(this.incentiveEntryService.sharedIncentiveInfo)[0])

    // for (let value of Object.values(this.incentiveEntryService.sharedIncentiveInfo)) {
    //   console.log(`${value}`);
    // }

    // for(let value of Object.values(this.incentiveEntryService.sharedIncentiveInfo)) {
    //   console.log(value);
    // }
    //let formValue = Object.fromEntries()

    // this.gridView = this.gridData;
    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        //console.log(this.userEmailAddress = JSON.parse(localStorage.getItem('user')).email)
      },
      err => {
        console.log(err)
      }
    )

    this.incentiveDashboardForm = this.fb.group({
      UserEmailAddress: this.userEmailAddress = JSON.parse(localStorage.getItem('user')).email, //@UserEmailAddress
      //CustomerID: this.id, //@CustomerID
      InstallCompanyID: this.installCompanyID = JSON.parse(localStorage.getItem('installCompanyID')),
      CustomerID: ["", Validators.required], //@CustomerID
      CustomerSiteID: ["", Validators.required], //@CustomerSiteID
      System: ["", Validators.required], //@CustomerSystemID
      SystemType: ["", Validators.required], //@SystemTypeID
      SystemCode: ["", Validators.required],
      NewSystem: ["", Validators.required],
      NewCustomer: ["", Validators.required],
      NewSite: ["", Validators.required],
      AlarmAccount: ["", Validators.required], //@AlarmAccount
      PanelType: ["", Validators.required], //@PanelTypeID
      PanelLocation: ["", Validators.required], //@PanelLocation
      CentralStationID: ["", Validators.required], //@CentralStationID
      AdditionalInfo: ["", Validators.required], //@AdditionalInfo
      InvoiceUpload: ["", Validators.required],
      SiteVisitUpload: ["", Validators.required],
      ContractUpload: ["", Validators.required],
      SubscriberFormUpload: ["", Validators.required],
      OtherDocument1Upload: ["", Validators.required],
      OtherDocument2Upload: ["", Validators.required],
      PartnerInvoiceNumber: ["", Validators.required], //@PartnerInvoiceNumber
      PartnerInvoiceDate: ["", Validators.required], //@PartnerInvoiceDate
      InvoiceTotal: ["", Validators.required],
      Tax: ["", Validators.required],
      Recurring: ["", Validators.required],
      EquipmentAndMaterials: ["", Validators.required],
      LaborCharges: ["", Validators.required],
      LineItemSubtotal: ["", Validators.required],
      ContractDate: ["", Validators.required], //@ContractDate
      ContractTerm: ["", Validators.required], //@ContractTerm
      RenewalMonths: [""], //@RenewalMonths
      ServiceIncluded: [""], //@ServiceInclude
      SignalsTested: ["", Validators.required],
      PartnerComments: [""] //@PartnerComments
    })


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

    // this.routeService.getListSystemsForSite(117019).subscribe(
    //   res => {
    //     this.listsystemsforsite = [].concat(res);
    //   }
    // )
  }

  ngAfterViewChecked() {
    //If there's a recurring, materials and equipment, and labor total in the service that's available...
    //then display in the total in the recurring, materials and equipment, and labor inputs 
    // for(var i = 0; i < this.incentiveEntryService.sharedIncentiveInfo; i++) {
    //   console.log(i)
    // }
    //console.log("ngAfterViewChecked was called from " + this.activatedRoute.url);
    //console.log(this.incentiveEntryService.sharedIncentiveRecurringInfo.value);
    // for(var item in this.incentiveEntryService.sharedIncentiveRecurringInfo) {
    //   console.log(item +" = "+this.incentiveEntryService.sharedIncentiveRecurringInfo[item])
    // }
  } 

  ngOnChanges(){
    //console.log('ngOnChange was called from ' + this.activatedRoute.url)
  }
  ngOnDestroy(){
    //console.log('ngOnDestroy was called ' + this.activatedRoute.url)
  }

  // public onFilter(inputValue: string): void {
  //   console.log(inputValue)
  //   this.gridView = process(this.gridData, {
  //       filter: {
  //           logic: "or",
  //           filters: [
  //               {
  //                   field: 'customer_Number',
  //                   operator: 'contains',
  //                   value: inputValue
  //               },
  //               {
  //                   field: 'customer_Name',
  //                   operator: 'contains',
  //                   value: inputValue
  //               },
  //           ],
  //       }
  //   }).data;
    
  //   this.dataBinding.skip = 0;
  // }

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
    console.log("Billing value is : ", value);
    if(value === 'on') {
      console.log('this value is on')
      //let the customer filter by Bill Address 1, Bill Address 2, or Bill Phone
    }
  }

  onItemChangeToSite(value) {
    console.log("Site value is : ", value);
    if(value === 'on') {
      console.log('this value is on')
      //let the customer filter by Site Address 1, Site Address 2, or Site Phone
    }
  }

  onItemChangeToCentralStation(value) {
    console.log("Central Station value is : ", value);
    if(value === 'on') {
      console.log('this value is on')
      //let the customer filter by Alarm Account
    }
  }

  //select Customer 1st
  selectCustomer(customer_id:number,customer_Name:string) {
    //If search by customer radio is selected, filter by customer_Number
    //If search by customer radio is selected, filter by customer_Name
    let selectedCustomerName = customer_Name;
    let selectedCustomerid = customer_id;
    //once a customer is selected, push the customer_Name to customer input on Incentive Entry
    // console.log(selectedCustomerName)
    // console.log(selectedCustomerid);
    this.customer = selectedCustomerName;
    this.id = selectedCustomerid;
    //after selecting a customer, close the modal
    this.modalService.dismissAll();

    this.routeService.getListSitesForCustomer(this.id).subscribe(
      res => {
        this.listsitesforcustomer = [].concat(res);

        //get the customer_Site_id
        // this.customer_Site_id = this.listsitesforcustomer[0].customer_Site_id;
        // //make a call to getListSystemsForSite
        // this.routeService.getListSystemsForSite(this.customer_Site_id).subscribe(
        //   res => {
        //     //get the customer_System_id
        //     //console.log(res.customer_System_id);
        //     this.customer_System_id = res.customer_System_id;
        //     //console.log(this.customer_System_id);
        //     //make a get request to dbo.CustomerSystemInfoGet
        //     this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
        //       res => {
                
        //         this.alarmAccount = res.accountNumber;
        //         this.systemType = res.systemType;
        //         //get the System_Id 
        //         //make a get request to dbo.ListSystemTypes to find the appropriate system type matching the returned systemType
        //         this.routeService.getListSystemTypes().subscribe(
        //           res => {
                    
        //             let result = res.filter(a => a.system_Id===this.systemType)
                    
        //             for(var i in result) {
                      
        //               this.systemName = result[i].systemName;
        //             }
        //           }
        //         )
        //         //populate the panel type

        //         //populate the central station
        //       }
        //     )
        //     //populate the fields for Account #, System Type, Panel Type, Panel Location, Central Station
        //   }
        // )
      }
    )

    //this.incentiveDashboardForm.value.CustomerID = this.id;
  }

  //select Site 1st
  selectSite(customer_id:number,customer_Name:string, siteName:string, customer_Site_Id:number) {
    let selectedCustomerName = customer_Name;
    let selectedCustomerid = customer_id;
    let selectedSiteName = siteName;
    let selectedCustomerSiteId = customer_Site_Id;

    console.log(selectedCustomerName)
    console.log(selectedCustomerid);
    console.log(selectedSiteName);
    console.log(selectedCustomerSiteId);
    //push the selectedSiteName to the UI
    //once a site is selected, push the siteName to site on Incentive Entry
    this.siteName = selectedSiteName;
    this.customer = selectedCustomerName;
    this.customerSiteId = selectedCustomerSiteId;
    this.modalService.dismissAll();

    this.isSiteSelectionFirst = !this.isSiteSelectionFirst;
    this.isRemoveDropdown = !this.isRemoveDropdown;
    //populate customer, populate system
    this.routeService.getListSystemsForSite(selectedCustomerSiteId).subscribe(
      res => {
        // if the site is selected 1st, get the CustomerSystemID.
        // Use the ID for the dbo.CustomerSystemInfoGet API call
        console.log(res.customer_System_id);
        this.customer_System_id = res.customer_System_id;

        this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
          res => {
            //console.log(res);
            this.alarmAccount = res.accountNumber
            this.systemType = res.systemType;
            this.panelType = res.panelType
            this.panelLocation = res.panelLocation
            this.centralStationID = res.centralStationID
          }
        )

        let alarmAccount = res.alarmAccount;
        let systemType = res.systemType
        console.log(alarmAccount);
        console.log(systemType);
        this.isSystemSelectionFirst = !this.isSystemSelectionFirst;
        this.isRemoveSystemDropdown = !this.isRemoveSystemDropdown;
        this.systemCode = alarmAccount + ' - ' + systemType;

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
      }
    )

    this.routeService.getCustomerSystemInfoGetByID(this.customerSystemId).subscribe(
      res => {
        //console.log(res);
        this.alarmAccount = res.accountNumber
        this.systemType = res.systemType;
        this.panelType = res.panelType
        this.panelLocation = res.panelLocation
        this.centralStationID = res.centralStationID
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
        console.log(res)
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
    console.log(customer_Site_id)
  }

  updateSystem(customer_Site_id:number) {
    //console.log('call update system')
    //get the CustomerSiteID
    this.routeService.getListSystemsForSite(this.customersiteid).subscribe(
      res => {
        this.listSystemsForSite = [].concat(res);
        console.log(typeof(this.listSystemsForSite))//object
        for(var i = 0; i < this.listSystemsForSite.length; i++) {
          this.customer_System_id = this.listSystemsForSite[i].customer_System_id;
        }

        //the customer is selected 1st
        //now populate the Account # field
        //make a get request to dbo.CustomerSystemInfoGet
        this.routeService.getCustomerSystemInfoGetByID(this.customer_System_id).subscribe(
          res => {
            console.log(res);
            this.alarmAccount = res.accountNumber
            this.systemType = res.systemType;
            this.panelType = res.panelType
            this.panelLocation = res.panelLocation
            this.centralStationID = res.centralStationID

            this.routeService.getListSystemTypes().subscribe(
              res => {
                console.log(res)
                let result = res.filter(a => a.system_Id===this.systemType)
                
                for(var i in result) {
                  
                  this.systemName = result[i].systemName;
                }
              }
            )

            this.routeService.getListPanelTypes().subscribe(
              res => {
                console.log(res) //object
                let result = res.filter(p => p.panel_Type_Id===this.panel_Type_Id)

                for(var i in result) {
                  this.panelName = result[i].panelName
                  console.log(this.panelType)
                }
              }
            )

            //this.routeService.getlistpa
          }
        )
      }
    )
  }

  private createForm(): void {
    this.recurringItemEntryForm = this.fb.group({
      //tableRowArray is a FormArray which holds a list of FormGroups
      tableRowArray: this.fb.array([
        this.createTableRow()
      ])
    })
  }

  private createTableRow(): FormGroup {
    return this.fb.group({
      item: new FormControl(null, {
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        validators: [Validators.required]
      }),
      billCycle: new FormControl(null, {
        validators: [Validators.required]
      }), 
      rmr: new FormControl(null, {
        validators: [Validators.required]
      }),
      passhrough: new FormControl(null, {
        validators: [Validators.required]
      }),
      billingStarts: new FormControl(null, {
        validators: [Validators.required]
      }),
      addToAnExistingRmrItem: new FormControl(null, {
        validators: [Validators.required]
      }),
      multiple: new FormControl(null, {
        validators: [Validators.required]
      }),
      total: new FormControl(null, {
        validators: [Validators.required]
      })
    })
  }

  onSubmit(form: FormGroup) {
    // Get the following values
    // @UserEmailAddress NVarChar(50),
    // @CustomerID Int,
    // @CustomerSiteID Int,
    // @CustomerSystemID Int,
    // @AlarmAccount NVarChar(50),
    // @SystemTypeID Int,
    // @PanelTypeID Int,
    // @PanelLocation NVarChar(50),
    // @CentralStationID Int,
    // @AdditionalInfo NVarChar(255),
    // @PartnerInvoiceNumber NVarChar(30),
    // @PartnerInvoiceDate DateTime,
    // @ContractDate DateTime,
    // @ContractTerm Int,
    // @ServiceIncluded NVarChar(2),
    // @PartnerComments NVarChar(1024)

    console.log('@UserEmailAddress :' +form.value.UserEmailAddress) // @UserEmailAddress NVarChar(50),
    console.log('@CustomerID :' + parseInt(this.id)) // @CustomerID Int,
    //console.log(form.value.CustomerID) // @CustomerID Int, Get this instead of the id
    console.log('@CustomerSiteID :' + parseInt(form.value.Site)) // @CustomerSiteID Int,
    console.log('@CustomerSystemID :' + parseInt(form.value.System)) // @CustomerSystemID Int,
    console.log('@AlarmAccount :' +form.value.AlarmAccount) // @AlarmAccount NVarChar(50),
    console.log('@SystemTypeID :' + parseInt(form.value.SystemType)) // @SystemTypeID Int,
    console.log('@PanelTypeID :' + parseInt(form.value.PanelType)) // @PanelTypeID Int,
    console.log('@PanelLocation :' +form.value.PanelLocation) // @PanelLocation NVarChar(50),
    console.log('@CentralStationID :' + parseInt(form.value.CentralStationID)) // @CentralStationID Int,
    console.log('@AdditionalInfo :' +form.value.AdditionalInfo) // @AdditionalInfo NVarChar(255),
    console.log('@PartnerInvoiceNumber :' +form.value.PartnerInvoiceNumber) // @PartnerInvoiceNumber NVarChar(30),
    console.log('@PartnerInvoiceDate :' +form.value.PartnerInvoiceDate) // @PartnerInvoiceDate DateTime,
    console.log('@ContractDate :' +form.value.ContractDate) // @ContractDate DateTime,
    console.log('@ContractTerm :' + parseInt(form.value.ContractTerm)) // @ContractTerm Int,

    //console.log(form.value.RenewalMonths) // @RenewalMonths Int,
    console.log('@RenewalMonths :' + parseInt(this.renewalMonths));
    //console.log(form.value.) // @ServiceIncluded NVarChar(2),
    console.log('@ServiceIncluded :' +this.serviceIncluded);

    console.log('@PartnerComments :' +form.value.PartnerComments) // @PartnerComments NVarChar(1024)

    //Replaces CustomerID with customer_id from the database instead of the customer_Name
    this.incentiveDashboardForm.controls["CustomerID"].setValue(this.id);
    this.incentiveDashboardForm.controls["CustomerSiteID"].setValue(this.siteName);
    // debugger
    // return

    // confirm('Click ok to confirm form submission')
    
    this.routeService.postIncentiveADDStart(this.incentiveDashboardForm.value).subscribe(
      result => {
        console.log(result)
      },
      //error => console.log('error: ', error);
    )
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
      console.log(result)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    })
  }

  // openRecurringModal(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     console.log(result)
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // openEquipMaterialsModal(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     console.log(result)
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

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
