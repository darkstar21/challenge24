var NumberQueue = Numbers.extend({
  initialize: function(){
    for(var i = 0; i < 4; i++){
      var number = Math.floor(Math.random()*13+1)
      this.add(new NumberModel({value: number, display: ""+number}));
    }

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