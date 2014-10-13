var AppView = Backbone.View.extend({

  initialize: function(params){
    this.playerView = new PlayerView({model: this.model.get('currentSong')});
    this.libraryView = new LibraryView({collection: this.model.get('library')});
    this.playlistView = new PlaylistView({model: this.model.get('playlist')});
    this.playlistCollectionView = new PlaylistCollectionView({collection: this.model.get('playlistCollection')});

    // change:currentSong - this is Backbone's way of allowing you to filter events to
    // ONLY receive change events for the specific property, 'currentSong'
    this.model.on('change:currentSong', function(model){
      this.playerView.setSong(model.get('currentSong'));
    }, this);

    this.model.on('change:playlist', function(model) {
      //this.playlistView.remove();
      this.playlistView = new PlaylistView({model: this.model.get('playlist')});
      this.render();
    }, this);


  },

  render: function(){
    this.$el.children().detach();
    return this.$el.html([
      this.playerView.$el,
      this.libraryView.$el,
      this.playlistView.$el,
      this.playlistCollectionView.$el
    ]);
  }

});
