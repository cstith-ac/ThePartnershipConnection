import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { AspNetUsers } from '../../models/aspnetusers';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  allUsers: AspNetUsers[];

  constructor(
    public routeService: RouteService,
    private router: Router,
    private flashMessage: FlashMessagesService
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

  deleteCurrentUser(id: number) {
    //console.log(id)
    if(confirm('Are you sure you want to delete this record?'))
    {
      this.routeService.deleteUser(id).subscribe(
        res => {
          //refresh the list
          this.flashMessage.show("Deleted successfully", {cssClass:'alert-success', timeout: 6000});
        },
        err => {console.log(err)}
      )
    }
  }

}
