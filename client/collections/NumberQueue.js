var NumberQueue = Numbers.extend({
  initialize: function(params){

    this.on('add', function(number){
      if(this.length === 1){
        if(number.getValue() === 24){
          this.trigger('win');
          console.log("You won");
        }
      }
    }, this);
  }
});