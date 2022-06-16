import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AspNetUsers } from 'src/app/models/aspnetusers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/_helpers/must-match.validators';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-adminedituser',
  templateUrl: './adminedituser.component.html',
  styleUrls: ['./adminedituser.component.css']
})
export class AdminedituserComponent implements OnInit {
  submitted = false;
  token: any;
  id: number;
  aspnetuser: AspNetUsers[];
  updateAspNetUserProfileForm: FormGroup;
  user: any = Object;

  constructor(
    public authService: AuthService,
    public routeService: RouteService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    public jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  ngOnInit() {
    if(this.jwtHelper.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(["login"]);
    } else {
      //console.log('your logged in')
    }

    $("#wrapper").addClass("toggled");

    this.id = this.route.snapshot.params['id'];
    this.token = localStorage.getItem('token');

    this.routeService.getUser(this.id).subscribe(
      res => {
        this.user = res;
      },
      err => {
        console.log(err);
      }
    )

    this.routeService.getUser(this.id)
    //.pipe(first())
    .subscribe(x => this.updateAspNetUserProfileForm.patchValue(x));

    this.updateAspNetUserProfileForm = this.fb.group({
      id: "",
      userName: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      cellPhoneNumber1: "",
      altEmail: "",
      afaEmployee: "",
      afaRole: "",
      removeSplash: ""
    })
  }

  onSubmit(form:FormGroup) {
    this.submitted = true;
    
    // console.log('ID: ', form.value.id);
    // console.log('UserName: ', form.value.userName);
    // console.log('Email: ', form.value.email);
    // console.log('First Name: ', form.value.firstName);
    // console.log('Last Name: ', form.value.lastName);
    // console.log('Primary Phone Number: ', form.value.phoneNumber);
    // console.log('Cell Phone: ', form.value.cellPhoneNumber1);
    // console.log('Alternate Email: ', form.value.altEmail);
    // console.log('Alarm Connections Employee: ', form.value.afaEmployee);
    // console.log('Alarm Connections Role: ', form.value.afaRole);
    // console.log('Remove Splash: ', form.value.removeSplash)

    if(this.updateAspNetUserProfileForm.invalid) {
      return;
    }

    this.authService.updateUserProfile(this.updateAspNetUserProfileForm.value).subscribe(result => {
      console.log(result)
    })
  }

}
