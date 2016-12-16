'use strict';

const fs = require('fs');

/*

const stream = fs.createReadStream(__dirname + '/data/comuni_italiani.json');

console.time('READ OP');

stream.on('data', function (chunk){
	console.log(chunk);
});

stream.on('end', function (){
	console.log('FINISHED!!!');
	console.timeEnd('READ OP');
});

*/

var int16 = new Int16Array(2);
int16[0] = 42;
console.log(int16[0]);

// MAP

var sayings = new Map();
sayings.set("dog", "woof");
sayings.set("cat", "meow");
sayings.set("elephant", "toot");
sayings.size; // 3
sayings.get("fox"); // undefined
sayings.has("bird"); // false
sayings.delete("dog");
sayings.has("dog"); // false

for (var [key, value] of sayings) {
  console.log(key + " goes " + value);
}
// "cat goes meow"
// "elephant goes toot"

sayings.clear();
sayings.size; // 0

// WEAK MAP

const privates = new WeakMap();

function Public() {
  const me = {
    // Private data goes here
  };
  privates.set(this, me);
}

Public.prototype.method = function () {
  const me = privates.get(this);
  // Do stuff with private data in `me`...
};

module.exports = Public;


// SET

var mySet = new Set();
mySet.add(1);
mySet.add("some text");
mySet.add("foo");

mySet.has(1); // true
mySet.delete("foo");
mySet.size; // 2

for (let item of mySet) console.log(item);
// 1
// "some text"
