/*
fraction.js
A Javascript fraction library.

Copyright (c) 2009  Erik Garrison <erik@hypervolu.me>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


/* Fractions */
/*
 *
 * Fraction objects are comprised of a numerator and a denomenator.  These
 * values can be accessed at fraction.numerator and fraction.denomenator.
 *
 * Fractions are always returned and stored in lowest-form normalized format.
 * This is accomplished via Fraction.normalize.
 *
 * The following mathematical operations on fractions are supported:
 *
 * Fraction.equals
 * Fraction.add
 * Fraction.subtract
 * Fraction.multiply
 * Fraction.divide
 *
 * These operations accept both numbers and fraction objects.  (Best results
 * are guaranteed when the input is a fraction object.)  They all return a new
 * Fraction object.
 *
 * Usage:
 *
 * TODO
 *
 */

/*
 * The Fraction constructor takes one of:
 *   an explicit numerator (integer) and denominator (integer),
 *   a string representation of the fraction (string),
 *   or a floating-point number (float)
 *
 * These initialization methods are provided for convenience.  Because of
 * rounding issues the best results will be given when the fraction is
 * constructed from an explicit integer numerator and denomenator, and not a
 * decimal number.
 *
 *
 * e.g. new Fraction(1, 2) --> 1/2
 *      new Fraction('1/2') --> 1/2
 *      new Fraction('2 3/4') --> 11/4  (prints as 2 3/4)
 *
 */
var Fraction = function(numerator, denominator)
{
    /* double argument invocation */
    if (typeof numerator !== 'undefined' && denominator) {
        if (typeof(numerator) === 'number' && typeof(denominator) === 'number') {
            this.numerator = numerator;
            this.denominator = denominator;
        } else if (typeof(numerator) === 'string' && typeof(denominator) === 'string') {
            // what are they?
            // hmm....
            // assume they are ints?
            this.numerator = parseInt(numerator);
            this.denominator = parseInt(denominator);
        }
    /* single-argument invocation */
    } else if (typeof denominator === 'undefined') {
        num = numerator; // swap variable names for legibility
        if (typeof(num) === 'number') {  // just a straight number init
            this.numerator = num;
            this.denominator = 1;
        } else if (typeof(num) === 'string') {
            var a, b;  // hold the first and second part of the fraction, e.g. a = '1' and b = '2/3' in 1 2/3
                       // or a = '2/3' and b = undefined if we are just passed a single-part number
            var arr = num.split(' ')
            if (arr[0]) a = arr[0]
            if (arr[1]) b = arr[1]
            /* compound fraction e.g. 'A B/C' */
            //  if a is an integer ...
            if (a % 1 === 0 && b && b.match('/')) {
                return (new Fraction(a)).add(new Fraction(b));
            } else if (a && !b) {
                /* simple fraction e.g. 'A/B' */
                if (typeof(a) === 'string' && a.match('/')) {
                    // it's not a whole number... it's actually a fraction without a whole part written
                    var f = a.split('/');
                    this.numerator = f[0]; this.denominator = f[1];
                /* string floating point */
                } else if (typeof(a) === 'string' && a.match('\.')) {
                    return new Fraction(parseFloat(a));
                /* whole number e.g. 'A' */
                } else { // just passed a whole number as a string
                    this.numerator = parseInt(a);
                    this.denominator = 1;
                }
            } else {
                return undefined; // could not parse
            }
        }
    }
    this.normalize();
}


Fraction.prototype.clone = function()
{
    return new Fraction(this.numerator, this.denominator);
}


/* pretty-printer, converts fractions into whole numbers and fractions */
Fraction.prototype.toString = function()
{
    if (this.denominator==='NaN') return 'NaN'
    var wholepart = (this.numerator/this.denominator>0) ?
      Math.floor(this.numerator / this.denominator) :
      Math.ceil(this.numerator / this.denominator)
    var numerator = this.numerator % this.denominator
    var denominator = this.denominator;
    var result = [];
    if (wholepart != 0)
        result.push(wholepart);
    if (numerator != 0)
        result.push(((wholepart===0) ? numerator : Math.abs(numerator)) + '/' + denominator);
    return result.length > 0 ? result.join(' ') : 0;
}


