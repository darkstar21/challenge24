var OperationModel = Backbone.Model.extend({
  initialize: function(params) {
    this.set('value', '/');
  },

  dequeue: function(){
    // Triggering an event here will also trigger the event on the collection
    this.trigger('dequeue', this);
  },

  getValue: function(){
  	return this.get('value');
  }

});