import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AspNetUsers } from 'src/app/models/aspnetusers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/_helpers/must-match.validators';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private spinnerService: NgxSpinnerService,
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
    this.spinnerService.show();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.submitted = true;

    if(this.updateAspNetUserProfileForm.invalid) {
      return;
    }

    this.authService.updateUserProfile(this.updateAspNetUserProfileForm.value).subscribe(result => {
      if(result.status === 200) {
        console.log('success');
        this.flashMessage.show('Information updated successfully', { cssClass: 'alert-success', timeout: 6000 });
          this.onReset();
          setTimeout(() => {
            this.spinnerService.hide();
            this.router.navigate(['admin']);
          }, 6000);
      } else if (result.status !== 200) {
        console.log('error');
        this.flashMessage.show('There was an error in your submission', { cssClass: 'alert-danger', timeout: 6000 });
        this.spinnerService.hide();
        this.onReset();
      }
      // for(let key in result) {
      //   if(result[key] === true) {
      //     this.flashMessage.show('Information updated successfully', { cssClass: 'alert-success', timeout: 6000 });
      //     this.onReset();
      //     this.router.navigate(['admin']);
      //   } else if (result[key] === false) {
      //     this.flashMessage.show('There was an error in your submission', { cssClass: 'alert-danger', timeout: 6000 });
      //   }
      // }
      console.log(result.body)
    })
  }

  onReset() {
    this.submitted = false;
    this.updateAspNetUserProfileForm.reset();
  }

}
