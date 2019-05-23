import { Component, OnInit } from '@angular/core';
import {Config} from '../../assets/config';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  private readonly config = new Config();

  constructor() { }

  ngOnInit() {
  }

}
