var NumberQueue = Numbers.extend({
  initialize: function(){
    for(var i = 0; i < 4; i++){
      var number = Math.floor(Math.random()*13+1)
      this.add(new NumberModel(number, ""+number));
    }
    this.on('dequeue', function(number) {
      if(this.length > 1){
        this.remove(number)
      }
    });
  }
});