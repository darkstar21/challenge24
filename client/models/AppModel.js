var AppModel = Backbone.Model.extend({

  initialize: function(){
    this.set('numQueue', new NumberQueue());
    this.set('computeQueue', new ComputeQueue());

    this.get('numQueue').on('dequeue', function(number){
      if(this.get('computeQueue').length < 2){
        this.get('numQueue').remove(number);
        this.get('computeQueue').add(number);
      }
    }, this);

    this.get('computeQueue').on('dequeue', function(number){
      this.get('computeQueue').remove(number);
      this.get('numQueue').add(number);
    }, this);

  }

});