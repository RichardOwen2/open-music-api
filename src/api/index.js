const AlbumsHandler = require('./handler/AlbumsHandler');
const SongsHandler = require('./handler/SongHandler');

const routes = require('./routes');

module.exports = {
  name: 'OpenMusic',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    /* eslint-disable-next-line max-len */
    const albumsHandler = new AlbumsHandler(new service.AlbumService(), validator.validateAlbumPayload);
    const songsHandler = new SongsHandler(new service.SongService(), validator.validateSongPayload);
    server.route(routes({ albumsHandler, songsHandler }));
  },
};
