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
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: 5432,
      ssl: true
    },
    nodemailer: {

    }
  }
};

module.exports = process.env.NODE_ENV === 'development' ? config.production : config.development;
