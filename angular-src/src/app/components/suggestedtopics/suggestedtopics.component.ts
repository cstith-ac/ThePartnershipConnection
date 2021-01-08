import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { DashboardInfo } from 'src/app/models/dashboardinfo';

@Component({
  selector: 'app-suggestedtopics',
  templateUrl: './suggestedtopics.component.html',
  styleUrls: ['./suggestedtopics.component.css']
})
export class SuggestedtopicsComponent implements OnInit {
  suggestedtopics: DashboardInfo[];
  
  constructor(
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.getCustomerCareDashboardInfo().subscribe(
      res => {
        this.suggestedtopics = res;

        let topic = "";

        this.suggestedtopics.forEach((t) => {
          if(t.prompt0 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt0}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt1 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt1}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt2 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt2}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt3 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt3}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt4 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt4}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt5 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt5}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt6 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt6}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt7 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt7}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt8 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt8}<input type="checkbox" class="float-right"></li>`;
          }
          if(t.prompt9 !== "") {
            topic += `<li class="list-group-item prompt checkbox">${t.prompt9}<input type="checkbox" class="float-right"></li>`;
          }
        })
        document.getElementById("suggestedTopics").innerHTML = topic;
      }
    )
  }

}
