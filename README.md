https://github.com/ChrisWoollon/http-queue/

https://www.npmjs.com/package/http-queue

http://chriswoollon.co.uk/

# http-queue
Queue HTTPS requests to, for example, limit the number of API requests made in X amount of time.

I found myself copy+pasting this code into lots of projects, so decided I'd just make it available.

# Usage

```
npm install http-queue
```

```javascript
let httpQueue = require('http-queue');
const x = 1000; // ms between requests
httpQueue = new httpQueue(x);

// Runs on init
httpQueue.newRequest('https://google.co.uk', function(data) {
	console.log(data);
});
// Runs 1000ms later
httpQueue.newRequest('https://github.com', function(data) {
	console.log(data);
});
```

Alternatively, `newRequest` takes an object as its first parameter;

```javascript
var options = {
	url: https://jsonplaceholder.typicode.com/posts/1
}
queue.newRequest(options, function(data) {
	console.log(data);
});
```

You can also pass functions as variables for multi-use, and handle errors in their own function
```javascript
let onResponse = function(data) {
	console.log(data);
}
let error = function(err) {
	console.log(err);
	// Do something with the error...
}
httpQueue.newRequest('https://twitter.com', onResponse, error);
```

### Parameters:

| Parameter | Example |
| ------------- | ------------------------------------- |
| url | 'http://example.com/' |
| method | 'GET' |
| headers | { Content-Type': 'application/json' } |
| body | `JSON data` |


| Content-Type supported: |
| ------------------------------------- |
| application/json |
| application/x-www-form-urlencoded |

You can also define the URL in its constituent parts, e.g.

| Parameter | Example |
| ------------- | ------------------------------------- |
| options.protocol | 'http' |
| options.hostname | 'example.com' |
| options.host | 'example.com:8888' |
| options.path | '/get/the/path/' |
| options.port | 8888 |



# Contribute
Have a feature request, spotted an issue? Get in touch or make a pull request: 
https://github.com/ChrisWoollon/http-queue

# Disclaimer
This is not a mature module. It's a simple module, but it's brand new, and there are no tests.