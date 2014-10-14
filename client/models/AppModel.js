var AppModel = Backbone.Model.extend({

  initialize: function(){
    this.set('startingNums', []);
    for(var i = 0; i < 4; i++){
      var number = Math.floor(Math.random()*13+1);
      this.get('startingNums').push(new NumberModel({value: number, display: ""+number}));
    }
    this.set('numQueue', new NumberQueue(this.get('startingNums')));
    this.set('computeQueue', new ComputeQueue([new NumberModel({}), new NumberModel({})]));
    this.set('operation', new OperationModel());
    this.set('numComputingValues', 0);

    //Moving number from queue to computation. Only allowed if computation has 0 or 1 numbers
    this.get('numQueue').on('dequeue', function(number){
      if(this.get('numComputingValues') < 2){  
        this.get('numQueue').remove(number);
        this.set('numComputingValues', this.get('numComputingValues')+1);
        if(this.get('numComputingValues') === 1){
          this.get('computeQueue').reset([number, new NumberModel({})]);
        } else {
          this.get('computeQueue').reset([this.get('computeQueue').at(0), number]);
        }
      }
    }, this);

    //Moving number from computation to queue. Always allowed.
    this.get('computeQueue').on('dequeue', function(number){
      this.get('computeQueue').remove(number);
      this.get('computeQueue').add(new NumberModel({}));
      this.get('numQueue').add(number);
      this.set('numComputingValues', this.get('numComputingValues')-1);
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
      this.get('computeQueue').reset([new NumberModel({}), new NumberModel({})]);
      this.get('numQueue').add({value: result, display: text});
      this.set('numComputingValues', 0);
    } else{
      console.log("Need two numbers to do a computation!")
    }
  },

  //Clear out computation area, move numbers back to queue
  clearComputeArea: function(){
    this.get('computeQueue').each(function(number){
      if(number.get('value')){
        this.get('numQueue').add(number);
      }
    }, this);
    this.get('computeQueue').reset([new NumberModel({}), new NumberModel({})]);
    this.set('numComputingValues', 0);
  },

  //Clear computing area and set queue back to original numbers
  reset: function(){
    this.get('numQueue').reset(this.get('startingNums'));
    this.get('computeQueue').reset([new NumberModel({}), new NumberModel({})]);
    this.set('numComputingValues', 0);
  }

});