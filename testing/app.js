var db = new PouchDB('kittens')

db.info().then(function (info) {
  console.log(info);
})

// ###  Initial document
// var doc = {
//   "_id": "mittens",
//   "name": "Mittens",
//   "occupation": "kitten",
//   "age": 3,
//   "hobbies": [
//     "playing with balls of yarn",
//     "chasing laser pointers",
//     "lookin' hella cute"
//   ]
// };


// fetch mittens
db.get('mittens').then(function (doc) {
  // update their age
  doc.age = 2;
  // put them back
  return db.put(doc);
}).then(function () {
  // fetch mittens again
  return db.get('mittens');
}).then(function (doc) {
  console.log(doc);
});