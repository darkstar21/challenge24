var ComputeModel = Backbone.Model.extend({
	initialize: function(){
		this.set('computeQueue', new ComputeQueue([new NumberModel({}), new NumberModel({})]));
		this.set('operation', new OperationModel());
		this.set('numComputingValues', 0);
		this.set('answer', []);

		//When there is a click on one of the two number views
		this.get('computeQueue').on('dequeue', function(number){
			this.get('computeQueue').remove(number);
      		this.get('computeQueue').add(new NumberModel({}));
      		if(this.get('numComputingValues') > 0){
      			this.set('numComputingValues', this.get('numComputingValues')-1);
      		}
		}, this);

		this.get('operation').on('change:value', function(){
      		this.trigger('update');
    	}, this);
	},

	//Compute new number only if there are 2 numbers in computation area
	compute: function(){
	    if(this.get('numComputingValues') == 2){
	        var one = this.get('computeQueue').at(0).getValue();
	        var two = this.get('computeQueue').at(1).getValue();
	        var operation = this.get('operation').getValue();
	        this.clear();
	        this.set('answer', this.calculateValue(one, two, operation));
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
		    if(flag){
		    	var f = new Fraction(one, two);
		    } else{
		    	var f = new Fraction(result);
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
