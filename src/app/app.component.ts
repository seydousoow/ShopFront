import {Component, OnInit} from '@angular/core';
import {CredentialsService} from './services/credentials.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shop';

  username: string = null;
  isAdmin: boolean = null;
  isExpired: boolean = null

  constructor(private authService: CredentialsService, private router: Router) {
    router.events.subscribe(
      arg => {
        if (arg instanceof NavigationEnd) {
          this.getAuthority();
        }
      });
  }

  ngOnInit() { }

  getAuthority() {
    const creds = this.authService.getCredentials();
    if (creds != null) {
      this.username = creds[0].username;
      this.isAdmin = JSON.stringify(creds[0].roles).indexOf('ROLE_ADMIN') >= 0;
    } else {
      this.username = null;
      this.isAdmin = null;
    }
    this.isExpired = this.authService.isTokenExpired();
  }

}
