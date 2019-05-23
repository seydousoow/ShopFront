import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {CredentialsService} from '../services/credentials.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private services: CredentialsService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.services.isTokenExpired()) {
      console.log('expired');
      Swal.fire({
        title: 'Unauthorized',
        text: 'You need to log in before accessing these ressources!',
        type: 'info',
        showCancelButton: false,
        allowOutsideClick: false
      }).then(value => {
        if (value.value) {
          localStorage.setItem('redirectTo', state.url);
          localStorage.removeItem('token');
          this.router.navigate(['login']);
        }
      });
      return false;
    }
    console.log('not expired');
    return true;
  }

}
