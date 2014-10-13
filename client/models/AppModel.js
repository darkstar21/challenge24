var AppModel = Backbone.Model.extend({

  initialize: function(params){
    this.set('currentSong', new SongModel());
    this.set('playlist', new Playlist('default'));
    this.set('playlistCollection', new PlaylistCollection());

    this.get('playlistCollection').add(this.get('playlist'));
    this.get('playlistCollection').add(new Playlist('other'));

    params.library.on('play', function(song){
      this.get('currentSong').set('playing', false);
      this.set('currentSong', song);
      app.appRouter.navigate('song/' + escape(song.get('title')));
    }, this);

    params.library.on('enqueue', function(song){
      this.get('playlist').songs.create(song);
    }, this);

    this.get('playlist').on('stop', function(){
      this.set('currentSong');
    }, this);

    this.get('playlistCollection').on('select', function(playlist) {
      this.set('playlist', playlist);
      app.appRouter.navigate('playlist/' + playlist.get('name'));
    }, this);

  }

});