import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    //This works but isn't using authService
    this.authService.authenticateUser(user).subscribe(
      (res:any) => {
        //console.log(res.afaRole)
        localStorage.setItem('token', res.token);
        localStorage.setItem('user',  JSON.stringify(res));
        this.flashMessage.show('You are now logged in', {
          cssClass: 'alert-success',
          timeout: 5000
        });
        if(res.afaRole === 5) {
          console.log(res.afaRole)
          this.router.navigate(['/partner-dashboard'])
        } else if (res.afaRole === 19) {
          this.router.navigate(['/dashboard'])
        } else if (res.afaRole === 9) {
          this.router.navigate(['/dashboard'])
        }
        // if(this.authService.isPartner()) {
        //   //current hard-coded username: aprilm@palmettosecuritysystems.com
        //   //current hard-coded partner password: partner123
        //   this.router.navigate(['/partner-dashboard'])
        // } else {
        //   this.router.navigate(['/dashboard']);
        // }
        //this.router.navigate(['/dashboard']);
      },
      err => {
        // alert(err)
        if(err.status === 400) {
          this.flashMessage.show('You entered the incorrect username or password', {
            cssClass: 'alert-danger',
            timeout: 5000
          });
        }

        if(err.status === 500) {
          // this.flashMessage.show('There has been an error', {
          //   cssClass: 'alert-danger',
          //   timeout: 5000
          // });
          alert(err)
        }
      }
    )
    
    // this.authService.authenticateUser(user).subscribe(data => {
    //   if(data.success) {
    //     this.authService.storeUserData(data.token, data.user);
    //     this.flashMessage.show('You are now logged in', {
    //       cssClass: 'alert-success', 
    //       timeout: 5000
    //     });
    //     this.router.navigate(['/dashboard']);
    //   } else {
    //     this.flashMessage.show('error', {
    //       cssClass: 'alert-danger', 
    //       timeout: 5000
    //     });
    //     this.router.navigate(['/login']);
    //   }
    // });
  }

}
