import DateTimeFormat = Intl.DateTimeFormat;
import {SizeModel} from './size.model';

export class ShoeModel {
  idShoe: string;
  addedAt: DateTimeFormat;
  category: string;
  brand: string;
  model: string;
  buyingPrice: number;
  sellingPrice: number;
  image: string;
  description: string;
  listSize: SizeModel[];
}
