/*
Write a function that merges the ranges:

input1: [{start: -Infinity, end: 4, value: true}, {start: 4, end: 9, value: false}, {start: 9, end: Infinity, value: true}]

input2: [{start: -Infinity, end: 6, value: true}, {start: 6, end: Infinity, value: false}]

output: [{start: -Infinity, end: 4, value: true}, {start: 4, end: 6, value: false}, {start: 6, end: 9, value: false}, {start: 9, end: Infinity, value: true}]
*/


/**
 * Compares two given Range objects. Supports (-Infinity) and Infinity values.
 * @param { Object {start: number, end: number} } a - 1st range to comare 
 * @param { Object {start: number, end: number} } b - 2nd range to comare
 */
const compareRanges = (a, b) => {
	let starts = a.start - b.start;
	if (isNaN(starts) || starts === 0) {
		let ends = a.end - b.end;
		if (isNaN(ends)) return 0;
		if (ends === Infinity) return 1;
		if (ends === -Infinity) return -1;
		return ends;
	}
	if (starts === Infinity) return 1;
	if (starts === -Infinity) return -1;
	return starts;
}

/**
 * Smartely inserts Range object into given All Ranges array into proper position.
 * @param { array<Object> } all - Desitnation Array where to add the Range
 * @param { Object {start: number, end: number} } range - Ranage object to add
 */
const addToRanges = (all, range) => {
	for (let i = 0; i < all.length; i++) {
		let compare = compareRanges(range, all[i]);
		if (compare <= 0) {
			all.splice(i, 0, range); // Put in current postioton
			//console.log('addToRanges() - // Put in current postioton', range, i);
			return all;
		}
	}
	all.push(range); // Put at the end
	//console.log('addToRanges() - Put at the end', range);
	return all;
}

/**
 * Merges given Arrays of Range objects into single object's Array
 * @param { array<Object> } left - 1st Array of Range objects
 * @param { array<Object> } right - 2nd Array of Range objects
 * @returns { array<Object> }
 */
function combineRanges(left, right) {
	const allRanges = [];
	if (Array.isArray(left))
		left.forEach(value => addToRanges(allRanges, value));
	if (Array.isArray(right))
		right.forEach(value => addToRanges(allRanges, value));
	//console.log('allRanges: ', allRanges);

	// Not needed to sort due "smart adding"
	// allRanges.sort(compareRanges);

	// Merge/Combine ranges
	const result = [];
	let savedValue = allRanges[0].value;
	let posFrom = allRanges[0].start;
	let posTo = allRanges[0].end;
	let posLast = allRanges[0].end;
	for (let i = 0; i < allRanges.length - 1; i++) {
		let curr = allRanges[i], next = allRanges[i + 1];
		if (next.value !== savedValue || curr.end < next.start) {
			// Range value will be changed or ranges are not overlap

			if (next.start < curr.end) {
				// Intersection with next range
				posTo = next.start;
			};

			// Save current range
			result.push({
				start: posFrom,
				end: posTo,
				value: savedValue
			});

			// Switch to next value and update positions
			savedValue = next.value;
			posFrom = next.start;
			posTo = next.end;
		} else {
			// Range value remains the same 
			posTo = next.end;
		}
		posLast = Math.max(posLast, next.end);
	}
	// Add latest range
	result.push({
		start: posFrom,
		end: posLast,
		value: savedValue
	});

	return result;
} // combineRanges()


/**
 * Tests the combineRanges() function
 */
function test() {
	let range;

	// Single range
	range = combineRanges(
		[{ start: 1, end: 10, value: true }],
		[]
	);
	console.log(range); 

	// Empty param
	range = combineRanges(range, null);
	console.log(range);

	// No intersection with same values 
	range = combineRanges(
		[{ start: -Infinity, end: 1, value: true }],
		[{ start: 10, end: Infinity, value: true }]
	);
	console.log(range); 

	// No intersection with different values
	range = combineRanges(
		[{ start: -Infinity, end: 1, value: true }],
		[{ start: 20, end: Infinity, value: false }]
	);
	console.log(range);

	// Add more non intersection ranges
	range = combineRanges(range, [{ start: 5, end: 8, value: false }]);
	console.log(range);

	// Intersection right with value change
	range = combineRanges(range, [{ start: 7, end: 12, value: true }]);
	console.log(range);

	// Intersection right without value change
	range = combineRanges(range, [{ start: 0, end: 2, value: true }]);
	console.log(range);

	// Intersection left with value change
	range = combineRanges(range, [{ start: 3, end: 6, value: true }]);
	console.log(range);

	// Intersection left without value change
	range = combineRanges(range, [{ start: 15, end: 25, value: false }]);
	console.log(range);
	
	// Test case
	range = combineRanges(
		[{ start: -Infinity, end: 4, value: true }, { start: 4, end: 9, value: false }, { start: 9, end: Infinity, value: true }],
		[{ start: -Infinity, end: 6, value: true }, { start: 6, end: Infinity, value: false }]
	);
	console.log(range);
}
test();
