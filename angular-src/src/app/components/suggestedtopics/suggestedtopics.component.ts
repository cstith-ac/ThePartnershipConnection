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
  suggestedtopic0;
  suggestedtopic1;
  suggestedtopic2;
  suggestedtopic3;
  suggestedtopic4;
  suggestedtopic5;
  suggestedtopic6;
  suggestedtopic7;
  suggestedtopic8;
  suggestedtopic9;
  
  constructor(
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeService.getCustomerCareDashboardInfoS().subscribe(
      res => {
        this.suggestedtopics = res;

        let topic = "";

        this.suggestedtopics.forEach((t) => {
          if(t.prompt0 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt0}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic0 = t.prompt0;
          }
          if(t.prompt1 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt1}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic1 = t.prompt1;
          }
          if(t.prompt2 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt2}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic2 = t.prompt2;
          }
          if(t.prompt3 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt3}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic3 = t.prompt3;
          }
          if(t.prompt4 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt4}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic4 = t.prompt4;
          }
          if(t.prompt5 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt5}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic5 = t.prompt5;
          }
          if(t.prompt6 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt6}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic6 = t.prompt6;
          }
          if(t.prompt7 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt7}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic7 = t.prompt7;
          }
          if(t.prompt8 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt8}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic8 = t.prompt8;
          }
          if(t.prompt9 !== "") {
            // topic += `<li class="list-group-item prompt checkbox">${t.prompt9}<input type="checkbox" class="float-right"></li>`;
            this.suggestedtopic9 = t.prompt9;
          }
        })
        // document.getElementById("suggestedTopics").innerHTML = topic;
      }
    )
  }

  lineThroughTopicItem(suggestedTopics, i) {
    console.log(i,1)
    //suggestedTopics.splice(i, 1);
  }

}
