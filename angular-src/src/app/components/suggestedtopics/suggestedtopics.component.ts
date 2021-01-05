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
      }
    )
  }

}
