import {Component, OnInit} from '@angular/core';
import {ShoeService} from '../services/shoe.service';
import {ShoeModel} from '../model/shoe.model';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {SizeModel} from '../model/size.model';
import {Config} from '../../assets/config';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './shoeManager.component.html',
  styleUrls: ['./shoeManager.component.css']
})
export class ShoeManagerComponent implements OnInit {

  data: any;
  listShoes: ShoeModel[] = new Array<ShoeModel>();
  listBrand = new Array<string>();
  listSize = new Array<number>();
  brandCollapsing = true;
  sizeCollapsing = true;
  filterCollapsing = false;
  loading = true;
  selectedFilter = 'Newest';

  /*
   * shoes filter and page size of pageable
   */
  sortBy: string = null;
  direction: string = null;
  page: number = null;
  size: number= null;


  /*
   * Font awesome icons
   */
  private readonly faDown = faChevronDown;
  private readonly faUp = faChevronUp;

  /*
   * Personnalized config file that contains base64 loader icons
   * encoder.utf8ToBase64(item.idShoe)
   */

  private config: Config = new Config();

  constructor(private shoeService: ShoeService, private sanitize: DomSanitizer) { }

  ngOnInit() {
    this.shoeService.getShoes()
      .then( data => {
        this.data = data;
        this.data.content.forEach(shoe => {
          /*
           * give the shoe a default show icon if there is not image related to the shoe
           */
          if (shoe.image.length <= 0) {
            shoe.image = '/assets/images/default.jpg';
          }
          this.listShoes.push(shoe);
          this.addBrandToListBrand(shoe.brand);
          this.addSizeToListSize(shoe.listSize);
        });
        this.loading = false;
        this.sortListOfPrimitive(this.listBrand);
        this.sortListOfPrimitive(this.listSize);
      }, err => {
        console.log(err.error);
      });
  }

  changeFilter(name: string) {
    this.selectedFilter = name;
    this.filterCollapsing = false;
  }

  addBrandToListBrand(brand: string) {
    if (!this.listBrand.includes(brand)) {
      this.listBrand.push(brand);
    }
  }

  addSizeToListSize(list: SizeModel[]) {
    list.forEach( args => {
      if (!this.listSize.includes(args.size)) {
        this.listSize.push(args.size);
      }
    });
  }

  sortListOfPrimitive(list: any[]) {
    list.sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
  }

}
