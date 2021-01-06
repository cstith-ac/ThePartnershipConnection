import { Component, OnInit } from '@angular/core';
import { AssistantSystems } from 'src/app/models/assistantsystems';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-systeminfo',
  templateUrl: './systeminfo.component.html',
  styleUrls: ['./systeminfo.component.css']
})
export class SysteminfoComponent implements OnInit {
  assistantsystems: AssistantSystems[];

  constructor(
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.getCCAssistant_Systems().subscribe(
      res => {
        //console.log(res);
        this.assistantsystems = res;
      }
    )
  }

}
