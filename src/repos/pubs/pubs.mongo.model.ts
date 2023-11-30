import { Schema, model } from 'mongoose';
import { Pubs } from '../../entities/pubs.model.js';

export const PubsSchema = new Schema<Pubs>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  direction: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: false,
    unique: true,
  },
  Beers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Beers',
    },
  ],
  visitado: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

PubsSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const PubsModel = model('Pubs', PubsSchema, 'pubs');
