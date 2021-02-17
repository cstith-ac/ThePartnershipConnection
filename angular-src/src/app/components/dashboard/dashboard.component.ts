import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    public authService: AuthService,
    private location: Location
  ) { }

  ngOnInit() {
    // if(this.authService.loggedIn) {
    //   console.log(this.location.path())
    // }
  }

}
