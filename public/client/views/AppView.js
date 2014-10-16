var AppView = Backbone.View.extend({

  template: _.template('<button class="reset-button">Reset</button> <button class="hint-button">Hint</button>\
    <a href="/logout" class="logout">Logout</a>\
    <div class="average-time">Average Time: </div>\
    <div class="number-queue"></div>\
    <div class="computation-area"></div>\
    <div id="timer">Timer: </div>\
    <div class="hint-area"></div>'),

  events: {
    'click .reset-button': function(){
      this.model.reset();
    },
    'click .hint-button': function(){
      this.$('.hint-area').html('Hint: ' + this.model.get('hint'));
    }
  },

  initialize: function(params){
    this.holderView = new NumberQueueView({collection: this.model.get('numQueue')});
    this.computeView = new ComputeView({model: this.model.get('computeModel')});

    // this.model.on('change:numComputingValues', function(model) {
    //   this.oneComputeView = new NumberView({model: this.model.get('computeQueue').at(0)});
    //   this.twoComputeView = new NumberView({model: this.model.get('computeQueue').at(1)});
    //   this.render();
    // }, this);

    this.model.on('update', function(){
      this.render();
    }, this);

    this.render();
  },

  render: function(){
    this.$el.children().detach();
    this.$el.html(this.template);
    this.$('.number-queue').html(this.holderView.el);
    this.$('.computation-area').html(this.computeView.el);
    this.$('#timer').html('Timer: ' + this.model.get('timer'));

    if(this.model.get('averageTime') !== undefined && this.model.get('averageTime') !== ''){
      this.$('.average-time').text('Average Time: ' + this.model.get('averageTime'));
    }
  }

});
