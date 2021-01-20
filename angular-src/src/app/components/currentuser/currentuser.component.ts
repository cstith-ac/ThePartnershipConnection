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
        console.log(JSON.parse(localStorage.getItem('user')))
        //console.log(JSON.parse(localStorage.getItem('user')).afauserLink)
      },
      err => {
        console.log(err);
      }
    )

    // this.currentUserService.getCurrentUser();
    // console.log(this.currentUserService.getCurrentUser());
  }

}
