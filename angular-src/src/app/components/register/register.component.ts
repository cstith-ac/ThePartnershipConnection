import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  firstName: String;
  lastName: String;
  //name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router) {
    // this.name = '';
    // this.username = '';
    // this.email = '';
    // this.password = '';
   }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      //name: this.name,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      username: this.username,
      password: this.password
    }

    //Required fields
    if(!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', {cssClass:'alert-danger', timeout: 3000});
      return false;
    }

    //Validate email
    if(!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please use a valid email', {cssClass:'alert-danger', timeout: 3000});
      return false;
    }

    //Validate username
    if(!this.validateService.validateEmail(user.username)) {
      this.flashMessage.show('Please use a valid email for your username', {cssClass:'alert-danger', timeout: 3000});
      return false;
    }

    //Register User
    this.authService.registerUser(user).subscribe(data => {
      if(data.succeeded) {
        this.flashMessage.show('You are now registered and can log in', {cssClass:'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Something went wrong', {cssClass:'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      }
    })
  }

}
