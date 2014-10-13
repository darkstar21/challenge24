var AppView = Backbone.View.extend({

  initialize: function(params){
    this.holderView = new NumberQueueView({collection: this.model.get('numQueue')});
    this.computeView = new ComputeView({collection: this.model.get('computeQueue')});

    this.model.on('change:numQueue', function(model){
      this.render();
    }, this);

    this.model.on('change:computeQueue', function(model) {
      this.render();
    }, this);

  },

  render: function(){
    this.$el.children().detach();
    return this.$el.html([
      this.holderView.$el,
      this.computeView.$el,
    ]);
  }

});