/* destructively rescale the fraction by some integral factor */
Fraction.prototype.rescale = function(factor)
{
    this.numerator *= factor;
    this.denominator *= factor;
    return this;
}


Fraction.prototype.add = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction) {
        b = b.clone();
    } else {
        b = new Fraction(b);
    }
    td = a.denominator;
    a.rescale(b.denominator);
    b.rescale(td);

    a.numerator += b.numerator;

    return a.normalize();
}


Fraction.prototype.subtract = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction) {
        b = b.clone();  // we scale our argument destructively, so clone
    } else {
        b = new Fraction(b);
    }
    td = a.denominator;
    a.rescale(b.denominator);
    b.rescale(td);

    a.numerator -= b.numerator;

    return a.normalize();
}


Fraction.prototype.multiply = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction)
    {
        a.numerator *= b.numerator;
        a.denominator *= b.denominator;
    } else if (typeof b === 'number') {
        a.numerator *= b;
    } else {
        return a.multiply(new Fraction(b));
    }
    return a.normalize();
}

Fraction.prototype.divide = function(b)
{
    var a = this.clone();
    if (b instanceof Fraction)
    {
        a.numerator *= b.denominator;
        a.denominator *= b.numerator;
    } else if (typeof b === 'number') {
        a.denominator *= b;
    } else {
        return a.divide(new Fraction(b));
    }
    return a.normalize();
}

Fraction.prototype.equals = function(b)
{
    if (!(b instanceof Fraction)) {
        b = new Fraction(b);
    }
    // fractions that are equal should have equal normalized forms
    var a = this.clone().normalize();
    var b = b.clone().normalize();
    return (a.numerator === b.numerator && a.denominator === b.denominator);
}


/* Utility functions */

/* Destructively normalize the fraction to its smallest representation.
 * e.g. 4/16 -> 1/4, 14/28 -> 1/2, etc.
 * This is called after all math ops.
 */
Fraction.prototype.normalize = (function()
{

    var isFloat = function(n)
    {
        return (typeof(n) === 'number' &&
                ((n > 0 && n % 1 > 0 && n % 1 < 1) ||
                 (n < 0 && n % -1 < 0 && n % -1 > -1))
               );
    }

    var roundToPlaces = function(n, places)
    {
        if (!places) {
            return Math.round(n);
        } else {
            var scalar = Math.pow(10, places);
            return Math.round(n*scalar)/scalar;
        }
    }

    return (function() {

        // XXX hackish.  Is there a better way to address this issue?
        //
        /* first check if we have decimals, and if we do eliminate them
         * multiply by the 10 ^ number of decimal places in the number
         * round the number to nine decimal places
         * to avoid js floating point funnies
         */
        if (isFloat(this.denominator)) {
            var rounded = roundToPlaces(this.denominator, 9);
            var scaleup = Math.pow(10, rounded.toString().split('.')[1].length);
            this.denominator = Math.round(this.denominator * scaleup); // this !!! should be a whole number
            //this.numerator *= scaleup;
            this.numerator *= scaleup;
        }
        if (isFloat(this.numerator)) {
            var rounded = roundToPlaces(this.numerator, 9);
            var scaleup = Math.pow(10, rounded.toString().split('.')[1].length);
            this.numerator = Math.round(this.numerator * scaleup); // this !!! should be a whole number
            //this.numerator *= scaleup;
            this.denominator *= scaleup;
        }
        var gcf = Fraction.gcf(this.numerator, this.denominator);
        this.numerator /= gcf;
        this.denominator /= gcf;
        if ((this.numerator < 0 && this.denominator < 0) || (this.numerator > 0 && this.denominator < 0)) {
            this.numerator *= -1;
            this.denominator *= -1;
        }
        return this;
    });

})();


