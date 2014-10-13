var AppModel = Backbone.Model.extend({

  initialize: function(){
    this.set('numQueue', new NumberQueue());
    this.set('computeQueue', new ComputeQueue());

    this.get('numQueue').on('remove', function(number){
      if(this.get('computeQueue').length < 2){
        this.get('computeQueue').add(number);
      } else{
        this.get('numQueue').add(number);
      }
    }, this);

  }

});