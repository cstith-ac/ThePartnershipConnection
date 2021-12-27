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
    this.submitted = true;

    console.log('First Name: ', form.value.firstName);
    console.log('Last Name: ', form.value.lastName);
    console.log('Password: ', form.value.password);
    console.log('Password: ', form.value.confirmPassword);

    if(this.updateAspNetUserForm.invalid) {
      return;
    }
    
    this.routeService.updatePassword(this.updateAspNetUserForm.value).subscribe(data => {
      //console.log(data);
      for(let key in data) {
        console.log(data[key])
        if(data[key]===true) {
          this.flashMessage.show('Password updated successfully', {cssClass:'alert-success', timeout: 6000});
          this.onReset();
        } else if (data[key]===false) {
          this.flashMessage.show('There was an error', {
            cssClass:'alert-danger', timeout: 6000
          });
        }
      }
      //console.log(data);
      // get the response. if the response is 200 OK, show notification
      // this.flashMessage.show('Password updated successfully', {cssClass:'alert-success', timeout: 3000});
      //     this.onReset();
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
