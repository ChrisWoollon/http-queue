const chai = require('chai');
const assert = chai.assert;
const httpQueue = require('./../http-queue.js');

//Function to convert object to x-www-form-urlencoded format (https://gist.github.com/lastguest/1fd181a9c9db0550a847)
function JSON_to_URLEncoded(element,key,list){
	var list = list || [];
	if(typeof(element)=='object'){
	  for (var idx in element)
		JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
	} else {
	  list.push(key+'='+encodeURIComponent(element));
	}
	return list.join('&');
}

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
	it('test GET request return data from placeholder API over https', function(done) {
		this.timeout(5000);
		queue.newRequest('https://jsonplaceholder.typicode.com/posts/1', function(data) {
			assert.isOk(data);
			data = JSON.parse(data);
			assert(data.hasOwnProperty('id'));
			done();
		});
	});
	it('test GET request return data from placeholder API over http', function(done) {
		this.timeout(5000);
		queue.newRequest('http://jsonplaceholder.typicode.com/posts/1', function(data) {
			assert.isOk(data);
			data = JSON.parse(data);
			assert(data.hasOwnProperty('id'));
			done();
		})
	})
	it('test multiple GET requests', function(done) {
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
	it('test POST request return data with \'json\' body from placeholder API over https', function(done) {
		this.timeout(5000);
		let postData = {
			title: 'post json foo',
			body: 'post json bar',
			userId: 5
		};
		let options = {
			protocol: 'https:',
			host: 'jsonplaceholder.typicode.com',
			path: '/posts',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(postData).length
			},
			body: JSON.stringify(postData)
		};
		queue.newRequest(options, function(data) {
			assert.isOk(data);
			data = JSON.parse(data);
			assert(data.hasOwnProperty('id'));
			assert(data.hasOwnProperty('title'));
			assert.equal(data.title, postData.title);
			done();
		});
	});
	it('test POST request return data with \'x-www-form-urlencoded\' body from placeholder API over http', function(done) {
		this.timeout(5000);
		let postData = {
			title: 'post urlencoded foo',
			body: 'post urlencoded bar',
			userId: 5
		};
		let options = {
			protocol: 'https:',
			host: 'jsonplaceholder.typicode.com',
			path: '/posts',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': JSON_to_URLEncoded(postData).length
			},
			body: JSON_to_URLEncoded(postData)
		};
		queue.newRequest(options, function(data) {
			assert.isOk(data);
			data = JSON.parse(data);
			assert(data.hasOwnProperty('id'));
			assert(data.hasOwnProperty('title'));
			assert.equal(data.title, postData.title);
			done();
		});
	});
	it('test multiple, with \'json\' and \'x-www-form-urlencoded\' body, POST requests', function(done) {
		this.timeout(5000);
		let now = 0;
		let then = 0;
		let postDataJson = {
			title: 'post json foo',
			body: 'post json bar',
			userId: 5
		};
		let optionsJson = {
			protocol: 'https:',
			host: 'jsonplaceholder.typicode.com',
			path: '/posts',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(postDataJson).length
			},
			body: JSON.stringify(postDataJson)
		};
		let postDataUrlEncoded = {
			title: 'post urlencoded foo',
			body: 'post urlencoded bar',
			userId: 5
		};
		let optionsUrlEncoded = {
			protocol: 'https:',
			host: 'jsonplaceholder.typicode.com',
			path: '/posts',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': JSON_to_URLEncoded(postDataUrlEncoded).length
			},
			body: JSON_to_URLEncoded(postDataUrlEncoded)
		};
		queue.newRequest(optionsJson, function(data) {
			then = Date.now();
			assert.isAbove(then,0);
			assert.isOk(data);
			data = JSON.parse(data);
			assert(data.hasOwnProperty('id'));
			assert(data.hasOwnProperty('title'));
			assert.equal(data.title, postDataJson.title);
		});
		queue.newRequest(optionsUrlEncoded, function(data) {
			now = Date.now();
			assert.isAbove(now,0);
			assert.isAtLeast(now,then+1000);
			assert.isOk(data);
			data = JSON.parse(data);
			assert(data.hasOwnProperty('id'));
			assert(data.hasOwnProperty('title'));
			assert.equal(data.title, postDataUrlEncoded.title);
			done();
		});
	});
});