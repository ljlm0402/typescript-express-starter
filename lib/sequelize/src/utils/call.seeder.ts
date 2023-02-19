/* npm run seeder --seed=../seeders/file.seeder.ts */
(async () => {
  // get seed variable from  process.evn
  const path = process.env.npm_config_seed;
  if (!path) {
    // check if seed exist
    console.log('Ops: seed path is empty\n' + 'follow this structure to work correctly\n' + 'npm run seeder --seed=../seeders/file.seeder.ts');
    process.exit();
  } else if (path.search('.ts') == -1) {
    // check if path is has file.ts
    console.log('Ops this path is not contain seed file ');
    process.exit();
  }

  // dynamically import file
  const file = await import(path);
  // create new instance of file
  const myClass = new file.default();
 // call run
  console.log('Start Seeding : ' + process.env.npm_config_seed + '  \n');
  await myClass.run();
})()
  .then(() => {
    process.exit();
  })
  .catch(error => {
    console.log('Ops Seeding get Error : \n ');
    console.error(error);
  });
