var AppView = Backbone.View.extend({

  template: _.template('<button class="reset-button">Reset</button>\
    <div class="number-queue"></div>\
    <div class="compute-area"></div>\
    <div class="operation-box"></div>\
    <button class="submit-button">Submit</button> <button class="clear-button">Clear</button>'),

  events: {
    'click .reset-button': function(){
      this.model.reset();
    },
    'click .submit-button': function() {
      this.model.compute();
    },
    'click .clear-button': function() {
      this.model.clearComputeArea();
    },
  },

  initialize: function(params){
    this.holderView = new NumberQueueView({collection: this.model.get('numQueue')});
    this.computeView = new ComputeView({collection: this.model.get('computeQueue')});
    this.operationView = new OperationView({model: this.model.get('operation')});

    this.model.on('change:numQueue', function(model){
      console.log('change to numQueue');
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
    this.$('.operation-box').html(this.operationView.el);
  }

});