/* Takes two numbers and returns their greatest common factor.
 */
Fraction.gcf = function(a, b)
{

    var common_factors = [];
    var fa = Fraction.primeFactors(a);
    var fb = Fraction.primeFactors(b);
    // for each factor in fa
    // if it's also in fb
    // put it into the common factors
    fa.forEach(function (factor)
    {
        var i = fb.indexOf(factor);
        if (i >= 0) {
            common_factors.push(factor);
            fb.splice(i,1); // remove from fb
        }
    });

    if (common_factors.length === 0)
        return 1;

    var gcf = (function() {
        var r = common_factors[0];
        var i;
        for (i=1;i<common_factors.length;i++)
        {
            r = r * common_factors[i];
        }
        return r;
    })();

    return gcf;

};


// Adapted from:
// http://www.btinternet.com/~se16/js/factor.htm
Fraction.primeFactors = function(n)
{

    var num = Math.abs(n);
    var factors = [];
    var _factor = 2;  // first potential prime factor

    while (_factor * _factor <= num)  // should we keep looking for factors?
    {
      if (num % _factor === 0)  // this is a factor
        {
            factors.push(_factor);  // so keep it
            num = num/_factor;  // and divide our search point by it
        }
        else
        {
            _factor++;  // and increment
        }
    }

    if (num != 1)                    // If there is anything left at the end...
    {                                // ...this must be the last prime factor
        factors.push(num);           //    so it too should be recorded
    }

    return factors;                  // Return the prime factors
}

var NumberModel = Backbone.Model.extend({
  initialize: function(params) {
    this.set('value', params.value);
    this.set('display', params.display);
  },

  dequeue: function(){
    this.trigger('dequeue', this);
  },

  getValue: function(){
    return this.get('value');
  },

  getText: function(){
    return this.get('display');
  }

});

var OperationModel = Backbone.Model.extend({
  initialize: function(params) {
    this.set('value', '+');
  },

  getValue: function(){
  	return this.get('value');
  },

  nextValue: function(){
  	var operation = this.get('value');
  	if(operation === '+'){
  		this.set('value', '-');
  	} else if(operation === '-'){
  		this.set('value', '*');
  	} else if(operation === '*'){
  		this.set('value', '/');
  	} else{
  		this.set('value', '+');
  	}
  }

});
var ComputeModel = Backbone.Model.extend({
	initialize: function(){
		this.set('computeQueue', new ComputeQueue([new NumberModel({}), new NumberModel({})]));
		this.set('operation', new OperationModel());
		this.set('numComputingValues', 0);

		//When there is a click on one of the two number views
		this.get('computeQueue').on('dequeue', function(number){
			this.get('computeQueue').remove(number);
  		this.get('computeQueue').add(new NumberModel({}));
  		if(this.get('numComputingValues') > 0){
  			this.set('numComputingValues', this.get('numComputingValues')-1);
  		}
  		this.trigger('dequeue', number);
		}, this);

		this.get('operation').on('change:value', function(){
      		this.trigger('update');
    	}, this);
	},

	//Compute new number only if there are 2 numbers in computation area
	compute: function(){
      if(this.get('numComputingValues') === 2){
        var one = this.get('computeQueue').at(0).getValue();
        var two = this.get('computeQueue').at(1).getValue();
        var operation = this.get('operation').getValue();
        this.clear();
        this.trigger('answer', this.calculateValue(one, two, operation));
      } else{
        alert("Need two numbers to do a computation!");
      }
	},

	//Clear computation area and reset values
	clear: function(){
		this.get('computeQueue').reset([new NumberModel({}), new NumberModel({})]);
		this.set('numComputingValues', 0);
	},

	//Takes two numbers and an operation, returns an array containing the calculated value and a nice string representation of it.
	calculateValue: function(one, two, operation){
		var text, result, flag = false;
		if(operation === '+'){
      result = one+two;
		} else if(operation === '-'){
      result = one-two;
		} else if(operation === '*'){
      result = one*two;
		} else{
      flag = true;
      result = one/two;
		}
		if(result % 1 !== 0){
			var f;
      if(flag){
      	f = new Fraction(one, two);
      } else{
      	f = new Fraction(result);
      }
			text = f.numerator + '/' + f.denominator;
		} else{
			text = '' + result;
		}
		return [result, text];
	},

	addNum: function(number){
		if(this.get('numComputingValues') === 0){
      this.setComputeQueue([number, new NumberModel({})]);
    } else {
      this.setComputeQueue([this.get('computeQueue').at(0), number]);
    }
	},

	getNumComputingValues: function(){
		return this.get('numComputingValues');
	},

	setComputeQueue: function(numModelArray){
		this.get('computeQueue').reset(numModelArray);
		this.set('numComputingValues', this.get('numComputingValues')+1);
	}
});

