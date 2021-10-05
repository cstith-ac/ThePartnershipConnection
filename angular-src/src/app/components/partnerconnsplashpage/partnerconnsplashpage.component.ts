import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { SplashAnimationType } from './splash-animation-type';
import Stepper from 'bs-stepper';

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
    private scroller: ViewportScroller
  ){}

  ngOnInit() {
    
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

  onChangeDontShowAgain(e) {
    if(e.currentTarget.checked == true) {
      console.log(e.currentTarget.checked + ' is value')
      localStorage.setItem('removeSplash','1');
    }
    if(e.currentTarget.checked == false) {
      console.log(e.currentTarget.checked + ' is value')
      //localStorage.setItem('removeSplash','0');
      localStorage.removeItem('removeSplash');
    }
    //return
    setTimeout(() => {
      this.onDetectRemoveSplashPage();  
    }, 1000);
    
  }

  onClickStartTour() {
    this.onDetectRemoveSplashPage();
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
