var OperationView = Backbone.View.extend({

  className: 'operation',

  template: _.template('<span><%= value %></span>'),

  initialize: function(){
    this.model.on('change', function(){
      this.render();
    }, this);
    this.render();
  },

  events: {
    'click': function() {
      this.model.nextValue();
    }
  },

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }

});