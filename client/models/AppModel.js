var AppModel = Backbone.Model.extend({

  initialize: function(){
    this.set('numQueue', new NumberQueue());
    this.set('computeQueue', new ComputeQueue());
    this.set('operation', new OperationModel());

    //Moving number from queue to computation. Only allowed if computation has 0 or 1 numbers
    this.get('numQueue').on('dequeue', function(number){
      if(this.get('computeQueue').length < 2){
        this.get('numQueue').remove(number);
        this.get('computeQueue').add(number);
      }
    }, this);

    //Moving number from computation to queue. Always allowed.
    this.get('computeQueue').on('dequeue', function(number){
      this.get('computeQueue').remove(number);
      this.get('numQueue').add(number);
    }, this);

  },

  //Compute new number only if there are 2 numbers in computation area
  compute: function(){
    if(this.get('computeQueue').length === 2){
      var one = this.get('computeQueue').at(0).getValue();
      var two = this.get('computeQueue').at(1).getValue();
      var operation = this.get('operation').getValue();
      var result, text;
      if(operation === '+'){
        result = one+two;
        text = ""+result;
      } else if(operation === '-'){
        result = one-two;
        text = ""+result;      
      } else if(operation === '*'){
        result = one*two;
        text = ""+result;
      } else{
        result = one/two;
        if(one % two !== 0){
          text = "" + one + "/" + two;
        } else{
          text = result;
        }
      }
      this.get('computeQueue').reset();
      this.get('numQueue').add({value: result, display: text});
    } else{
      console.log("Need two numbers to do a computation!")
    }
  },

  //Clear out computation area, move numbers back to queue
  clearComputeArea: function(){
    //var system = this;
    this.get('computeQueue').each(function(number){
      this.get('numQueue').add(number);
    }, this);
    this.get('computeQueue').reset();
  }

});