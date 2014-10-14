var NumberQueueView = Backbone.View.extend({

  className: 'queue',

  initialize: function() {
    this.collection.on('add', function(){
      this.render();
    }, this);

    this.collection.on('remove', function(){
      this.render();
    }, this);

    this.collection.on('reset', function(){
      this.render();
    }, this);

    this.render();
  },

  render: function(){
    // to preserve event handlers on child nodes, we must call .detach() on them before overwriting with .html()
    // see http://api.jquery.com/detach/
    this.$el.children().detach();
    this.$el.html('<h3>Number Queue</h3>').append(
      this.collection.map(function(number){
        return new NumberView({model: number}).render();
      })
    );
  }

});