const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(exportsService, playlistService, validator) {
    this._exportsService = exportsService;
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const userId = request.auth.credentials.id;
    const { playlistId } = request.params;

    await this._playlistService.verifyPlaylistOwner(playlistId, userId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._exportsService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrian',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
