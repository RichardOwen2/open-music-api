/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
    },
    song_id: {
      type: 'VARCHAR(50)',
    },
  })

  pgm.addConstraint('playlist_songs', 'fk_playlist_playlist_id.album_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_song_id.songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_playlist_id.album_id_playlists.id');
  pgm.dropConstraint('playlist_songs', 'fk_playlist_song_id.songs.id');
  pgm.dropTable('playlist_songs');
};
