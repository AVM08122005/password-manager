
use('Sigma');

// Insert a few documents into the sales collection.
db.getCollection('sales').insertMany([
  { item: 'apple', price: 1.00, quantity: 5, date: new Date('2014-04-04') },
  { item: 'banana', price: 0.50, quantity: 10, date: new Date('2014-04-04') },
  { item: 'orange', price: 0.75, quantity: 8, date: new Date('2014-04-05') },
  { item: 'apple', price: 1.00, quantity: 3, date: new Date('2014-04-06') }
]);

console.log('Inserted documents into the sales collection.');
