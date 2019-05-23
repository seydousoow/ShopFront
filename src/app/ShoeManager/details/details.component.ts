import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShoeService} from '../../services/shoe.service';
import {ShoeModel} from '../../model/shoe.model';
import {Config} from '../../../assets/config';
import {faEdit, faTrash, faPlus, faSave} from '@fortawesome/free-solid-svg-icons';
import {SizeModel} from '../../model/size.model';
import Swal, {SweetAlertType} from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  private config: Config = new Config();
  private shoe: ShoeModel = new ShoeModel();
  loading = true;
  private faEdit = faEdit;
  private faTrash = faTrash;
  private faPlus = faPlus;
  private faSave = faSave;
  private isEditing = false;
  private base64textString: string;
  private listSize: SizeModel[];
  private listSizeInitialLength: number;
  loadingObject = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private shoeService: ShoeService) {
    this.shoe.idShoe = this.config.b64ToUtf8(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.shoeService.getShoe(this.shoe.idShoe)
      .then( data => {
        this.shoe = data;
        this.listSize = this.shoe.listSize;
        this.listSizeInitialLength = this.listSize.length - 1 ;
        this.listSize.sort(((a, b) => a.size > b.size ? 1 : -1));
        this.loading = false;
      }, err => {
        console.log(err.error);
    });
  }

  handleFileSelect(event: any) {
    const files = event.target.files;
    const file = files[0];
    this.base64textString = `data:${file.type};base64,`;

    if (files && file) {
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }

  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.shoe.image = this.base64textString + btoa(binaryString);
  }

  newRowToSizeTable() {
    const addRow = () => {
      return new Promise((resolve) => {
        const size: SizeModel = new SizeModel();
        size.size = 0;
        size.quantity = 0;
        this.listSize.push(size);
        resolve('size' + (this.listSize.length - 1).toString() );
      });
    };
    addRow().then(resp => {
      setTimeout(() => {
        document.getElementById(resp.toString()).focus();
      }, 100);
    });
  }

  selectImage() {
    document.getElementById('imageSelection').click();
  }

  updateShoe() {
    // verify the Size nad quantity
    if (!this.checkSize()) {
      this.shoe.idShoe = this.config.b64ToUtf8(this.activatedRoute.snapshot.paramMap.get('id'));
      this.loadingObject = true;
      /*
       * Remove each size where the quantity is equal to zero
       */
      this.listSize.forEach(ele => {
        if (ele.quantity === 0) {
          const idx = this.listSize.indexOf(ele);
          this.listSize.splice(idx, 1);
        }
      });
      let test = false;
      /*
       * Check if a size has been set up more than once
       */
      for (const x of this.listSize) {
        if (this.listSize.filter(xy => xy.size === x.size).length > 1) {
          this.fireUpdateSwal('Error', `The size ${x.size} is present more than one time. Please correct it before continuing`,
            'error');
          test = true;
          break;
        }
      }
      /*
       * Setting the new list of size
       * Then update the shoe into the database
       */
      if (!test) {
        this.shoe.listSize = this.listSize;
        this.shoeService.updateShoe(this.shoe)
          .then(resp => {
            this.shoe = resp;
            this.fireUpdateSwal('Done updating', 'The shoe has been succesfully updated!', 'success');
          }, err => {
            this.fireUpdateSwal('Error during update', 'An error occured while updating the shoe! Please try again later',
              'error');
            console.log(err);
          });
      }
    }
  }

  fireUpdateSwal(ttle: string, msg: string, tpe: SweetAlertType) {
    Swal.fire({
      title: ttle,
      text: msg,
      type: tpe,
      allowOutsideClick: false,
    }).then( result => {
      if (result.value) {
        if (tpe === 'success') {
          this.isEditing = false;
        }
        this.loadingObject = false;
      }
    });
  }

  checkSize(): boolean {
    let test = false;
    let tle: string = null;
    let msg: string = null;
    this.listSize.forEach( x => {
      if (x.size < 30 || x.size > 50) {
        tle = 'Size Error';
        msg = 'A size cannot be less than 30 or greater than 50. Please correct the form';
        test = true;
      } else if (x.quantity < 0) {
        tle = 'Error Quantity';
        msg = 'A quantity of a size must be positive or equal to zero';
        test = true;
      }
    });

    if (test === false) {
      return test;
    }

    Swal.fire({
      title: tle,
      text: msg,
      type: 'error',
      allowOutsideClick: false
    })
    .then( result => {
      if (result.value) {
        return test;
      }
    });
  }

  deleteConfirmation () {
    Swal.fire({
      title: 'Deleting',
      text: 'You are about to delete this shoe. Are you sure that you want to continue ?',
      type: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'No, cancel it!',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes, delete it!',
      confirmButtonClass: 'btn btn-success',
      showCloseButton: false
    }).then(result => {
      if (result.value) {
        this.loadingObject = true;
        this.doDelete();
      }
    });
  }

  doDelete() {
    this.shoeService.deleteShoe(this.config.b64ToUtf8(this.activatedRoute.snapshot.paramMap.get('id')))
      .then( () => {
        this.fireDeleteSwal('Deleted', 'The shoe has been succesfully deleted. You will be redirected to the home page.',
          'success');
      }, err => {
        this.fireDeleteSwal('Error', 'An error occured while we trying to delete the shoe. Please try again later. If the problem ' +
          'persist, please contact your administrator!',
          'error');
        console.log(err);
      });
  }

  fireDeleteSwal(ttle: string, msg: string, tpe: SweetAlertType) {
    Swal.fire({
      title: ttle,
      text: msg,
      type: tpe,
      allowOutsideClick: false,
    }).then( result => {
      if (result.value) {
        if (tpe === 'success') {
          this.router.navigate(['shoes']);
        } else {
          this.loadingObject = false;
        }
      }
    });
  }

}
