import { Schema, model } from 'mongoose';
import { Pubs } from '../entities/pubs.model';

const PubsSchema = new Schema<Pubs>({
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
});

export const PubsModel = model('Pubs', PubsSchema, 'pubs');
