// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: 'packy.db.elephantsql.com',
      database: 'oidtxrhh',
      user:     'oidtxrhh',
      password: 'Q8rj5l3SNBVcvPMG0SZPiiGWLmb5qcZl',
      ssl: true
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'packy.db.elephantsql.com',
      database: 'oidtxrhh',
      user:     'oidtxrhh',
      password: 'Q8rj5l3SNBVcvPMG0SZPiiGWLmb5qcZl',
      ssl: true
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
