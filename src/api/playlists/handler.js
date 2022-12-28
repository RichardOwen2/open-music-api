const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(name, owner);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { id: owner } = request.auth.credentials;

    const playlists = await this._playlistsService.getPlaylist(owner);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
    await this._playlistsService.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil di hapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._songService.getSongById(songId);
    await this._playlistsService.addSongToPlaylistById(playlistId, songId);
    await this._playlistsService.addActivities(userId, playlistId, songId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan kedalam playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistAndSongById(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const playlist = await this._playlistsService.getSongFromPlaylistById(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validateDeleteSongPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._playlistsService.deleteSongFromPlaylistById(playlistId, songId);
    await this._playlistsService.addActivities(userId, playlistId, songId, 'delete');

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesById(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const activities = await this._playlistsService.getActivities(playlistId);

    return {
      status: 'success',
      data: activities,
    };
  }
}

module.exports = PlaylistsHandler;
