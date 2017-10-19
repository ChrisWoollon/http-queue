const https = require('https');

module.exports = class HttpRequester {
	
	constructor(wait) {
		this.wait = wait;
		this.requests = [];
	}

	newRequest(url, callback = null, error = null) {
		delay(this.wait, () => {
			return this.makeRequest(url,callback,error);
		});
	}
	
	makeRequest(url,callback = null, error = null) {
		https.get(url, (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});
			resp.on('end', () => {
				if (callback)
					callback(data);
				else 
					console.log(data);
				return data;
			});
		}).on("error", (err) => {
			if (error)
				error(err);
			else
				console.log("Error: " + err.message);
			return error;
		});
	}

};

var delay = (function() {
  var queue = [];

  function processQueue() {
	if (queue.length > 0) {
	  setTimeout(function (cc) {
		queue.shift().cb(cc);
		processQueue();
	  }, queue[0].delay);
	}
  }

  return function delayed(delay, cb) {
	queue.push({ delay: delay, cb: cb });
	if (queue.length === 1) {
	  processQueue();
	}
  };
}());
