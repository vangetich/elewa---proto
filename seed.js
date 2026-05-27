// scripts/seed.js
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');

function write(name, obj) {
  fs.writeFileSync(path.join(DATA, name), JSON.stringify(obj, null, 2));
}

console.log('Seed script placeholder. Customize and run to populate data files.');