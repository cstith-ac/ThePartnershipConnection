import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Customer3GListing } from 'src/app/models/customer3glisting';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
//import { FilterPipe } from 'src/app/_helpers/filter.pipe';
import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-customer3glisting',
  templateUrl: './customer3glisting.component.html',
  styleUrls: ['./customer3glisting.component.css']
})
export class Customer3glistingComponent implements OnInit {
  customer3glisting: Customer3GListing[];

  isShown: boolean = true ; // show by default

  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10,15,25,50,100,150,200];

  fileName = 'customer3glisting.xlsx';

  zipCodeFilter: any = { zipCode: '' };

  constructor(
    private spinnerService: NgxSpinnerService,
    private routeService: RouteService,
    private filterPipe: FilterPipe
  ) { 
    console.log(filterPipe.transform(
      this.customer3glisting, { zipCode: '29081' }
    )) 
    }

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 30000)

    this.routeService.getCustomer3GListing().subscribe(
      res => {
        this.customer3glisting = res;
      }
    )
  }

  load3GList() {
    this.routeService.getCustomer3GListing().subscribe(
      res => {
        this.customer3glisting = res;
      }
    )
  }

  onTableDataChange(event) {
    this.page = event;
    //this.load3GList();
    this.spinnerService.hide();
  }

  onTableSizeChange(event) {
    this.tableSize = event.target.value;
    this.page = 1;
    //this.load3GList();
    this.spinnerService.hide();
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  }
}
