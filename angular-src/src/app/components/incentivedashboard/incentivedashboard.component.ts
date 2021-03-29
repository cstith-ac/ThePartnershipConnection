import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IncentiveDashboard } from '../../models/incentivedashboard';
import { IncentiveEntry } from '../../models/incentiveentry'; 
import { ListPanelTypes } from '../../models/listpaneltypes';
import { ListCentralStations } from '../../models/listcentralstations';
import { ListSitesForCustomer } from 'src/app/models/listsitesforcustomer';
import { ListSystemsForSite } from 'src/app/models/listsystemsforsite';
import { CustomerSearchList } from '../../models/customerseachlist';

@Component({
  selector: 'app-incentivedashboard',
  templateUrl: './incentivedashboard.component.html',
  styleUrls: ['./incentivedashboard.component.css']
})
export class IncentivedashboardComponent implements OnInit {
  @Input() incentiveEntryOutput:[];
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridData: CustomerSearchList[];
  public gridView: CustomerSearchList[];

  id;
  customersiteid;
  incentiveEntry: IncentiveEntry[];
  incentivedashboard:any[];
  listpaneltypes: ListPanelTypes[];
  listcentralstations: ListCentralStations[];
  listsitesforcustomer: ListSitesForCustomer[];
  listSystemsForSite: ListSystemsForSite[];
  customerSearchList: CustomerSearchList[];

  selectedValue: number;

  p: number = 1;
  searchValue:string;
  searchByCustomer:boolean;
  searchByBillingAddress:boolean;

  closeResult = '';
  incentiveEntryForm: FormGroup;
  recurringItemEntryForm: FormGroup;
  customer: string;
  site: '';
  system: '';
  newSystem: '';
  newCustomer: '';
  newSite: '';
  accountNumber: '';
  panelType: '';
  location: '';
  centralStation: '';
  additionalInfo: '';
  invoiceUpload: '';
  siteVisitUpload: '';
  contractUpload: '';
  subscriberFormUpload: '';
  otherDocument1Upload: '';
  otherDocument2Upload: '';
  invoiceNumber: '';
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
    private routeService: RouteService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) { 
    this.columns = ['Item', 'Description', 'Bill Cycle', 'RMR', 'Pass Through', 'Billing Starts', 'Add To An Existing RMR Item', 'Multiple', 'Total']
  }

  ngOnInit() {

    this.gridView = this.gridData;

    this.incentiveEntryForm = this.fb.group({
      Customer: ["", Validators.required],
      Site: ["", Validators.required],
      System: ["", Validators.required],
      NewSystem: ["", Validators.required],
      NewCustomer: ["", Validators.required],
      NewSite: ["", Validators.required],
      AccountNumber: ["", Validators.required],
      PanelType: ["", Validators.required],
      Location: ["", Validators.required],
      CentralStation: ["", Validators.required],
      AdditionalInfo: ["", Validators.required],
      InvoiceUpload: ["", Validators.required],
      SiteVisitUpload: ["", Validators.required],
      ContractUpload: ["", Validators.required],
      SubscriberFormUpload: ["", Validators.required],
      OtherDocument1Upload: ["", Validators.required],
      OtherDocument2Upload: ["", Validators.required],
      InvoiceNumber: ["", Validators.required],
      InvoiceTotal: ["", Validators.required],
      Tax: ["", Validators.required],
      Recurring: ["", Validators.required],
      EquipmentAndMaterials: ["", Validators.required],
      LaborCharges: ["", Validators.required],
      LineItemSubtotal: ["", Validators.required],
      StartDate: ["", Validators.required],
      Term: ["", Validators.required],
      SignalsTested: ["", Validators.required]
    })


    this.recurringItemEntryForm = this.fb.group({
      //table => item, description, bill cycle, rmr, pass through, billing starts, add to an existing rmr item, multiple, total
    })

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
        //this.gridData = res;
      }
    )

    // this.routeService.getListSystemsForSite(117019).subscribe(
    //   res => {
    //     this.listsystemsforsite = [].concat(res);
    //   }
    // )
  }

  public onFilter(inputValue: string): void {
    console.log(inputValue)
    this.gridView = process(this.gridData, {
        filter: {
            logic: "or",
            filters: [
                {
                    field: 'customer_Number',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'customer_Name',
                    operator: 'contains',
                    value: inputValue
                },
            ],
        }
    }).data;
    
    this.dataBinding.skip = 0;
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
    console.log(selectedCustomerName)
    console.log(selectedCustomerid);
    this.customer = selectedCustomerName
    this.id = selectedCustomerid
    //after selecting a customer, close the modal
    this.modalService.dismissAll();

    this.routeService.getListSitesForCustomer(this.id).subscribe(
      res => {
        this.listsitesforcustomer = [].concat(res);
      }
    )
  }

  //select System 1st
  //then select customer for site
  selectSite() {

  }

  //select Site 1st

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
    console.log('call this')
    //let id = val;
    console.log(this.id)
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
    console.log('call update system')
    //get the CustomerSiteID
    this.routeService.getListSystemsForSite(this.customersiteid).subscribe(
      res => {
        this.listSystemsForSite = [].concat(res);
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
    console.log(form.value.customer)
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
    //hit the api
    //select a result
    //populate the result on the main screen
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
