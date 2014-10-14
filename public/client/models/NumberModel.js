var NumberModel = Backbone.Model.extend({
  initialize: function(params) {
    this.set('value', params.value);
    this.set('display', params.display);
  },

  dequeue: function(){
    this.trigger('dequeue', this);
  },

  getValue: function(){
    return this.get('value');
  },

  getText: function(){
    return this.get('display');
  }

});
