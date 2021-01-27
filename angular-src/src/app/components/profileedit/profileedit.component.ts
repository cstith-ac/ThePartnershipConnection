import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-profileedit',
  templateUrl: './profileedit.component.html',
  styleUrls: ['./profileedit.component.css']
})
export class ProfileeditComponent implements OnInit {
  id: number;
  updateProfileForm: FormGroup;
  user:any=Object;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.authService.getProfile().subscribe(
      res => {
        //console.log(res)
        this.user = res;
      },
      err => {
        console.log(err);
      }
    )

    this.authService.getProfile()
      .pipe(first())
      .subscribe(x => this.updateProfileForm.patchValue(x));
    
    this.updateProfileForm = this.fb.group({
      id: "",
      userName: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      cellPhoneNumber1: "",
      altEmail: "",
      afauserLink: ""
    })
  }

  // populateForm() {
  //   this.updateProfileForm.patchValue;
  // }

  onSubmit(form: FormGroup) {
    console.log('Email: ', form.value.email)
    console.log('First name: ', form.value.firstName)
    console.log('Last name: ', form.value.lastName)
    console.log('Phone number: ', form.value.phoneNumber)
    console.log('Cell: ', form.value.cellPhoneNumber1)
    console.log('Alt email: ', form.value.altEmail)

    this.authService.updateUserProfile(this.updateProfileForm.value)
      .subscribe(
        result => {
          console.log('success: ', result)
        },
        error => console.log('error: ', error)
      )
  }

}
