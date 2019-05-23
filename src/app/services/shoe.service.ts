import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Scavenger} from '@wishtack/rx-scavenger';
import {CredentialsService} from './credentials.service';
import {ShoeModel} from '../model/shoe.model';
import {isUndefined} from 'util';

@Injectable({
  providedIn: 'root'
})
export class ShoeService implements OnDestroy {

  private scavenger: Scavenger = new Scavenger(this);
  private readonly shoeUrl = 'http://cerberus.mircloud.us/shoes';
  constructor(private http: HttpClient, private services: CredentialsService) { }

  getShoes(page?: number, size?: number, sort?: string, direction?: string) {
    const header = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: this.services.token
    });

    const param: HttpParams = new HttpParams();

    if (!isUndefined(page)) {
      param.set('page', page.toString());
    }
    if (!isUndefined(size)) {
      param.set('size', size.toString());
    }
    if (!isUndefined(sort)) {
      param.set('sort', sort);
    }
    if (!isUndefined(direction)) {
      param.set('direction', direction);
    }

    return this.http.get(this.shoeUrl, {headers: header, params: param} )
      .pipe(this.scavenger.collect())
      .toPromise();
  }

  getShoe(id: string) {
    const header = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: this.services.token
    });

    return this.http.get<ShoeModel>(this.shoeUrl + `/${id}`, {headers: header})
      .pipe(this.scavenger.collect())
      .toPromise();
  }

  updateShoe(shoe: ShoeModel) {
    const header = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: this.services.token
    });

    return this.http.put<ShoeModel>(this.shoeUrl, shoe, {headers: header})
      .pipe(this.scavenger.collect())
      .toPromise();
  }

  deleteShoe(idShoe: string) {
    const header = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: this.services.token
    });

    return this.http.delete(this.shoeUrl + `/${idShoe}`, {headers: header})
      .pipe(this.scavenger.collect())
      .toPromise();
  }

  ngOnDestroy(): void {
  }
}
