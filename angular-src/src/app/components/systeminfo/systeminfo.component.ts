import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AssistantSystems } from 'src/app/models/assistantsystems';
import { SystemInfo } from 'src/app/models/systeminfo';
import { RouteService } from '../../services/route.service';
declare var $: any;

@Component({
  selector: 'app-systeminfo',
  templateUrl: './systeminfo.component.html',
  styleUrls: ['./systeminfo.component.css']
})
export class SysteminfoComponent implements OnInit, AfterViewInit {
  @ViewChild('systemInfo') systemInfo: ElementRef;

  assistantsystems: AssistantSystems[];
  customerSystemInfo: SystemInfo[];

  constructor(
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.getCCAssistant_Systems().subscribe(
      res => {
        //console.log(res);
        this.assistantsystems = res;

        // const table = document.getElementById("systemInfo");
        // console.log(table)
      }
    )

    this.routeService.getCustomerSystemInfo().subscribe(
      res => {
        this.customerSystemInfo = res;
      }
    )
  }

  ngAfterViewInit() {
    console.log('afterinit');
    setTimeout(() => {
      //console.log(this.systemInfo.nativeElement);
      let table = this.systemInfo.nativeElement;
      let rows = table.getElementsByTagName("tr");
      //console.log(rows);
      // for(let i = 0; i < rows.length; i++) {
      //   let currentRow = table.rows[i];
      //   //console.log(currentRow);
      //   let firstCol = table.rows[i].cells[0];
      //   console.log(firstCol);
        
      //   let createClickHandler = function(row) {
      //     return function() {
      //       let cell = row.getElementsByTagName("td")[1];
      //       let customerSystemId = row.getElementsByTagName("td")[0];
      //       let id = customerSystemId.innerHTML;
      //       $("#accountInfoModal").modal("show");
      //     };
      //     currentRow.onclick = createClickHandler(currentRow);
      //   }
      // }
      // function showSystemInfo() {
      //   //e.preventDefault();
      //   console.log("show");
      // }
      // showSystemInfo();
    }, 1000)
    //console.log(this.systemInfo.nativeElement);
  }

  showSystemInfo() {
    //e.preventDefault();
    $("#accountInfoModal").modal("show");
  }

}
