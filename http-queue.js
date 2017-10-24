const https = require('https');
const http = require('http');
const { URL } = require('url');
module.exports = class HttpQueue {

	constructor(wait) {
		this.wait = wait;
	}

	parseUrl(options) {
		let urlObject = new URL(options.url);
		options.protocol = urlObject.protocol || 'http:';
		options.host = urlObject.host || 'localhost';
		options.hostname = urlObject.hostname || 'localhost';
		options.path = (urlObject.pathname + urlObject.search) || '/';
		options.port = urlObject.port || (options.protocol === 'https:' ? 443 : 80);
		return options;
	}

	getProtocolObject(options) {
		if (typeof options === 'object' && options.protocol) {
			return options.protocol === 'https:' ? https : http;
		} else {
			return https;
		}
	}

	newRequest(options = {}, callback = null, error = null, wait = null) {
		if (typeof options === 'string') {
			options = { url: options };
		}
		if (typeof options === 'object' && options.url) {
			this.parseUrl(options);
		}
		wait = wait || this.wait;
		delay(wait, () => {
			let protocol = this.getProtocolObject(options);
			return this.makeRequest(protocol,options,callback,error);
		});
	}

	getBody(options) {
		let noBodyMethods = ['GET', 'DELETE', 'OPTIONS', 'HEAD'];
		if (
			typeof options === 'object' &&
			noBodyMethods.indexOf(options.method) === -1 &&
			options.body
		) {
			return options.body;
		} else {
			return null;
		}
	}
	
	makeRequest(protocol, options, callback = null, error = null) {
		let body = this.getBody(options);
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
