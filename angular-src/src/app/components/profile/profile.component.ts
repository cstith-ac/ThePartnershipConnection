import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/userprofile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //user:any= Object;
  user:any=Object;
  userProfile: UserProfile[];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.authService.getProfile().subscribe(profile => {
    //   console.log(profile)
    //   this.user = profile.user;
    // },
    // err => {
    //   console.log(err);
    // })
    this.authService.getProfile().subscribe(
      res => {
        //console.log(res)
        this.user = res;
        this.userProfile = res;
        //console.log(this.user)
      },
      err => {
        console.log(err);
      }
    )
  }

}
