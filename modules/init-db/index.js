let initDbRanOnce = false;

/**
 * If mongo database was just created, run initDb() (maximum one time)
 */
module.exports = {
  handlers(self) {
    return {
      '@apostrophecms/migration:after': {
        async maybeInitDb () {
          // abort if the mongo database wasn't just created
          if (!self.apos.isNew) {
            return;
          }
          // abort if initDb() has already run once
          if (initDbRanOnce) {
            return;
          }
          await initDb(self);
          initDbRanOnce = true;
        }
      }
    };
  }
};

async function initDb (self) {
  console.log('--- Initializing database... ---');
  await self.apos.user.insert(self.apos.task.getReq(), {
    username: 'admin',
    password: 'admin',
    title: 'admin',
    role: 'admin'
  });
  console.log('- Created admin user with username "admin" and password "admin".');
  console.log('  Please log in and change this password.');
  console.log('--- Done initializing database ---');
}
