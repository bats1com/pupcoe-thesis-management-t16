const db = require('./../db');

var Defense = {

  createMor: (thesisId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO defense(defense_type, thesis_id)
        VALUES (
          'mor',
          '${thesisId}'
        )
        RETURNING *
      `;
      var createQuery2 = `
        UPDATE thesis
        SET current_stage = 'mor'
        WHERE id = ${thesisId}
        RETURNING *
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
      db.query(createQuery2, (req2, data2) => {
        console.log('req2', req2);
        console.log('created2', data2);
        resolve(data2.rows[0]);
      });
    });
    return promise;
  },

  listMorByGroupId: (groupId) => {
    const query = `
      SELECT * FROM thesis t
      INNER JOIN defense d ON t.id = d.thesis_id
      WHERE t.group_id = ${groupId}
    `;
    var promise = new Promise((resolve, reject) => {
      console.log('query', query)
      db.query(query, (req, data) => {
        console.log('req', req)
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  }


};

module.exports = Defense;