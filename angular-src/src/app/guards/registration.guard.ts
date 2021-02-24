import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(this.authService.isAuthorizedToRegister())
      return true;
      else
      this.router.navigate(['/dashboard']);
      return false;
  }

  constructor(
    private authService: AuthService,
    private router: Router) {
  }
  
}
