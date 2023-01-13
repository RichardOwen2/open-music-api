const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../error/InvariantError');
const NotFoundError = require('../error/NotFoundError');
const { singleSongModel } = require('../utils');

class SongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSong({
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title = '', performer = '' }) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title iLIKE $1 AND performer iLIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    try {
      const result = await this._cacheService.get(`song:${id}`);
      return {
        dataSource: 'cache',
        song: JSON.parse(result),
      };
    } catch {
      const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [id],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rowCount) {
        throw new NotFoundError('Lagu tidak ditemukan');
      }
      
      const mappedResult = result.rows.map(singleSongModel)[0];
      
      await this._cacheService.set(`song:${id}`, JSON.stringify(mappedResult));

      return {
        dataSource: 'database',
        song: mappedResult,
      };
    }
  }

  async editSongId(id, {
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }

    await this._cacheService.delete(`song:${id}`);
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`song:${id}`);
  }
}

module.exports = SongsService;