//URL NEEDS TO BE CHANGED DEPENDING ON SERVER
var AppModel = Backbone.Model.extend({

  initialize: function(){
    //Set initial values
    this.resetApp();

    //Moving number from queue to computation area. Only allowed if computation area has 0 or 1 numbers
    this.get('numQueue').on('dequeue', function(number){
      var numComputingValues = this.get('computeModel').getNumComputingValues();
      if(numComputingValues < 2){
        this.get('numQueue').remove(number);
        this.get('computeModel').addNum(number);
      }
    }, this);

    //Moving number from computation area to queue. Always allowed.
    this.get('computeModel').on('dequeue', function(number){
      this.get('numQueue').add(number);
    }, this);

    this.get('computeModel').on('answer', function(answer){
      this.get('numQueue').add(new NumberModel({value: answer[0], display: answer[1]}));
    }, this);

    this.get('numQueue').on('win', function(){
      clearInterval(myVar);
      alert("You won! Your time was " + this.get('timer') + " seconds");
      //URL NEEDS TO BE CHANGED DEPENDING ON SERVER
      $.ajax({
        url: 'http://localhost:4568/recordTime',
        //url: 'http://challenge24.azurewebsites.net/recordTime',
        type: 'POST',
        data: {
          time: this.get('timer')
        }
      }).done(function(){
        var view = new AppView({model: new AppModel()});
        $('.board').html('');
        view.$el.appendTo($('.board'));
      });
    }, this);

    //Setup timer
    var that = this;
    var myVar = setInterval(function(){
      that.set('timer', myTimer());
    }, 1000);

    var myTimer = function() {
      var d = new Date();
      var diff = (d-that.get('startDate'))/1000;
      if(diff % 1 > 0.5){
        diff -= 0.5
      }
      document.getElementById("timer").innerHTML = 'Timer: ' + Math.floor(diff);
      return Math.floor(diff);
    }
  },

  //Fill in initial values for a new game
  resetApp: function(){
    this.set('startingNums', []);
    this.set('hint', '');
    var numArray = this.generateValidNums();
    for(var i = 0; i < numArray.length; i++){
      this.get('startingNums').push(new NumberModel({value: numArray[i], display: ""+numArray[i]}));
    }
    this.set('numQueue', new NumberQueue(this.get('startingNums')));
    this.set('computeModel', new ComputeModel());
    this.set('timer', 0);
    this.set('startDate', new Date());

    var that = this;
    //URL NEEDS TO BE CHANGED DEPENDING ON SERVER
    $.ajax({
      url: 'http://localhost:4568/averageTime',
      //url: 'http://challenge24.azurewebsites.net/averageTime',
      type: 'GET'
    }).done(function(average){
      that.set('averageTime', average);
      that.trigger('update');
    });
  },

  //Clear computing area and set queue back to original numbers
  reset: function(){
    this.get('numQueue').reset(this.get('startingNums'));
    this.get('computeModel').clear();
  },

  generateValidNums: function(){
    var numArray;
    do {
      numArray = [];
      for(var i = 0; i < 4; i++){
        numArray.push(Math.floor(Math.random()*13+1));
      }
    } while(!this.isValid(numArray))

    return numArray;
  },

  //Checks to see if the input numbers are valid
  isValid: function(numArray){
    var possible = false;

    var operators = {
      '+': function(a, b) { return a + b },
      '-': function(a, b) { return a - b },
      '*': function(a, b) { return a * b },
      '/': function(a, b) { return a / b }
    };

    //Turns 0, 1, 2, 3 into +, -, *, /
    var opString = function(num){
      if(num === 0){
        return '+';
      } else if(num === 1){
        return '-';
      } else if(num === 2){
        return '*';
      } else{
        return '/';
      }
    };

    var that = this;

    var recurse = function(currentNums, remainingNums){
      if(remainingNums.length === 0){
        //have unique order of numbers, loop through each operator in the three positions
        var firstOp, secondOp, thirdOp;
        for(var i = 0; i < 4; i++){
          firstOp = opString(i);
          for(var j = 0; j < 4; j++){
            secondOp = opString(j);
            for(var k = 0; k < 4; k++){
              thirdOp = opString(k);
              if(operators[thirdOp](operators[secondOp](operators[firstOp](currentNums[0], currentNums[1]), currentNums[2]), currentNums[3]) === 24){
                that.set('hint', '? ' + thirdOp + ' ' + currentNums[3] + ' = 24');
                possible = true;
                return;
              } else if (operators[thirdOp](operators[firstOp](currentNums[0], operators[secondOp](currentNums[1], currentNums[2])), currentNums[3]) === 24){
                that.set('hint', '? ' + thirdOp + ' ' + currentNums[3] + ' = 24');
                possible = true;
                return;
              } else if(operators[secondOp](operators[firstOp](currentNums[0], currentNums[1]), operators[thirdOp](currentNums[2], currentNums[3])) === 24){
                that.set('hint', '' + operators[firstOp](currentNums[0], currentNums[1]) + ' ' + secondOp + ' ? = 24');
                possible = true;
                return;
              } else if(operators[firstOp](currentNums[0], operators[thirdOp](operators[secondOp](currentNums[1], currentNums[2]), currentNums[3])) === 24){
                that.set('hint', currentNums[0] + ' ' + firstOp + ' ? = 24');
                possible = true;
                return;
              } else if(operators[firstOp](currentNums[0], operators[secondOp](currentNums[1], operators[thirdOp](currentNums[2], currentNums[3]))) === 24){
                that.set('hint', currentNums[0] + ' ' + firstOp + ' ? = 24');
                possible = true;
                return;
              }
            }
          }
        }
      } else{
        for(var i = 0; i < remainingNums.length; i++){
          var tempRemaining = remainingNums.slice(0);
          var tempCurrent = currentNums.slice(0);
          tempRemaining.splice(i,1);
          tempCurrent.push(remainingNums[i]);
          recurse(tempCurrent, tempRemaining);
        }
      }
    };
    recurse([], numArray);
    return possible;
  }

});

