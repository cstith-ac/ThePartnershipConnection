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
  selector: 'app-adminedit',
  templateUrl: './adminedit.component.html',
  styleUrls: ['./adminedit.component.css']
})
export class AdmineditComponent implements OnInit {
  submitted = false;
  token: any;
  id: number;
  aspnetuser: AspNetUsers[];
  updateAspNetUserForm: FormGroup;
  user:any=Object;

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
      .subscribe(x => this.updateAspNetUserForm.patchValue(x));

    this.updateAspNetUserForm = this.fb.group(
      {
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required]
      },
      {
        validator: MustMatch("password", "confirmPassword")
      }
    )
  }

  get f() {
    return this.updateAspNetUserForm.controls;
  }

  onSubmit(form: FormGroup) {
    this.spinnerService.show();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.submitted = true;

    if(this.updateAspNetUserForm.invalid) {
      return;
    }
    
    this.routeService.updatePassword(this.updateAspNetUserForm.value).subscribe(data => {
      console.log(data.status);
      console.log(data.statusText);
      // return;
      if(data.status === 200) {
        console.log('success');
        this.flashMessage.show('Information updated successfully', { cssClass: 'alert-success', timeout: 6000 });
        this.onReset();
        setTimeout(() => {
          this.spinnerService.hide();
          this.router.navigate(['admin'])
        }, 6000);
      } else if (data.status !== 200) {
        console.log('error');
        this.flashMessage.show('There was an error with your submission', { cssClass: 'alert-danger', timeout: 6000 });
        this.spinnerService.hide();
        this.onReset();
      }
      //console.log(data);
      // for(let key in data) {
      //   // console.log(data[key])
      //   if(data[key] === true) {
      //     this.flashMessage.show('Password updated successfully', {cssClass:'alert-success', timeout: 6000});
      //     this.onReset();
      //     this.router.navigate(['admin']);
      //   } else if (data[key]===false) {
      //     this.flashMessage.show('There was an error', {
      //       cssClass:'alert-danger', timeout: 6000
      //     });
      //   }
      // }
    });

    // this.routeService.updateUser(this.updateAspNetUserForm.value).subscribe(data => {
    //   console.log(data)
    // })
  }

  onReset() {
    this.submitted = false;
    this.updateAspNetUserForm.reset();
  }

}
