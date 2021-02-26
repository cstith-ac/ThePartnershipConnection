import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-currentuser',
  templateUrl: './currentuser.component.html',
  styleUrls: ['./currentuser.component.css']
})
export class CurrentuserComponent implements OnInit {

  currentUser$ = this.currentUserService.data$;
  user:any=Object;

  constructor(
    public authService: AuthService,
    private currentUserService: UserService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  ngOnDestroy() {
    console.log('destroyed')
    //when the dashboard is removed, change the navlist
    if(localStorage.getItem('token') === null) {
      console.log('remove navlist')
    }
  }
}