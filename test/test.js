const chai = require('chai');
const assert = chai.assert;
const httpQueue = require('./../http-queue.js');

describe('http-queue', function() {
	let x = 1000;
	let queue = new httpQueue(x);
	it('new queue should return new http-queue object', function() {
		let className = queue.constructor.name;
		assert.equal("HttpQueue",className);
	});
	it(`interval should be ${x}`, function() {
		let interval = queue.getInterval();
		assert.equal(interval,x);
	});
	it(`interval should be now ${x*2}`, function() {
		x=x*2;
		queue.setInterval(x);
		let interval = queue.getInterval();
		assert.equal(interval,x);
	});
	it('test return data from placeholder API over https', function(done) {
		this.timeout(5000);
		queue.newRequest('https://jsonplaceholder.typicode.com/posts/1', function(data) {
			assert.isOk(data);
			data = JSON.parse(data);
			assert(data.hasOwnProperty('id'));
			done();
		});
	});
	it('test return data from placeholder API over http', function(done) {
		this.timeout(5000);
		queue.newRequest('http://jsonplaceholder.typicode.com/posts/1', function(data) {
			assert.isOk(data);
			data = JSON.parse(data);
			assert(data.hasOwnProperty('id'));
			done();
		})
	})
	it('test multiple requests', function(done) {
		this.timeout(5000);
		let now = 0;
		let then = 0;
		queue.newRequest('https://jsonplaceholder.typicode.com/posts/1', function(data) {
			then = Date.now();
			assert.isAbove(then,0);
		});
		queue.newRequest('https://jsonplaceholder.typicode.com/posts/1', function(data) {
			now = Date.now();
			assert.isAbove(now,0);
			assert.isAtLeast(now,then+1000);
			done();
		});
	});
});