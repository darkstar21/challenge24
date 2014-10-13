var NumberModel = Backbone.Model.extend({
  initialize: function(value, display) {
    this.set('value', value);
    this.set('display', display);
  },

  dequeue: function(){
    // Triggering an event here will also trigger the event on the collection
    this.trigger('dequeue', this);
  }

});
