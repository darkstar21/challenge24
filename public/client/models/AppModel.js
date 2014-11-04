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
        // url: 'http://localhost:4568/recordTime',
        url: 'http://challenge24.azurewebsites.net/recordTime',
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
      // url: 'http://localhost:4568/averageTime',
      url: 'http://challenge24.azurewebsites.net/averageTime',
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
