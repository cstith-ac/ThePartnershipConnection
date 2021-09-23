import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
declare var $: any;
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    public location: Location) { }

  ngOnInit() {
    //this.onDeterminePrevUrl();

    $(document).ready(function() {
      $("#show_hide_password a").on('click', function(event) {
          event.preventDefault();
          if($('#show_hide_password input').attr("type") == "text"){
              $('#show_hide_password input').attr('type', 'password');
              $('#show_hide_password i').addClass( "fa-eye-slash" );
              $('#show_hide_password i').removeClass( "fa-eye" );
          }else if($('#show_hide_password input').attr("type") == "password"){
              $('#show_hide_password input').attr('type', 'text');
              $('#show_hide_password i').removeClass( "fa-eye-slash" );
              $('#show_hide_password i').addClass( "fa-eye" );
          }
      });
    });

    if(this.authService.isEmployee()) {
      //this.router.navigate(['/dashboard']);
      console.log('this is a Super Admin')
      this.onNavigateToCustomerCareDashboard()
    }

    if(this.authService.isPartner()) {
      console.log('this is a Partner')
      this.onNavigateToPartnerDashboard()
    }
  }

  // onDeterminePrevUrl(){
  //   console.log('onDeterminePrevUrl was called')
  //   let oldUrl = document.referrer;
  //   if(oldUrl === 'https://dev-alarm-connections.pantheonsite.io/current-partners/') {
  //     this.router.navigate(['/partner-dashboard'])
  //     console.log(oldUrl)
  //   }
  // }

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
          //console.log(res.afaRole)
          this.router.navigate(['/partner-dashboard'])
        } else if (res.afaRole === 19 || res.afaRole === 14) {
          this.router.navigate(['/dashboard'])
          //push the navlist to the sidenav component
          //get the navlist component
        } else if (res.afaRole === 9) {
          this.router.navigate(['/dashboard'])
        } else if (res.username === 'testuser@alarmfundingassociates.com') {
          this.router.navigate(['/forbidden'])
          //Jim wants this to go to an Under Construction page and not a 403 Access Denied Page
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

  onNavigateToCustomerCareDashboard() {
    this.router.navigate(['/dashboard'])
  }

  onNavigateToPartnerDashboard() {
    this.router.navigate(['/partner-dashboard'])
  }

  onNavigateToDashboard() {
    // if(this.authService.isSuperAdmin) {
    //   console.log('this is a Super Admin')
    // }
    // if(this.authService.isPartner) {
    //   this.router.navigate(['/partner-dashboard'])
    // }
    //this.location.back();
  }

}
