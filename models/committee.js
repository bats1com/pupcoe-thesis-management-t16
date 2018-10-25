const db = require('./../db');

var Committee = {
  addFaculty: (facultyIds) => {
    console.log('addFaculty', facultyIds);
    const promise = new Promise((resolve, reject) => {

      var values = [];
      facultyIds.forEach((facultyId) => {
        values.push(`('${facultyId}')`)
      })
      var query = `
        INSERT INTO committee_members(faculty_id)
        VALUES ${values}
        RETURNING *
      `;
      console.log('query', query);
      db.query(query, (req, data) => {
        console.log('added', req, data);
        resolve(data.rows);
      });
    });
    return promise;
  },

  deleteMember: (facultyId) => {
    // check first if user with given email already exists
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        DELETE FROM committee_members
        WHERE faculty_id = ${facultyId}
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  }
};

module.exports = Committee;
