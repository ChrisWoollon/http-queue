# http-queue
Queue HTTPS requests to, for example, limit the number of API requests made in X amount of time

# Usage

Currently, only GET requests to https are supported

```javascript
let httpQueue = require('http-queue');
httpQueue = new httpQueue(1000);

// Runs on init
httpQueue.newRequest('https://google.co.uk', function(data) {
	console.log(data);
});
// Runs 1000ms later
httpQueue.newRequest('https://github.com', function(data) {
	console.log(data);
});
```
