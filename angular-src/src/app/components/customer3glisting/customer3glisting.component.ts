import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from '../../services/route.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Customer3GListing } from 'src/app/models/customer3glisting';
import { PermissionsUserMap } from 'src/app/models/permissionsusermap';
import {
  DataStateChangeEvent,
  ExcelCommandDirective,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  filterBy,
  process,
  State,
  SortDescriptor,
  orderBy,
} from '@progress/kendo-data-query';
import {
  Workbook,
  WorkbookSheetColumn,
  WorkbookSheet,
  WorkbookSheetRow,
  WorkbookSheetRowCell,
  WorkbookSheetFilter,
  WorkbookOptions,
  workbookOptions,
} from '@progress/kendo-angular-excel-export';
import { saveAs } from '@progress/kendo-file-saver';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
declare var $: any;

@Component({
  selector: 'app-customer3glisting',
  templateUrl: './customer3glisting.component.html',
  styleUrls: ['./customer3glisting.component.css'],
})
export class Customer3glistingComponent implements OnInit {
  customer3gListing: Customer3GListing[];
  customer3gListingForm: FormGroup;
  emailAddress;

  address_1;
  address_2;
  address_3;
  alarm_Account;
  carrier;
  cellGeneration;
  cellModel;
  cellType;
  city;
  customerEmail;
  customerPhone;
  customerType;
  customer_Name;
  customer_Number;
  customer_System_Id;
  offer1;
  offer2;
  offer3;
  offer4;
  panel_Location;
  panel_Type_Code;
  rmrAtCustomer;
  rmrAtSite;
  rmrAtSystem;
  siteName;
  sitePhone;
  site_Number;
  state_3g;
  system_Code;
  zipCode;

  userName;
  permissionsUserMap: PermissionsUserMap[];
  hide3GExcelExport: boolean = false;
  sedonaContactEmail;
  partnerName;

  public columns: any[] = [
    { field: 'Alarm Account' },
    { field: 'CustomerNumber' },
    { field: 'CustomerName' },
    { field: 'CustomerType' },
    { field: 'CustomerType' },
    { field: 'SiteName' },
    { field: 'SiteNumber' },
    { field: 'Address1' },
    { field: 'Address2' },
    { field: 'City' },
    { field: 'State' },
    { field: 'ZipCode' },
    { field: 'PanelTypeCode' },
    { field: 'PanelLocation' },
    { field: 'SystemCode' },
    { field: 'CellType' },
    { field: 'CellGeneration' },
    { field: 'CellModel' },
    { field: 'Offer1' },
    { field: 'Offer2' },
    { field: 'Offer3' },
    { field: 'Offer4' },
    { field: 'RMRatCustomer' },
    { field: 'RMRatSite' },
    { field: 'RMRatSystem' },
  ];
  public gridData: any[];
  public pageSize: number = 5;
  public fileName: string;
  public today = new Date().toDateString();
  public selectedKeys = [];

  clicked = false; //disables button after click
  hideShowBackButtonEl: boolean = false;

