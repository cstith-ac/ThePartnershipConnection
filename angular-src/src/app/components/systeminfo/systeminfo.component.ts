import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEventPattern } from 'rxjs';
import { AssistantSystems } from 'src/app/models/assistantsystems';
import { SystemInfo } from 'src/app/models/systeminfo';
import { CustomerContractNotes } from 'src/app/models/customercontractnotes'; 
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
import { CustomerContractInfo } from 'src/app/models/customercontractinfo';
declare var $: any;

@Component({
  selector: 'app-systeminfo',
  templateUrl: './systeminfo.component.html',
  styleUrls: ['./systeminfo.component.css']
})
export class SysteminfoComponent implements OnInit {
  // @ViewChild('systemInfo') systemInfo: ElementRef;
  // @ViewChild('systemInfoCustomerNumber') systemInfoCustomerNumber: ElementRef;

  id:number;
  note;

  assistantsystems: AssistantSystems[];
  customerSystemInfo: SystemInfo;
  contractNotes: CustomerContractNotes[];
  customerContractInfo: CustomerContractInfo[];

  public show:boolean = false;

  constructor(
    private routeService: RouteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeService.getCCAssistant_Systems().subscribe(
      res => {
        this.assistantsystems = res;
      }
    )
    
    // check if value exists
    if(this.id) {
      this.routeService.getCustomerSystemInfo(this.id).subscribe(
        res => {
          console.log(res)
          //this.customerSystemInfo = res;
        }
      )
    }

    // check if value exists
    if(this.id) {
      this.routeService.getCustomerContractNotesById(this.id).subscribe(
        res => {
          console.log(res);
        }
      )
    }
    
  }

  routeToSystem(id) {
    this.router.navigate(["system-info/", id])
  }

  showaccountInfoModal(customer_System_Id:number) {
    this.router.navigate(['system-info/'+ customer_System_Id])
  }

  showBOCModal() {
    $("#bocModal").modal("show");
  }

  showContractNotes(customer_Notes_Id: number) {
    this.router.navigate(['customer-note/' + customer_Notes_Id])
  }

  showContractNotesModal() {
    $("#contractNotesModal").modal("show");
    $(".modal-open").css("overflow","scroll")
    this.routeService.getCustomerContractNotes().subscribe(
      res => {
        //console.log(res)
        this.contractNotes = res;
      }
    )
  }

  // showTemp(customer_Notes_Id: number) {
  //   this.routeService.getCustomerContractNotes().subscribe(
  //     res => {
  //       this.note = this.contractNotes.map(x => x.customer_Notes_Id);
  //       console.log(this.note);
  //     }
  //   )
  // }

  // showHide(event) {
  //   console.log(event.target);
  //   this.show = !this.show;
  // }

}
