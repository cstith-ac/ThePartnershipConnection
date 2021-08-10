import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Customer3GListing } from 'src/app/models/customer3glisting';
import { DataStateChangeEvent, ExcelCommandDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { Workbook, WorkbookSheetColumn, WorkbookSheet, WorkbookSheetRow, WorkbookSheetRowCell, WorkbookSheetFilter, WorkbookOptions, workbookOptions } from '@progress/kendo-angular-excel-export';
import { saveAs } from "@progress/kendo-file-saver";
declare var $: any;

@Component({
  selector: 'app-customer3glisting',
  templateUrl: './customer3glisting.component.html',
  styleUrls: ['./customer3glisting.component.css']
})
export class Customer3glistingComponent implements OnInit {
  customer3gListing: Customer3GListing[];
  public columns: any[] = [
    {field: "Alarm Account"}, 
    {field: "CustomerNumber"}, 
    {field: "CustomerName"},
    {field: "CustomerType"},
    {field: "CustomerType"},
    {field: "SiteName"},
    {field: "SiteNumber"},
    {field: "Address1"},
    {field: "Address2"},
    {field: "City"},
    {field: "State"},
    {field: "ZipCode"},
    {field: "PanelTypeCode"},
    {field: "PanelLocation"},
    {field: "SystemCode"},
    {field: "CellType"},
    {field: "CellGeneration"},
    {field: "CellModel"},
    {field: "Offer1"},
    {field: "Offer2"},
    {field: "Offer3"},
    {field: "Offer4"},
    {field: "RMRatCustomer"},
    {field: "RMRatSite"},
    {field: "RMRatSystem"}
  ];
  public gridData: any[];
  public pageSize: number = 5;
  public fileName: string;
  public today = new Date().toDateString();

  @ViewChild("dateTime") dateTimeView: ElementRef;

  constructor(
    private routeService: RouteService,
    private spinnerService: NgxSpinnerService
  ) { 
    this.gridData = this.customer3gListing;
  }

  ngOnInit() {
    $("#wrapper").addClass("toggled");

    // document.getElementById('dateTime').innerText = new Date().toDateString()
    const workbook = new Workbook({
      sheets:[
        {
          //name: new Date().toDateString()
          columns: [   
            
          ],
          name: 'RBLX',
          rows: [
            {
              cells: [{
                value: "My Company", fontSize: 32, textAlign: "center"
            }]
            }
          ]
        }
      ]
    })
    //console.log(workbook.options.sheets)
    var foo = workbook.options;
    //console.log(foo.sheets)
    var item = foo.sheets.find(x => x.name)
    //console.log(item.name)
    var today = item.name;
    console.log(today)
    //this.dateTime = new Date().toDateString();
    //console.log(typeof(this.dateTime))
    this.spinnerService.show();
    // setTimeout(() => {
    //   this.spinnerService.hide();
    // }, 8000)

    this.routeService.getCustomer3GListing().subscribe(
      res => {
        if(res) {
          this.spinnerService.hide()
        }
        this.gridData = res;
        //this.customer3gListing = res;

        res.forEach(element => {
          //console.log(element)
          //var element = element;
        });
      }
    )
  }

  load3GList() {
    this.routeService.getCustomer3GListing().subscribe(
      res => {
        this.gridData = res;
      }
    )
  }

  public state: State = {
    skip: 0,
    take: 5,
    
    // Initial filter descriptor
    // filter: {
    //   logic: 'and',
    //   filters: [{ field: 'ProductName', operator: 'contains', value: 'Chef' }]
    // },
  };

  // public gridData: GridDataResult = process(this.customer3glisting, this.state);
  public columnsConfig:[{
    title: 'date'
  }] 

  public dataStateChange(state: DataStateChangeEvent) {
    console.log('change')
  }

  public workbook() {
    // const workbookOptions = new WorkbookOptions({
    //   options: <WorkbookSheet[]>[

    //   ]
    // });
    //this.dateTime = new Date().toDateString();
    const workbook = new Workbook({

      sheets: <WorkbookSheet[]>[
        {
          columns: <WorkbookSheetColumn[]>[
            { autoWidth: true },
            { autoWidth: true }
          ],
          name: new Date().toDateString(),
          rows: <WorkbookSheetRow[]>[
            // First row (header)
            {
              cells: <WorkbookSheetRowCell[]>[
                { value: new Date().toDateString()},
                { value: "Alarm Account" },
                { value: "Customer Number" },
                { value: "Customer Name" },
                { value: "Customer Type" },
                { value: "Site Name" },
                { value: "Site Number" },
                { value: "Address 1" },
                { value: "Address 2" },
                { value: "City" },
                { value: "State" },
                { value: "Zip Code" },
                { value: "Panel Type Code" },
                { value: "Panel Location" },
                { value: "System Code" },
                { value: "Cell Type" },
                { value: "Cell Generation" },
                { value: "Cell Model" },
                { value: "Carrier" },
                { value: "Offer 1" },
                { value: "Offer 2" },
                { value: "Offer 3" },
                { value: "Offer 4" },
                { value: "RMR At Customer" },
                { value: "RMR At Site" },
                { value: "RMR At System" }
              ]
            },
            // Second row (data)
            {
              cells: <WorkbookSheetRowCell[]>[
                { value: "alarm_Account", fontSize:'14px', color: 'red' },
                { value: "customer_Name" },
                { value: "customerType" },
                { value: "siteName" },
                { value: "site_Number" },
                { value: "address_1" },
                { value: "address_2" },
                { value: "city" },
                { value: "state" },
                { value: "zipCode" },
                { value: "panel_Type_Code" },
                { value: "panel_Location" },
                { value: "system_Code" },
                { value: "cellType" },
                { value: "cellGeneration" },
                { value: "cellModel" },
                { value: "carrier" },
                { value: "offer1" },
                { value: "offer2" },
                { value: "offer3" },
                { value: "offer4" },
                { value: "rMRAtCustomer" },
                { value: "rMRAtSite" },
                { value: "rMRAtSystem" }
              ]
            },
          ],
        }
      ]
    });
    workbook.toDataURL().then(dataUrl => {
      saveAs(dataUrl, "customer3glisting.xlsx");
    })
  }

  public exportNewWorkbook() {
    const workbook = new Workbook({
      sheets: <WorkbookSheet[]>[
        {
          // Column settings (width)
          columns: <WorkbookSheetColumn[]>[
            { autoWidth: true },
            { autoWidth: true }
          ],
          // Title of the sheet
          name: new Date().toDateString(), // edit: non trivial filename
          // Rows of the sheet
          rows: <WorkbookSheetRow[]>[
            // First row (header)
            {
              cells: <WorkbookSheetRowCell[]>[
                // First cell
                { value: "Alarm Account" },
                // Second cell
                { value: "Customer Number" }
              ]
            },
            // Second row (data)
            {
              cells: <WorkbookSheetRowCell[]>[
                { value: "Around the Horn" },
                { value: "Thomas Hardy" }
              ]
            },
            // Third row (data)
            {
              cells: <WorkbookSheetRowCell[]>[
                { value: "B Beverages" },
                { value: "Victoria Ashworth" }
              ]
            }
          ],
          filter: <WorkbookSheetFilter>{
            // edit: added auto filter
            from: 0,
            to: 1
          }
        }
      ]
    });
    workbook.toDataURL().then(dataUrl => {
      saveAs(dataUrl, "customer3glisting.xlsx");
    });
  }

  saveDateTime() {
    //this.dateTime = new Date().toDateString();
    this.fileName = 'customer3glisting.xlsx';
    //console.log(this.dateTimeView);
    const workbook = new Workbook({
      sheets:[
        {
          name: new Date().toDateString()
        }
      ]
    })

    const worksheet = workbook.options

    console.log(workbook.options)
    var foo = workbook.options;
    var item = foo.sheets.find(x => x.name)
    var today = item.name;
    console.log(today)

    workbook.toDataURL().then(dataUrl => {
      saveAs(dataUrl, "customer3glisting.xlsx");
    })
  }
  
}
