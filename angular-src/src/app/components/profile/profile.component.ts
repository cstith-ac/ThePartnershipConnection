import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/userprofile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //user:any= Object;
  user:any=Object;
  userProfile: UserProfile[];
  updateProfileForm: FormGroup;
  email: '';
  firstName: '';
  lastName: '';
  phoneNumber: '';
  cellPhoneNumber1: '';
  altEmail: '';
  u: "";

  constructor(
    public authService: AuthService,
    private router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateProfileForm = this.fb.group({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      cellPhoneNumber1: "",
      altEmail: ""
    })

    this.authService.getProfile().subscribe(
      res => {
        //console.log(res)
        this.user = res;
        this.userProfile = res;
        //console.log(this.user)
      },
      err => {
        console.log(err);
      }
    )
  }

  get f() {
    return this.updateProfileForm.controls;
  }

  onSubmit(form: FormGroup) {
    console.log('Email: ', form.value.email)
    console.log('First name: ', form.value.firstName)
    console.log('Last name: ', form.value.lastName)
    console.log('Phone number: ', form.value.phoneNumber)
    console.log('Cell: ', form.value.cellPhoneNumber1)
    console.log('Alt email: ', form.value.altEmail)

    // this.authService.updateUserProfile(this.updateProfileForm.value)
    //   .subscribe(
    //     result => {
    //       console.log('success: ', result)
    //     },
    //     error => console.log('error: ', error)
    //   )
  }

  editUser(id:number) {
    this.router.navigate(['profile-edit/'+ id])
  }

}
