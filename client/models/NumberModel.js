var NumberModel = Backbone.Model.extend({
  initialize: function(value, display) {
    this.set('value', value);
    this.set('display', display);
  },

  play: function(){
    // Triggering an event here will also trigger the event on the collection
    if(!this.get('playing')){
      this.set('playCount', this.get('playCount')+1);
      this.save({error: function() { console.log(arguments); }});
      this.trigger('play', this);
      this.set('playing',true);
    }
  },

  enqueue: function(){
    // Triggering an event here will also trigger the event on the collection
    this.trigger('enqueue', this);
  },

  dequeue: function(){
    // Triggering an event here will also trigger the event on the collection
    this.trigger('dequeue', this);
  },

  ended: function(){
    // Triggering an event here will also trigger the event on the collection
    this.trigger('ended', this);
  },

  upvote: function(){
    // Triggering an event here will also trigger the event on the collection
    this.set('votes', this.get('votes')+1);
    this.save();
  },

});
