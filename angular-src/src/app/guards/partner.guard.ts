import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PartnerGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(this.authService.isPartner())
      return true;
      else
      this.router.navigate(['/dashboard']);
      // if(this.router.navigate([''])) {
      //   this.router.navigate(['/partner-dashboard'])
      // }
      return false;
  }

  constructor(
    private authService: AuthService,
    private router: Router) {
  }
  
}