  @ViewChild('dateTime') dateTimeView: ElementRef;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private routeService: RouteService,
    private spinnerService: NgxSpinnerService,
    private authService: AuthService,
    public permissionService: PermissionsService
  ) {
    this.gridData = this.customer3gListing;
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    if (
      localStorage.getItem('sedonaContactEmail') &&
      localStorage.getItem('partnerName')
    ) {
      this.sedonaContactEmail = localStorage.getItem('sedonaContactEmail');
      this.partnerName = localStorage.getItem('partnerName');
    }

    $('#wrapper').addClass('toggled');

    const workbook = new Workbook({
      sheets: [
        {
          columns: [],
          name: 'RBLX',
          rows: [
            {
              cells: [
                {
                  value: 'My Company',
                  fontSize: 32,
                  textAlign: 'center',
                },
              ],
            },
          ],
        },
      ],
    });
    var foo = workbook.options;
    var item = foo.sheets.find((x) => x.name);
    var today = item.name;
    
    this.spinnerService.show();

    if (this.sedonaContactEmail) { 
      // use SwitchMap to get profile then permissions user map
      this.authService
        .getProfile()
        .pipe(
          mergeMap((res: any) =>
            this.permissionService.getPermissionsUserMap(
              this.sedonaContactEmail
            )
          )
        )
        .subscribe((data) => {
          this.permissionsUserMap = data;
          // if the partner does not have Export to Excel in the AC view, grant permission
          this.permissionsUserMap.forEach((x) => {
            if(x.hasPermission === 'N') {
              x.hasPermission = 'Y'
            }
          })
          //show/hide card or card and button base on hasPermission value of Y or N
          for (let i = 0; i < this.permissionsUserMap.length; i++) {
            if (
              this.permissionsUserMap[i].permissionName === '3G Excel Export' &&
              this.permissionsUserMap[i].hasPermission === 'Y'
            ) {
              this.hide3GExcelExport = true;
            }
          }
        });
      this.authService
        .getProfile()
        .pipe(
          mergeMap((res: any) =>
            this.routeService.getCustomer3GListingX(
              res.userName,
              this.sedonaContactEmail
            )
          )
        )
        .subscribe((data) => {
          if (data.status === 200) {
            this.spinnerService.hide();
          }
          this.customer3gListing = data.body;
          this.gridData = data.body;
        });
    }
    if (!this.sedonaContactEmail) {
      this.authService
        .getProfile()
        .pipe(
          mergeMap((res: any) =>
            this.permissionService.getPermissionsUserMap(res.userName)
          )
        )
        .subscribe((data) => {
          this.permissionsUserMap = data;

          for (let i = 0; i < this.permissionsUserMap.length; i++) {
            if (
              this.permissionsUserMap[i].permissionName === '3G Excel Export' &&
              this.permissionsUserMap[i].hasPermission === 'Y'
            ) {
              console.log('this works');
              this.hide3GExcelExport = true;
            }
          }
        });
      this.routeService.getCustomer3GListing().subscribe((res) => {
        if (res) {
          this.spinnerService.hide();
        }
        this.gridData = res;
      });
    }

    this.customer3gListingForm = this.fb.group({
      EmailAddress: (this.emailAddress = JSON.parse(
        localStorage.getItem('user')
      ).email),
      NoteType: '3G',
      Memo: '',
      ServiceTicketID: 1,
      CustomerID: 1,
      IncentiveID: 1,
      CancelQueueID: 1,
      ProspectID: 1,
      CustomerSystemID: '',
    });
  }

  load3GList() {
    this.routeService.getCustomer3GListing().subscribe((res) => {
      this.gridData = res;
    });
  }

  public state: State = {
    skip: 0,
    take: 5,
  };

  public filter: CompositeFilterDescriptor;
  public sort: SortDescriptor[];

  public columnsConfig: [
    {
      title: 'date';
    }
  ];

  public dataStateChange(state: DataStateChangeEvent) {
    console.log('change');
  }

  public workbook() {
    const workbook = new Workbook({
      sheets: <WorkbookSheet[]>[
        {
          columns: <WorkbookSheetColumn[]>[
            { autoWidth: true },
            { autoWidth: true },
          ],
          name: new Date().toDateString(),
          rows: <WorkbookSheetRow[]>[
            // First row (header)
            {
              cells: <WorkbookSheetRowCell[]>[
                { value: new Date().toDateString() },
                { value: 'Alarm Account' },
                { value: 'Customer Number' },
                { value: 'Customer Name' },
                { value: 'Customer Type' },
                { value: 'Site Name' },
                { value: 'Site Number' },
                { value: 'Address 1' },
                { value: 'Address 2' },
                { value: 'City' },
                { value: 'State' },
                { value: 'Zip Code' },
                { value: 'Panel Type Code' },
                { value: 'Panel Location' },
                { value: 'System Code' },
                { value: 'Cell Type' },
                { value: 'Cell Generation' },
                { value: 'Cell Model' },
                { value: 'Carrier' },
                { value: 'Offer 1' },
                { value: 'Offer 2' },
                { value: 'Offer 3' },
                { value: 'Offer 4' },
                { value: 'RMR At Customer' },
                { value: 'RMR At Site' },
                { value: 'RMR At System' },
              ],
            },
            // Second row (data)
            {
              cells: <WorkbookSheetRowCell[]>[
                { value: 'alarm_Account', fontSize: '14px', color: 'red' },
                { value: 'customer_Name' },
                { value: 'customerType' },
                { value: 'siteName' },
                { value: 'address_1' },
                { value: 'city' },
                { value: 'state' },
                { value: 'zipCode' },
                { value: 'panel_Type_Code' },
                { value: 'system_Code' },
                { value: 'cellType' },
                { value: 'cellGeneration' },
                { value: 'cellModel' },
                { value: 'carrier' },
                { value: 'rMRAtCustomer' },
              ],
            },
          ],
        },
      ],
    });
    workbook.toDataURL().then((dataUrl) => {
      saveAs(dataUrl, 'customer3glisting.xlsx');
    });
  }

  public exportNewWorkbook() {
    const workbook = new Workbook({
      sheets: <WorkbookSheet[]>[
        {
          // Column settings (width)
          columns: <WorkbookSheetColumn[]>[
            { autoWidth: true },
            { autoWidth: true },
          ],
          // Title of the sheet
          name: new Date().toDateString(), // edit: non trivial filename
          // Rows of the sheet
          rows: <WorkbookSheetRow[]>[
            // First row (header)
            {
              cells: <WorkbookSheetRowCell[]>[
                // First cell
                { value: 'Alarm Account' },
                // Second cell
                { value: 'Customer Number' },
              ],
            },
            // Second row (data)
            {
              cells: <WorkbookSheetRowCell[]>[
                { value: 'Around the Horn' },
                { value: 'Thomas Hardy' },
              ],
            },
            // Third row (data)
            {
              cells: <WorkbookSheetRowCell[]>[
                { value: 'B Beverages' },
                { value: 'Victoria Ashworth' },
              ],
            },
          ],
          filter: <WorkbookSheetFilter>{
            // edit: added auto filter
            from: 0,
            to: 1,
          },
        },
      ],
    });
    workbook.toDataURL().then((dataUrl) => {
      saveAs(dataUrl, 'customer3glisting.xlsx');
    });
  }

  saveDateTime() {
    this.fileName = 'customer3glisting.xlsx';
    const workbook = new Workbook({
      sheets: [
        {
          name: new Date().toDateString(),
        },
      ],
    });

    const worksheet = workbook.options;

    console.log(workbook.options);
    var foo = workbook.options;
    var item = foo.sheets.find((x) => x.name);
    var today = item.name;
    console.log(today);

    workbook.toDataURL().then((dataUrl) => {
      saveAs(dataUrl, 'customer3glisting.xlsx');
    });
  }

  public mySelection: number[] = [];

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        filter: this.filter,
        sort: this.sort,
      }).data,
    };

    return result;
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.gridData = filterBy(this.customer3gListing, filter);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridData = orderBy(this.customer3gListing, sort);
  }

  onOpenDetails3gModal(e, customer_System_Id: number) {
    $('#details3gModal').modal('show');

    this.customer_System_Id = customer_System_Id;

    e.selectedRows.forEach((x) => {
      console.log(x.dataItem.customer_System_Id);

      this.address_1 = x.dataItem.address_1;
      this.address_2 = x.dataItem.address_2;
      this.address_3 = x.dataItem.address_3;
      this.alarm_Account = x.dataItem.alarm_Account;
      this.carrier = x.dataItem.carrier;
      this.cellGeneration = x.dataItem.cellGeneration;
      this.cellModel = x.dataItem.cellModel;
      this.cellType = x.dataItem.cellType;
      this.city = x.dataItem.city;
      this.customerEmail = x.dataItem.customerEmail;
      this.customerPhone = x.dataItem.customerPhone;
      this.customerType = x.dataItem.customerType;
      this.customer_Name = x.dataItem.customer_Name;
      this.customer_Number = x.dataItem.customer_Number;
      this.customer_System_Id = x.dataItem.customer_System_Id;
      this.offer1 = x.dataItem.offer1;
      this.offer2 = x.dataItem.offer2;
      this.offer3 = x.dataItem.offer3;
      this.offer4 = x.dataItem.offer4;
      this.panel_Location = x.dataItem.panel_Location;
      this.panel_Type_Code = x.dataItem.panel_Type_Code;
      this.rmrAtCustomer = x.dataItem.rmrAtCustomer;
      this.rmrAtSite = x.dataItem.rmrAtSite;
      this.rmrAtSystem = x.dataItem.rmrAtSystem;
      this.siteName = x.dataItem.siteName;
      this.sitePhone = x.dataItem.sitePhone;
      this.site_Number = x.dataItem.site_Number;
      this.state_3g = x.dataItem.state;
      this.system_Code = x.dataItem.system_Code;
      this.zipCode = x.dataItem.zipCode;
    });

    this.customer3gListingForm.controls['CustomerSystemID'].setValue(
      this.customer_System_Id
    );
  }

  onOpenMessageModal() {
    $('#messageModal').modal('show');
  }

  onSubmit3gListingMessage(form: FormGroup) {
    this.routeService
      .postPartnerAddNote(this.customer3gListingForm.value)
      .subscribe((res) => {
        $('#details3gModal').modal('hide');
        $('#messageModal').modal('hide');
      });
  }
}
