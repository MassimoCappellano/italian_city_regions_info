'use strict';

var a = [ [1, 2, 3, 4], ['a', 'b', 'c']];

var nA = [].concat.apply([], a);

console.log(nA);


var obj = {
	a: 'poppo',
	b: 'pippo'
};

console.log(obj);


delete obj.b;

console.log(obj);

function capitalizeFirstLetter(word) {
	if(word.length > 0){
		word = word.charAt(0).toUpperCase() + word.slice(1)
	}

	return word;
}

console.log('asss', capitalizeFirstLetter('asss'));

console.log(' asss', capitalizeFirstLetter(' asss'));

console.log('', capitalizeFirstLetter(''));

console.log('a', capitalizeFirstLetter('a'));


console.log('A', capitalizeFirstLetter('A'));


