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

  removeSplash:number;
  removeSplashDBVal;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.authService.getProfile().subscribe(
      res => {
        this.user = res;
        // console.log(this.user.removeSplash)
        // this.removeSplashDBVal = this.user.removeSplash
        if(this.user.removeSplash === 0) {
          this.removeSplash = 0
        }
        if(this.user.removeSplash === 1) {
          this.removeSplash = 1
        }
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
      afauserLink: "",
      removeSplash: ""
    })
  }

  // populateForm() {
  //   this.updateProfileForm.patchValue;
  // }
  onChangeShowInstructions(e) {
    // console.log(e.target.value)
    // console.log(e.currentTarget.checked)
    if(e.currentTarget.checked === true) {
      //Show instructions? Yes
      console.log(e.currentTarget.checked)
      let currentVal = e.currentTarget.checked
      currentVal = 1
      console.log('don\'t show instructions or value 1')
      this.removeSplash = currentVal
      this.updateProfileForm.controls['removeSplash'].setValue(this.removeSplash)
    }
    if(e.currentTarget.checked === false) {
      //Show instructions? No
      console.log(e.currentTarget.checked)
      let currentVal = e.currentTarget.checked
      currentVal = 0
      console.log('show instructions or value 0')
      this.removeSplash = currentVal
      this.updateProfileForm.controls['removeSplash'].setValue(this.removeSplash)
    }
  }

  onSubmit(form: FormGroup) {
    console.log('Email: ', form.value.email)
    console.log('First name: ', form.value.firstName)
    console.log('Last name: ', form.value.lastName)
    console.log('Phone number: ', form.value.phoneNumber)
    console.log('Cell: ', form.value.cellPhoneNumber1)
    console.log('Alt email: ', form.value.altEmail)
    console.log('Remove Splash: ', form.value.removeSplash)

    //return 
    this.authService.updateUserProfile(this.updateProfileForm.value)
      .subscribe(
        result => {
          confirm('Click OK to confirm form submission')
          console.log('success: ', result)
          this.router.navigate(['profile'])
        },
        error => console.log('error: ', error)
      )
  }

}
