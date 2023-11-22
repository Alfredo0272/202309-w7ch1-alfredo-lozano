import mongoose from 'mongoose';
import { PubsSchema } from './pubs.mongo.model';

describe('When...', () => {
  describe('should', () => {
    test('should transform returned object correctly in toJSON method', () => {
      const mockPubsModel = mongoose.model('Pubs', PubsSchema);
      const document = {
        _id: '123',
        name: 'Pub1',
        direction: 'Address1',
        owner: 'Owner1',
        __v: 1,
        passwd: 'password',
      };
      // eslint-disable-next-line new-cap
      const pubDocument = new mockPubsModel(document);
      const returnedObject = pubDocument.toJSON();
      expect(returnedObject._id).toBeUndefined();
    });
  });
});
