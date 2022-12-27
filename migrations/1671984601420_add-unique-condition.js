/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', 'UNIQUE(playlist_id, user_id)');
  pgm.addConstraint('playlist_songs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'unique_playlist_id_and_user_id');
  pgm.dropConstraint('playlist_songs', 'unique_playlist_id_and_song_id');
};