var Numbers = Backbone.Collection.extend({

  initialize: function() {
  },

  model: NumberModel

});
var NumberQueue = Numbers.extend({
  initialize: function(params){

    this.on('add', function(number){
      if(this.length === 1){
        if(number.getValue() === 24){
          this.trigger('win');
        }
      }
    }, this);
  }
});
var ComputeQueue = Numbers.extend({
  initialize: function(){
    this.on('dequeue', function(number) {
      if(this.length > 1){
        this.remove(number)
      }
    });
  }
});
var NumberView = Backbone.View.extend({

  className: 'number',

  template: _.template('<span><%= display %></span>'),

  initialize: function(){
    this.model.on('change', function(){
      this.render();
    }, this);
    this.render();
  },

  events: {
    'click': function() {
      this.model.dequeue();
    }
  },

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }

});
var OperationView = Backbone.View.extend({

  className: 'operation',

  template: _.template('<span><%= value %></span>'),

  initialize: function(){
    this.model.on('change', function(){
      this.render();
    }, this);
    this.render();
  },

  events: {
    'click': function() {
      this.model.nextValue();
    }
  },

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }

});
var NumberQueueView = Backbone.View.extend({

  className: 'queue',

  initialize: function() {
    this.collection.on('add', function(){
      this.render();
    }, this);

    this.collection.on('remove', function(){
      this.render();
    }, this);

    this.collection.on('reset', function(){
      this.render();
    }, this);

    this.render();
  },

  render: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();
    this.$el.html('<h3>Number Queue</h3>').append(
      this.collection.map(function(number){
        return new NumberView({model: number}).render();
      })
    );
  }

});
var ComputeView = Backbone.View.extend({
  
  className: 'queue',

  template: _.template('<h3>Computation Area</h3>\
    <div class="computeOne-area"></div>\
    <div class="operation-box"></div>\
    <div class="computeTwo-area"></div>\
    <div class="equals">=</div>\
    <div class="answer-area"></div>\
    <button class="submit-button">Submit</button>'),

  events: {
    'click .submit-button': function() {
      this.model.compute();
    }
  },

  initialize: function() {
    this.oneComputeView = new NumberView({model: this.model.get('computeQueue').at(0)});
    this.twoComputeView = new NumberView({model: this.model.get('computeQueue').at(1)});
    this.operationView = new OperationView({model: this.model.get('operation')});

    this.model.on('change:numComputingValues', function(model) {
      this.oneComputeView = new NumberView({model: this.model.get('computeQueue').at(0)});
      this.twoComputeView = new NumberView({model: this.model.get('computeQueue').at(1)});
      this.render();
    }, this);

    this.model.on('update', function(){
      this.render();
    }, this);
  
    this.render();
  },

  render: function(){
    this.$el.children().detach();
    this.$el.html(this.template);
    this.$('.computeOne-area').html(this.oneComputeView.render());
    this.$('.operation-box').html(this.operationView.el);
    this.$('.computeTwo-area').html(this.twoComputeView.render());
    if(this.model.get('computeQueue').at(1).getValue()){
      var one = this.model.get('computeQueue').at(0).getValue();
      var two = this.model.get('computeQueue').at(1).getValue();
      var op = this.model.get('operation').getValue();
      var calc = this.model.calculateValue(one, two, op);
      this.$('.answer-area').text(calc[1]);
    } else{
      this.$('.answer-area').text('');
    }
  }
});

