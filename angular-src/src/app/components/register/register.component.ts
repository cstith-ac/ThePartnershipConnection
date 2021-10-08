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
  afauserLink: String;
  afaRoleAdminOnly = [
    {
      id: 9,
      userTier: "Employee",
      availablePermissions: ["Manage Partner","Customer Care View", "Service View", "Collections View"]
    },
    {
      id: 5,
      userTier: "Partner",
      availablePermissions: ["Manage Customer User", "Manage Partner (same base)", "Update Partner Contact Info", "View Aging (Base)", "View Cancels (Base)", "View Service Tickets (Base)", "Create Service Tickets (Base)", "View Incentives (Base)", "Create Incentives (Base)", "View 3G List (Base)"]
    },
    {
      id: 1,
      userTier: "Customer",
      availablePermissions: ["Manage Customer User (same customer)", "View Invoice (account)", "View Service Tickets (account)", "Create Service Tickets (account)", "Pay Invoice (account)", "Update Contact Info (Account)"]
    }
  ];
  afaRole = [
    {
      id: 19,
      userTier: "Super Admin",
      availablePermissions: ["Manage Admin"]
    },
    {
      id: 14,
      userTier: "Admin",
      availablePermissions: ["Manage Employee", "Shadow Employee"]
    },
    {
      id: 9,
      userTier: "Employee",
      availablePermissions: ["Manage Partner","Customer Care View", "Service View", "Collections View"]
    },
    {
      id: 5,
      userTier: "Partner",
      availablePermissions: ["Manage Customer User", "Manage Partner (same base)", "Update Partner Contact Info", "View Aging (Base)", "View Cancels (Base)", "View Service Tickets (Base)", "Create Service Tickets (Base)", "View Incentives (Base)", "Create Incentives (Base)", "View 3G List (Base)"]
    },
    {
      id: 1,
      userTier: "Customer",
      availablePermissions: ["Manage Customer User (same customer)", "View Invoice (account)", "View Service Tickets (account)", "Create Service Tickets (account)", "Pay Invoice (account)", "Update Contact Info (Account)"]
    }
  ];
  afaEmployee = [
    {
      id: 1,
      isAFAEmployee: "Yes"
    },
    {
      id: 2,
      isAFAEmployee: "No"
    }
  ];
  removeSplash = [
    {
      id: 0,
      isRemoveSplash: "No"
    },
    {
      id: 1,
      isRemoveSplash: "Yes"
    }
  ]
  password: String;

  constructor(
    private validateService: ValidateService,
    public authService: AuthService,
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
        afauserLink: ["", Validators.required],
        afaRole: ["", Validators.required],
        afaEmployee: ["", Validators.required],
        removeSplash: ["", Validators.required],
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
          afauserLink: this.afauserLink,
          afaRoleAdminOnly: this.afaRoleAdminOnly,
          afaRole: this.afaRole,
          afaEmployee: this.afaEmployee,
          removeSplash: this.removeSplash,
          password: this.password
    }

    // console.log(this.registerForm.value)
    // return
    this.authService.registerUser(this.registerForm.value).subscribe(data => {
        if(data.succeeded) {
          this.flashMessage.show('You are now registered and can log in', {cssClass:'alert-success', timeout: 6000});
          this.onReset();
          //this.router.navigate(['/login']);
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

}
