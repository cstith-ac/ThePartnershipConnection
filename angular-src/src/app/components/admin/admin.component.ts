import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { AspNetUsers } from '../../models/aspnetusers';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  allUsers: AspNetUsers[];

  constructor(
    public routeService: RouteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeService.getAllUsers().subscribe(
      res => {
        this.allUsers = res;
      }
    ) 
  }

  editCurrentUser(id:number) {
    this.router.navigate(['admin-edit/'+ id])
  }

}
