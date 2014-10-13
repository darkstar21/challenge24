var NumberModel = Backbone.Model.extend({
  initialize: function(params) {
    this.set('value', params.value);
    this.set('display', params.display);
  },

  dequeue: function(){
    // Triggering an event here will also trigger the event on the collection
    this.trigger('dequeue', this);
  }

});
