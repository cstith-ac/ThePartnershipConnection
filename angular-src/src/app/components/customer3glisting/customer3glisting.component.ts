import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Customer3GListing } from 'src/app/models/customer3glisting';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-customer3glisting',
  templateUrl: './customer3glisting.component.html',
  styleUrls: ['./customer3glisting.component.css']
})
export class Customer3glistingComponent implements OnInit {
  public columns: any[] = [
    {field: "AlarmAccount"}, 
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
  public gridData: Customer3GListing[];
  public pageSize: number = 5;
  public fileName: string;
  public dateTime: any;

  @ViewChild("dateTime") dateTimeView: ElementRef;

  constructor(
    private routeService: RouteService,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 8000)

    this.routeService.getCustomer3GListing().subscribe(
      res => {
        this.gridData = res;
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
    // }
  };

  // public gridData: GridDataResult = process(this.customer3glisting, this.state);

  public dataStateChange(state: DataStateChangeEvent) {
    console.log('change')
  }

  saveDateTime() {
    this.dateTime = new Date().toDateString();
    this.fileName = 'customer3glisting'+this.dateTime+'.xlsx';
    console.log(this.dateTimeView);
  }
  
}
