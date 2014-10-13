var ComputeQueue = Numbers.extend({
  initialize: function(){
    this.on('dequeue', function(number) {
      if(this.length > 1){
        this.remove(number)
      }
    });
  }
});