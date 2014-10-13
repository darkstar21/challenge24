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