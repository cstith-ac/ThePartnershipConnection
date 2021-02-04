import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SystemInfo } from 'src/app/models/systeminfo';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-systeminfodetail',
  templateUrl: './systeminfodetail.component.html',
  styleUrls: ['./systeminfodetail.component.css']
})
export class SysteminfodetailComponent implements OnInit {
  id;
  systemInfo: any={};
  
  constructor(
    private route: ActivatedRoute,
    private routeService: RouteService) { 
    this.route.params.subscribe(res => {
      this.id = res['id'];
      this.routeService.getCustomerSystemInfo(this.id).subscribe(res => this.systemInfo=res)
    })
  }

  ngOnInit() {
    //console.log('hello')
    this.routeService.getCustomerSystemInfo(this.id).subscribe(
      res => {
        console.log(res)
        //this.customerSystemInfo = res;
      }
    )
  }

}
