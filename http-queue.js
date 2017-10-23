const https = require('https');
const http = require('http');

module.exports = class HttpQueue {
	
	constructor(wait) {
		this.wait = wait;
	}

	newRequest(url, callback = null, error = null) {
		delay(this.wait, () => {
			let protocol = url.indexOf('https://') > -1 ? https : http;
			return this.makeRequest(protocol,url,callback,error);
		});
	}
	
	makeRequest(protocol, url, callback = null, error = null) {
		protocol.get(url, (resp) => {
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

	getInterval() {
		return this.wait;
	}

	setInterval(x) {
		this.wait = x;
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
