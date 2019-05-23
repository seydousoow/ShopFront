import {Component, OnInit} from '@angular/core';
import {CredentialsService} from '../services/credentials.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {retry} from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loading = false;


  constructor(private credentials: CredentialsService, private route: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    this.credentials.login(this.username, this.password).then(
      () => {
        /*
         * Login successful
         */
        this.loading = false;
        const redirectTo = localStorage.getItem('redirectTo') !== null ? localStorage.getItem('redirectTo') : '/';
        localStorage.removeItem('redirectTo');
        this.route.navigate([redirectTo]).catch(retry(3));
      },
      () => {
        this.loading = false;
        Swal.fire('Error', 'Login or password incorrect', 'error')
          .then((value) => {
            if (value.value) {
              this.password = '';
            }
          });
      }
    );
  }

}
