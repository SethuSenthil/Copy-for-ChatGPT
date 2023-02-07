const fs = require('fs');

//delete old build folder if it exists
if (fs.existsSync('build')) {
    fs.rmdirSync('build', { recursive: true });
}

//create folder called build
fs.mkdirSync('build');

//copy manifest.json to build folder
fs.copyFileSync('manifest.json', 'build/manifest.json');

const manifest = require('./manifest.json');

//copy all files referenced in manifest.json to build folder
const cs = manifest.content_scripts[0]

cs.js.push(manifest.background.service_worker)

cs.js.forEach((jsFile) => {
    fs.copyFileSync(jsFile, `build/${jsFile}`);
});

cs.css.forEach((cssFile) => {
    fs.copyFileSync(cssFile, `build/${cssFile}`);
});

//made media directory in build folder
fs.mkdirSync('build/media');

//copy all files referenced in media directory to build folder
const icns = manifest.icons;

//loop through icons in object
for (const size in icns) {
    fs.copyFileSync(icns[size], `build/${icns[size]}`);
}