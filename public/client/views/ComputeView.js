var ComputeView = Backbone.View.extend({
  
  className: 'queue',

  template: _.template('<h3>Computation Area</h3>\
    <div class="computeOne-area"></div>\
    <div class="operation-box"></div>\
    <div class="computeTwo-area"></div>\
    <div class="equals">=</div>\
    <div class="answer-area"></div>\
    <button class="submit-button">Submit</button> <button class="clear-button">Clear</button><div id="timer">Timer: </div>'),

  events: {
    'click .submit-button': function() {
      this.model.compute();
    },
    'click .clear-button': function() {
      this.model.clearComputeArea();
    }
  },

  initialize: function() {
  
    this.render();
  },

  render: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();
    this.$el.html('<h3>Computation Area</h3>').append(
      this.collection.map(function(number){
        return new NumberView({model: number}).render();
      })
    );
  }
});
