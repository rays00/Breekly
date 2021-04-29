import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  data: any;

  constructor(private router: Router, private cookieService : CookieService, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return new Observable<boolean>(obs => {
        this.authService.isAuthenticated().subscribe(
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
