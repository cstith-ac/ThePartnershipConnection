import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CallsummaryComponent } from '../components/callsummary/callsummary.component';

@Injectable({
  providedIn: 'root'
})
export class UnsavedchangesGuard implements CanDeactivate<CallsummaryComponent> {
  canDeactivate(component: CallsummaryComponent) {
    if(component.callSummaryAddForm.dirty) {
      return window.confirm('you have some unsaved changes. are you sure you want to navigate?')
    }
    return true;
    //https://www.youtube.com/watch?v=nDEqJjLw348
  }
  // canDeactivate(
  //   component: Customer3glistingComponent,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  
}
