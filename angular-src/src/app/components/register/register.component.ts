import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MustMatch } from 'src/app/_helpers/must-match.validators';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { collectExternalReferences } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  firstName: String;
  lastName: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private formBuilder: FormBuilder) {
   }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        username: ["", [Validators.required, Validators.email]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required]
      },
      {
        validator: MustMatch("password", "confirmPassword")
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const user = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          username: this.username,
          password: this.password
    }

    //console.log(this.registerForm.value)

    this.authService.registerUser(this.registerForm.value).subscribe(data => {
        if(data.succeeded) {
          this.flashMessage.show('You are now registered and can log in', {cssClass:'alert-success', timeout: 3000});
          this.router.navigate(['/login']);
        } else {
          this.flashMessage.show('Something went wrong', {cssClass:'alert-danger', timeout: 3000});
          this.router.navigate(['/register']);
        }
      })

    // display form values on success
    alert(
      "SUCCESS!! :-)\n\n" + JSON.stringify(this.registerForm.value, null, 4)
    );
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  // onRegisterSubmit() {
  //   const user = {
  //     //name: this.name,
  //     firstName: this.firstName,
  //     lastName: this.lastName,
  //     email: this.email,
  //     username: this.username,
  //     password: this.password
  //   }

  //   //Required fields
  //   if(!this.validateService.validateRegister(user)) {
  //     this.flashMessage.show('Please fill in all fields', {cssClass:'alert-danger', timeout: 3000});
  //     return false;
  //   }

  //   //Validate email
  //   if(!this.validateService.validateEmail(user.email)) {
  //     this.flashMessage.show('Please use a valid email', {cssClass:'alert-danger', timeout: 3000});
  //     return false;
  //   }

  //   //Validate username
  //   if(!this.validateService.validateEmail(user.username)) {
  //     this.flashMessage.show('Please use a valid email for your username', {cssClass:'alert-danger', timeout: 3000});
  //     return false;
  //   }

    //Register User
    // this.authService.registerUser(user).subscribe(data => {
    //   if(data.succeeded) {
    //     this.flashMessage.show('You are now registered and can log in', {cssClass:'alert-success', timeout: 3000});
    //     this.router.navigate(['/login']);
    //   } else {
    //     this.flashMessage.show('Something went wrong', {cssClass:'alert-danger', timeout: 3000});
    //     this.router.navigate(['/register']);
    //   }
    // })
  //}

}
