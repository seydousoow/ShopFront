import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Scavenger} from '@wishtack/rx-scavenger';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService implements OnDestroy {
  private _token: string = null;
  private readonly loginURL = 'http://shop-secu.mircloud.us/login';
  private readonly usersUrl = 'http://shop-secu.mircloud.us/users';
  private readonly TOKEN_NAME = 'token';
  private readonly TOKEN_PREFIX = 'Bearer ';
  private scav = new Scavenger(this);
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
  }

  get token(): string {
    this._token = localStorage.getItem(this.TOKEN_NAME);
    return this.TOKEN_PREFIX + this._token;
  }

  set token(value: string) {
    localStorage.setItem(this.TOKEN_NAME, value.substring(this.TOKEN_PREFIX.length));
    this._token = value;
  }

  /*
   * Method to delete the token
   */
  deleteToken(): void {
    if (this.token !== null) {
      localStorage.removeItem(this.TOKEN_NAME);
    }
  }

  login(username: string, password: string) {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(this.loginURL, {username, password}, {headers: header, observe: 'response'})
      .pipe(
        /*
         * unsubscribe
         */
        this.scav.collect(),
        tap(resp => {
          /*
           * Store the username and the JWT token in the local storage to keep user logged in between page refreshes
           */
          this.token = resp.headers.get('Authorization');
        }))
      .toPromise();
  }

  isTokenExpired() {
    const token = this.token;
    /*
     * return true if the token equals null
     */
    if (token === 'Bearer null') {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    /*
     * Delete the token from the localStorage
     *
     */
    this.deleteToken();
    this.router.navigate(['login']);
  }

  /*
   * Query the username and the role of the current user
   */
  getCredentials() {
     const token = this.token;
     if (token === 'Bearer null') {
       return null;
     }
     const decoded = this.jwtHelper.decodeToken(token);
     const username: string = decoded.sub;
     const roles: JSON = decoded.roles;
     return new Array({username, roles});
  }

  ngOnDestroy(): void {
  }

}
