var NumberView = Backbone.View.extend({

  className: 'number',

  template: _.template('(<%= display %>)'),

  initialize: function(){
    this.model.on('change', function(){
      this.render();
    }, this);
    this.render();
  },

  events: {
    'click': function() {
      this.model.dequeue();
    }
  },

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }

});