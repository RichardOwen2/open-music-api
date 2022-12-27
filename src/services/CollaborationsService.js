const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../error/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  // Verify add collab
  async verifyNewCollaboration(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Collaborator sudah ada!');
    }
  }

  // Verify collab access
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  // CRUD
  async addCollaboration(playlistId, userId) {
    await this.verifyNewCollaboration(playlistId, userId);

    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Collab gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Collab gagal dihapus');
    }
  }
}

module.exports = CollaborationsService;
