const https = require('https');
const http = require('http');
const { URL } = require('url');
module.exports = class HttpQueue {
	
	constructor(wait) {
		this.wait = wait;
	}

	newRequest(options, callback = null, error = null) {
		options = options || {};
		if (typeof options === 'object' && options.url) {
			let urlObject = new URL(options.url);
			delete options.url;
			options.protocol = urlObject.protocol || 'http:';
			options.host = urlObject.host || 'localhost';
			options.hostname = urlObject.hostname || 'localhost';
			options.path = (urlObject.pathname + urlObject.search) || '/';
			options.port = urlObject.port || (options.protocol === 'https:' ? 443 : 80);
		}
		delay(this.wait, () => {
			let protocol = http;
			if (typeof options === 'string') {
				protocol = options.indexOf('https://') > -1 ? https : http;
			} else if (typeof options === 'object' && options.protocol) {
				protocol = options.protocol === 'https:' ? https : http;
			}
			return this.makeRequest(protocol,options,callback,error);
		});
	}
	
	makeRequest(protocol, options, callback = null, error = null) {
		let body = null;
		if (
			typeof options === 'object' &&
			options.method !== 'GET' &&
			options.method !== 'DELETE' &&
			options.body
		) {
			body = options.body;
			delete options.body;
		}
		let req = protocol.request(options, (resp) => {
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

		if (body) {
			req.write(body);
		}
		req.end();
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
