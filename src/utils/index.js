/* eslint-disable camelcase */

const singleSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const songsModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const albumModel = ({
  id,
  name,
  year,
}, songs) => ({
  id,
  name,
  year,
  songs,
});

module.exports = { singleSongModel, songsModel, albumModel };
