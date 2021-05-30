import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {


  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable<boolean>(obs => {
        this.authService.isAdminAuthenticated().subscribe(
          data => {
            obs.next(true)
          },
          err => {
            this.router.navigateByUrl('/login');
            obs.next(false)
          }
        )
      })
  }
}
