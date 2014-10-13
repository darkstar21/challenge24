var AppView = Backbone.View.extend({

  template: _.template('<div class="number-queue"></div>\
    <div class="compute-area"></div>\
    <button class="hit-button">Submit</button> <button class="stand-button">Clear</button>'),

  initialize: function(params){
    this.holderView = new NumberQueueView({collection: this.model.get('numQueue')});
    this.computeView = new ComputeView({collection: this.model.get('computeQueue')});

    this.model.on('change:numQueue', function(model){
      this.render();
    }, this);

    this.model.on('change:computeQueue', function(model) {
      this.render();
    }, this);

    this.render();
  },

  render: function(){
    this.$el.children().detach();
    this.$el.html(this.template);
    this.$('.number-queue').html(this.holderView.el);
    this.$('.compute-area').html(this.computeView.el);
  }

});
