const config = {
  development: {
    db: {
      database: 'thesis-db',
      user: 'postgres',
      password: 'admin',
      host: 'localhost',
      port: 5432
    },
    nodemailer: {
    }
  },
  production: {
    db: {
      database: 'ddb60qah8cpn5n',
      user: 'wyofmmwppviiga',
      password: '615c5ecb4e93d029261948ca99c6d166f165bfa548bd39ad0e0751aaf79df8e6',
      host: 'ec2-54-221-225-11.compute-1.amazonaws.com',
      port: 5432,
      ssl: true
    },
    nodemailer: {

    }
  }
};

module.exports = process.env.NODE_ENV === 'production' ? config.production : config.development;
