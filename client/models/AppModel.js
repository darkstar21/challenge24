var AppModel = Backbone.Model.extend({

  initialize: function(){
    this.resetApp();

    //Moving number from queue to computation. Only allowed if computation has 0 or 1 numbers
    this.get('numQueue').on('dequeue', function(number){
      if(this.get('numComputingValues') < 2){  
        this.get('numQueue').remove(number);
        if(this.get('numComputingValues') === 0){
          this.get('computeQueue').reset([number, new NumberModel({})]);
        } else {
          this.get('computeQueue').reset([this.get('computeQueue').at(0), number]);
        }
        this.set('numComputingValues', this.get('numComputingValues')+1);
      }
    }, this);

    //Moving number from computation to queue. Always allowed.
    this.get('computeQueue').on('dequeue', function(number){
      this.get('computeQueue').remove(number);
      this.get('computeQueue').add(new NumberModel({}));
      this.get('numQueue').add(number);
      this.set('numComputingValues', this.get('numComputingValues')-1);
    }, this);

    this.get('numQueue').on('win', function(){
      alert("You won! Your time was " + this.get('timer') + " seconds");
      clearInterval(myVar);
      document.getElementById("demo").innerHTML = 'Timer: '
      var view = new AppView({model: new AppModel()});
      $('.board').html('');
      view.$el.appendTo($('.board'));
    }, this);

    this.get('operation').on('newValue', function(){
      this.trigger('update');
    }, this);
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
      document.getElementById("demo").innerHTML = 'Timer: ' + Math.floor(diff);
      return Math.floor(diff);
    }

  },

  //Fill in initial values for a new game
  resetApp: function(){
    this.set('startingNums', []);
    var numArray = this.generateValidNums();
    for(var i = 0; i < numArray.length; i++){
      this.get('startingNums').push(new NumberModel({value: numArray[i], display: ""+numArray[i]}));
    }
    this.set('numQueue', new NumberQueue(this.get('startingNums')));
    this.set('computeQueue', new ComputeQueue([new NumberModel({}), new NumberModel({})]));
    this.set('operation', new OperationModel());
    this.set('numComputingValues', 0);
    this.set('timer', 0);
    this.set('startDate', new Date());
  },

  //Compute new number only if there are 2 numbers in computation area
  compute: function(){
    if(this.get('computeQueue').length === 2){
      var one = this.get('computeQueue').at(0).getValue();
      var two = this.get('computeQueue').at(1).getValue();
      var operation = this.get('operation').getValue();
      var calculate = this.calculateValue(one, two, operation);
      this.get('computeQueue').reset([new NumberModel({}), new NumberModel({})]);
      this.get('numQueue').add({value: calculate[0], display: calculate[1]});
      this.set('numComputingValues', 0);
    } else{
      alert("Need two numbers to do a computation!")
    }
  },

  calculateValue: function(one, two, operation){
    var text, result;
    if(operation === '+'){
      result = one+two;
    } else if(operation === '-'){
      result = one-two;
    } else if(operation === '*'){
      result = one*two;
    } else{
      result = one/two;
    }
    if(result % 1 !== 0){
      var f = new Fraction(result);
      text = f.numerator + '/' + f.denominator;
    } else{
      text = '' + result;
    }
    return [result, text];
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
  },

  generateValidNums: function(){
    var numArray = [];
    for(var i = 0; i < 4; i++){
      numArray.push(Math.floor(Math.random()*13+1));
    }
    while(!this.isValid(numArray)){
      numArray = [];
      for(var i = 0; i < 4; i++){
        numArray.push(Math.floor(Math.random()*13+1));
      }
    }
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
              if(operators[thirdOp](operators[secondOp](operators[firstOp](currentNums[0], currentNums[1]), currentNums[2]), currentNums[3]) === 24 ||
              operators[thirdOp](operators[firstOp](currentNums[0], operators[secondOp](currentNums[1], currentNums[2])), currentNums[3]) === 24 ||
              operators[secondOp](operators[firstOp](currentNums[0], currentNums[1]), operators[thirdOp](currentNums[2], currentNums[3])) === 24 ||
              operators[firstOp](currentNums[0], operators[thirdOp](operators[secondOp](currentNums[1], currentNums[2]), currentNums[3])) === 24 ||
              operators[firstOp](currentNums[0], operators[secondOp](currentNums[1], operators[thirdOp](currentNums[2], currentNums[3]))) === 24){
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
    }
    recurse([], numArray);
    return possible;
  }

});