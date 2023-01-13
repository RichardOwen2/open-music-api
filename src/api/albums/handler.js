const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumService, storageService, validator) {
    this._albumService = albumService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._albumService.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumService.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumCoverByIdHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateCoverAlbumPayload(cover.hapi.headers);

    const { id } = request.params; 

    await this._albumService.checkAlbumIfExist(id);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    await this._albumService.addAlbumCover(id, filename);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postLikeAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumService.checkAlbumIfExist(albumId);
    
    const like = await this._albumService.checkUserLikeAlbum(albumId, userId);

    if (like) {
      await this._albumService.addLikeToAlbum(albumId, userId);
    } else {
      await this._albumService.deleteLikeFromAlbum(albumId, userId);
    }

    const response = h.response({
      status: 'success',
      message: like? 'Berhasil Menyukai Album':'Berhasil membatalkan suka album',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikeByIdHandler(request, h) {
    const { id } = request.params;

    await this._albumService.checkAlbumIfExist(id);

    const { likeCount, dataSource } = await this._albumService.countAlbumLike(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: likeCount,
      },
    });
    response.header('X-Data-Source', dataSource);
    return response;
  }
}

module.exports = AlbumsHandler;
