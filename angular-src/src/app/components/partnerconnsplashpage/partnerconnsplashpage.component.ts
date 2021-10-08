import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ViewportScroller } from "@angular/common";
import { SplashAnimationType } from './splash-animation-type';
import Stepper from 'bs-stepper';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-partnerconnsplashpage',
  templateUrl: './partnerconnsplashpage.component.html',
  styleUrls: ['./partnerconnsplashpage.component.css']
})
export class PartnerconnsplashpageComponent implements OnInit {

  private stepper: Stepper;
  
  windowWidth: string;
  splashTransition: string;
  opacityChange: number = 1;
  showSplash = true;

  isAppLoader = false;
  removeSplashForm: FormGroup;
  id: number;
  user:any=Object;
  removeSplash:number;

  @Input() animationDuration: number = 0.5;
  @Input() duration: number = 3;
  @Input() animationType: SplashAnimationType = SplashAnimationType.SlideLeft;

  next() {
    this.stepper.next();
  }

  onSubmit() {
    return false;
  }

  constructor(
    private scroller: ViewportScroller,
    private authService: AuthService,
    private fb: FormBuilder
  ){}

  ngOnInit() {
    //only show instructions on initial page load
    if(localStorage.getItem('InstructionsShown')) {
      this.onDetectRemoveSplashPage();
    }

    this.authService.getProfile().subscribe(
      res => {
        console.log(res)
        this.user = res;
        // console.log(this.user.removeSplash)
        // this.removeSplashDBVal = this.user.removeSplash
        if(this.user.removeSplash === 0) {
          this.removeSplash = 0
        }
        if(this.user.removeSplash === 1) {
          this.removeSplash = 1
        }
      }
    )

    this.authService.getProfile()
      .pipe(first())
      .subscribe(x => this.removeSplashForm.patchValue(x)  
    );
    
    this.removeSplashForm = this.fb.group({
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
    
    setTimeout(() => {
      if(localStorage.getItem('removeSplash') === '1') {
        this.showSplash=false;
      }

      this.scroller.scrollToAnchor("test-l-1");
      this.stepper = new Stepper(document.querySelector('#stepper1'), {
        linear: false,
        animation: true
      })  
    }, 400);
    
  }

  onChangeDontShowAgain(e,form:FormGroup) {
    if(e.currentTarget.checked == true) {
      console.log(e.currentTarget.checked + ' is value')
      localStorage.setItem('removeSplash','1');
      //update RemoveSplash to equal 1
      let currentVal = e.currentTarget.checked
      currentVal = 1
      console.log('don\'t show instructions or value 1')
      this.removeSplash = currentVal
      this.removeSplashForm.controls['removeSplash'].setValue(this.removeSplash)
      
    }
    if(e.currentTarget.checked == false) {
      console.log(e.currentTarget.checked + ' is value')
      //localStorage.setItem('removeSplash','0');
      localStorage.removeItem('removeSplash');
      //update RemoveSplash to equal 0
      let currentVal = e.currentTarget.checked
      currentVal = 0
      console.log('show instructions or value 0')
      this.removeSplash = currentVal
      this.removeSplashForm.controls['removeSplash'].setValue(this.removeSplash)
    }
    // console.log('Email: ', form.value.email)
    // console.log('First name: ', form.value.firstName)
    // console.log('Last name: ', form.value.lastName)
    // console.log('Phone number: ', form.value.phoneNumber)
    // console.log('Cell: ', form.value.cellPhoneNumber1)
    // console.log('Alt email: ', form.value.altEmail)
    // console.log('Remove Splash: ', form.value.removeSplash)

    this.authService.updateUserProfile(this.removeSplashForm.value).subscribe(
      result => {
        console.log(result)
      }
    )
    setTimeout(() => {
      this.onDetectRemoveSplashPage();  
    }, 1000);
    
  }

  onClickStartTour() {
    this.onDetectRemoveSplashPage();
    localStorage.setItem('InstructionsShown','yes');
  }

  onDetectRemoveSplashPage() {
    this.isAppLoader = true;
    setTimeout(() => {
      let transitionStyle = "";
      switch (this.animationType) {
        case SplashAnimationType.SlideLeft:
          this.windowWidth = "-" + window.innerWidth + "px";
          transitionStyle = "left " + this.animationDuration + "s";
          break;
        case SplashAnimationType.SlideRight:
          this.windowWidth = window.innerWidth + "px";
          transitionStyle = "left " + this.animationDuration + "s";
          break;
        case SplashAnimationType.FadeOut:
          transitionStyle = "opacity " + this.animationDuration + "s";
          this.opacityChange = 0;
      }

      this.splashTransition = transitionStyle;

      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, this.animationDuration * 1000);
    }, this.duration * 1000);
  }
}
