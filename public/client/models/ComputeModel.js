var ComputeModel = Backbone.Model.extend({
	initialize: function(){
		this.set('computeQueue', new ComputeQueue([new NumberModel({}), new NumberModel({})]));
		this.set('operation', new OperationModel());
		this.set('numComputingValues', 0);
		this.set('answer', []);
	},

	compute: function(){
	    if(this.get('numComputingValues') == 2){
	        var one = this.get('computeQueue').at(0).getValue();
	        var two = this.get('computeQueue').at(1).getValue();
	        var operation = this.get('operation').getValue();
	        this.get('computeQueue').reset([new NumberModel({}), new NumberModel({})]);
	        this.set('numComputingValues', 0);
	        this.set('answer', this.calculateValue(one, two, operation));
	    } else{
	        alert("Need two numbers to do a computation!");
	    }
	},

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

	//Clear out computation area, move numbers back to queue
	clearComputeArea: function(){
		var addToNumQueue = [];
	    this.get('computeQueue').each(function(number){
	        if(number.get('value')){
	        	addToNumQueue.push(number);
	        }
	    }, this);
	    this.get('computeQueue').reset([new NumberModel({}), new NumberModel({})]);
	    this.set('numComputingValues', 0);
	    return addToNumQueue;
	}
});
