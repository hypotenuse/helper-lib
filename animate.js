;
(function(_) {
	
	var dateNowInitial, performanceNow, raf, caf

	,getDateNow = function() {
		return Date.now && Date.now() || +new Date();
	}

	,nonPrimitive = function(input) {
		var type = typeof input;
		if (input !== null && (type == 'object' || type == 'function')) {
			return true;
		}
	}

	,isNumeric = function(input) {
		return !isNaN(parseFloat(input)) && isFinite(input);
	}

	,isArray = function(input) {
		return Object.prototype.toString.call(input) == '[object Array]';
	}

	,isString = function(input) {
		return typeof input == 'string';
	}

	,isF = function(input) {
		return typeof input == 'function';
	}

	,trim = function(input) {
		return input.replace(/^\s+|\s+$/g, '');
	}

	,timingFunctionRe = /^(?:easeIn|easeOut|easeInOut)(?:Quad|Cubic|Quart|Quint|Sine|Expo|Circ|Elastic|Back|Bounce)$/i

	/*
	 *
	 * TERMS OF USE - EASING EQUATIONS
	 * 
	 * Open source under the BSD License. 
	 * 
	 * Copyright © 2001 Robert Penner
	 * All rights reserved.
	 * 
	 * Redistribution and use in source and binary forms, with or without modification, 
	 * are permitted provided that the following conditions are met:
	 * 
	 * Redistributions of source code must retain the above copyright notice, this list of 
	 * conditions and the following disclaimer.
	 * Redistributions in binary form must reproduce the above copyright notice, this list 
	 * of conditions and the following disclaimer in the documentation and/or other materials 
	 * provided with the distribution.
	 * 
	 * Neither the name of the author nor the names of contributors may be used to endorse 
	 * or promote products derived from this software without specific prior written permission.
	 * 
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
	 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
	 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
	 * OF THE POSSIBILITY OF SUCH DAMAGE. 
	 *
	 */
	,easing = {
		
		// Quad
		easeInQuad: function (t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		easeOutQuad: function (t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad: function (t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},

		// Cubic
		easeInCubic: function (t, b, c, d) {
			return c * (t /= d) * t * t + b;
		},
		easeOutCubic: function (t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		},
		easeInOutCubic: function (t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t + b;
			}
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		},

		// Quart
		easeInQuart: function (t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		easeOutQuart: function (t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		easeInOutQuart: function (t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t + b;
			}
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},

		// Quint
		easeInQuint:  function (t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		},
		easeOutQuint: function (t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		easeInOutQuint: function (t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t * t + b;
			}
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},

		// Sine
		easeInSine: function (t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		easeOutSine: function (t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		easeInOutSine: function (t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		},

		// Expo
		easeInExpo: function (t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		easeOutExpo: function (t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		easeInOutExpo: function (t, b, c, d) {
			if (t == 0) {
				return b;
			}
			if (t == d) {
				return b + c;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			}
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},

		// Circ
		easeInCirc: function (t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		},
		easeOutCirc: function (t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		},
		easeInOutCirc: function (t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			}
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		},

		// Elastic
		easeInElastic: function (t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) {
				return b; 
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * .3;
			}
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p )) + b;
		},
		easeOutElastic: function (t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * .3;
			}
			if (a < Math.abs(c)) { 
				a = c; 
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		easeInOutElastic: function (t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t==0) {
				return b;
			}
			if ((t /= d / 2) == 2) {
				return b + c;
			}
			if (!p) {
				p = d * (.3 * 1.5);
			}
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			if (t < 1) {
				return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			}
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
		},

		// Back
		easeInBack: function (t, b, c, d, s) {
			if (s == void(0)) {
				s = 1.70158;
			}
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		easeOutBack: function (t, b, c, d, s) {
			if (s == void(0)) {
				s = 1.70158;
			}
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		easeInOutBack: function (t, b, c, d, s) {
			if (s == void(0)) {
				s = 1.70158;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},

		// Bounce
		easeInBounce: function (t, b, c, d) {
			return c - this.easeOutBounce(d - t, 0, c, d) + b;
		},
		easeOutBounce: function (t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			}
			else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			}
			else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			}
			else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
			}
		},
		easeInOutBounce: function (t, b, c, d) {
			if (t < d/2) {
				return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
			}
			return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
		}
	}

	// In order to get current app time
	if (_.performance && (_.performance.now || _.performance.webkitNow /* Chrome 20 - 23 */)) {
		if ('now' in _.performance) {
			performanceNow = function() {
				return _.performance.now();
			}
		}
		else {
			performanceNow = function() {
				return _.performance.webkitNow();
			}
		}
	}
	// window.performance.now fallback
	else {

		dateNowInitial = getDateNow();

		if (_.performance && _.performance.timing && _.performance.timing.navigationStart)
			dateNowInitial = _.performance.timing.navigationStart;

		performanceNow = function() {
			return getDateNow() - dateNowInitial;
		}
	}
	// timestamp (with sub-millisecond precision): https://developers.google.com/web/updates/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
	// We use different approach of using the timestamp
	raf = (function() {
		if (_.requestAnimationFrame) {
			caf = function(rafId) {
				return _.cancelAnimationFrame(rafId);
			}
			return function(callback, initialTime) {
				_.requestAnimationFrame(function(timestamp) {
					callback(performanceNow() - initialTime);
				});
			}
		}
		else if (_.webkitRequestAnimationFrame) {
			caf = function(rafId) {
				return (_.webkitCancelAnimationFrame || /* Chrome 10 - 17 */ _.webkitCancelRequestAnimationFrame)(rafId);
			}
			return function(callback, initialTime) {
				_.webkitRequestAnimationFrame(function(timestamp) {
					callback(performanceNow() - initialTime);
				});
			}
		}
		else if (_.mozRequestAnimationFrame) {
			caf = function(rafId) {
				return _.mozCancelAnimationFrame(rafId);
			}
			return function(callback, initialTime) {
				_.mozRequestAnimationFrame(function(timestamp) {
					callback(performanceNow() - initialTime);
				});
			}
		}
		else if (_.msRequestAnimationFrame) {
			caf = function(rafId) {
				return _.msCancelAnimationFrame(rafId);
			}
			return function(callback, initialTime) {
				_.msRequestAnimationFrame(function(timestamp) {
					callback(performanceNow() - initialTime);
				});
			}
		}
		else if (_.oRequestAnimationFrame) {
			caf = function(rafId) {
				return _.oCancelAnimationFrame(rafId);
			}
			return function(callback, initialTime) {
				_.oRequestAnimationFrame(function(timestamp) {
					callback(performanceNow() - initialTime);
				});
			}
		}
		// No requestAnimationFrame use old school timers
		else {
			caf = function(id) {
				return _.clearTimeout(id);
			}
			return function(callback, initialTime) {
				return _.setTimeout(function() {

					callback(performanceNow() - initialTime);
				
				}, 1000 / 60 /* approx 60fps */);
			}
		}
	})();

	// Export animate function
	_.animate = function(options) {

		var _options = {}, initialTime, rafId;
		
		if (nonPrimitive(options)) {
			// duration
			if (!isNumeric(options.duration)) {
				_options.duration = 1e3;
			}
			else {
				_options.duration = +options.duration;
			}
			// range
			if (!isArray(options.range)) {
				_options.range = [0, 1];
			}
			else {
				if (isNumeric(options.range[0]) && isNumeric(options.range[1])) {
					_options.range = [
						+options.range[0], +options.range[1]
					];
				}
				else {
					_options.range = [0, 1];
				}
			}
			// timing
			if (isString(options.timing) && timingFunctionRe.test(trim(options.timing))) {
				_options.timing = trim(options.timing);
			}
			else {
				_options.timing = 'easeInQuad';
			}
			// complete
			if (isF(options.complete)) {
				_options.complete = options.complete;
			}
			else {
				_options.complete = void(0);
			}
			// render
			if (isF(options.render)) {
				_options.render = options.render;
			}
			else {
				_options.render = void(0);
			}
			if (isF(_options.render)) {

				// Animation start (initial) time
				initialTime = performanceNow();
				
				rafId = raf(function animate(animationDur) {
					
					var easingResult, animationEnd;

					if (animationDur >= _options.duration) {
						animationDur = _options.duration;
						animationEnd = true;
					}

					// t, b, c, d
					easingResult = easing[_options.timing]
						(
						
						  animationDur
						 ,_options.range[0]
						 ,_options.range[1] - _options.range[0]
						 ,_options.duration

						);

					_options.render(easingResult);

					// Cancel/Clear animation frame
					if (animationEnd) {
						caf(rafId);
						if (isF(_options.complete)) {
							_options.complete();
						}
					}
					// Request another animation frame
					else {
						rafId = raf(animate, initialTime);
					}
				}, initialTime);
			}
		}
		else {
			throw new TypeError('Invalid type. An object should be passed');
		}
	}

}(typeof window != 'object' ? this : window));

/*

	var anim = animate({
		duration: 2000,
		range: [5, 215],
		timing: 'easeInQuad',
		complete: function() {
			// Call after animation end
		},
		render: function(renderedValue) {
			console.log(renderedValue);
		}
	});
	
	// action -> anim.stop()

	// action -> anim.continue()

*/