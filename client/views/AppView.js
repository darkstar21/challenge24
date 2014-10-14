var AppView = Backbone.View.extend({

  template: _.template('<button class="reset-button">Reset</button> <button class="hint-button">Hint</button>\
    <div class="number-queue"></div>\
    <h3>Computation Area</h3>\
    <div class="computeOne-area"></div>\
    <div class="operation-box"></div>\
    <div class="computeTwo-area"></div>\
    <div class="equals">=</div>\
    <div class="answer-area"></div>\
    <button class="submit-button">Submit</button> <button class="clear-button">Clear</button><div id="timer">Timer: </div>\
    <div class="hint-area"></div>'),

  events: {
    'click .reset-button': function(){
      this.model.reset();
    },
    'click .hint-button': function(){
      this.$('.hint-area').html('Hint: ' + this.model.get('hint'));
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
    this.oneComputeView = new NumberView({model: this.model.get('computeQueue').at(0)});
    this.twoComputeView = new NumberView({model: this.model.get('computeQueue').at(1)});
    this.operationView = new OperationView({model: this.model.get('operation')});

    this.model.on('change:numComputingValues', function(model) {
      this.oneComputeView = new NumberView({model: this.model.get('computeQueue').at(0)});
      this.twoComputeView = new NumberView({model: this.model.get('computeQueue').at(1)});
      this.render();
    }, this);

    this.model.on('update', function(){
      this.render();
    }, this);

    this.render();
  },

  render: function(){

    this.$el.children().detach();
    this.$el.html(this.template);
    this.$('.number-queue').html(this.holderView.el);
    this.$('.computeOne-area').html(this.oneComputeView.render());
    this.$('.operation-box').html(this.operationView.el);
    this.$('.computeTwo-area').html(this.twoComputeView.render());
    this.$('#timer').html('Timer: ' + this.model.get('timer'));
    if(this.model.get('computeQueue').at(1).getValue()){
      var one = this.model.get('computeQueue').at(0).getValue();
      var two = this.model.get('computeQueue').at(1).getValue();
      var op = this.model.get('operation').getValue();
      var calc = this.model.calculateValue(one, two, op);
      this.$('.answer-area').text(calc[1]);
    } else{
      this.$('.answer-area').text('');
    }
  }

});