var AppView = Backbone.View.extend({

  template: _.template('<button class="reset-button">Reset</button> <button class="hint-button">Hint</button>\
    <a href="/logout" class="logout">Logout</a>\
    <div class="average-time">Average Time: </div>\
    <div class="number-queue"></div>\
    <div class="computation-area"></div>\
    <div id="timer">Timer: </div>\
    <div class="hint-area"></div>'),

  events: {
    'click .reset-button': function(){
      this.model.reset();
    },
    'click .hint-button': function(){
      this.$('.hint-area').html('Hint: ' + this.model.get('hint'));
    }
  },

  initialize: function(params){
    this.holderView = new NumberQueueView({collection: this.model.get('numQueue')});
    this.computeView = new ComputeView({model: this.model.get('computeModel')});

    // this.model.on('change:numComputingValues', function(model) {
    //   this.oneComputeView = new NumberView({model: this.model.get('computeQueue').at(0)});
    //   this.twoComputeView = new NumberView({model: this.model.get('computeQueue').at(1)});
    //   this.render();
    // }, this);

    this.model.on('update', function(){
      this.render();
    }, this);

    this.render();
  },

  render: function(){
    this.$el.children().detach();
    this.$el.html(this.template);
    this.$('.number-queue').html(this.holderView.el);
    this.$('.computation-area').html(this.computeView.el);
    this.$('#timer').html('Timer: ' + this.model.get('timer'));

    if(this.model.get('averageTime') !== undefined && this.model.get('averageTime') !== ''){
      this.$('.average-time').text('Average Time: ' + this.model.get('averageTime'));
    }
  }

});

var view = new AppView({model: new AppModel()});
view.$el.appendTo($('div.board'));