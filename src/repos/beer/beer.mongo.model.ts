import { Schema, model } from 'mongoose';
import { Beer } from '../../entities/beer.model';

export const BeersSchema = new Schema<Beer>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  brewer: {
    type: String,
    required: true,
    unique: false,
  },
  style: {
    type: String,
    required: true,
    unique: false,
  },
  alcohol: {
    type: String,
    required: true,
    unique: false,
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  beerImg: {
    publicId: String,
    size: Number,
    format: String,
    url: String,
  },
  probada: {
    type: Boolean,
    required: false,
    unique: false,
  },
});
export const BeerModel = model('Beers', BeersSchema, 'beers');

BeersSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});
