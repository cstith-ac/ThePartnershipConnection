import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEventPattern } from 'rxjs';
import { AssistantSystems } from 'src/app/models/assistantsystems';
import { SystemInfo } from 'src/app/models/systeminfo';
import { RouteService } from '../../services/route.service';
import { Router } from '@angular/router';
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

  assistantsystems: AssistantSystems[];
  customerSystemInfo: SystemInfo;

  constructor(
    private routeService: RouteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeService.getCCAssistant_Systems().subscribe(
      res => {
        this.assistantsystems = res;
        console.log(this.assistantsystems);
        // let customerSystemID = this.assistantsystems.find(x => x.customer_System_Id === x.customer_System_Id).customer_System_Id;
        // console.log(customerSystemID)

        // fetch('https://localhost:44314/api/CustomerSystemInfo/'+customerSystemID)
        // .then(res => {
        //   res.json()
        //   .then(data => {
        //     console.log(data.addressLine)
        //   })
        // })
      }
    )

    this.routeService.getCustomerSystemInfo(this.id).subscribe(
      res => {
        console.log(res)
        //this.customerSystemInfo = res;
      }
    )

    // $(".system-info-collectionItem").on('click', function() {
    //   var id = $(this).data('id');
    //   console.log(id)
    // })
  }

  routeToSystem(id) {
    this.router.navigate(["system-info/", id])
  }

  showaccountInfoModal(customer_System_Id:number) {
    this.router.navigate(['system-info/'+ customer_System_Id])
    //$("#accountInfoModal").modal("show");
    //console.log(this.systemInfoCustomerNumber.nativeElement);
   //this.routeService.getCustomerSystemInfo
  }

}
