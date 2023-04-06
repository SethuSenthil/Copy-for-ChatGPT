import * as path from "https://deno.land/std/path/mod.ts";
import { compress } from "https://deno.land/x/zip@v1.2.5/mod.ts";
import UglifyJS from "npm:uglify-js";
import { minify } from "npm:csso";

const buildPath = path.join("./build");

try {
  Deno.removeSync(buildPath, { recursive: true });
} catch (e) {
  //If the directory doesn't exist, we don't need to do anything
  if (e.name !== "NotFound") {
    throw e;
  }
}

//Create build directory
Deno.mkdirSync(buildPath);

//copy manifest.json to build folder
Deno.copyFileSync("manifest.json", "build/manifest.json");

//Read manifest.json
const manifest = JSON.parse(await Deno.readTextFile("build/manifest.json"));

//copy all files referenced in manifest.json to build folder
const cs: Array<Array<string>> = manifest.content_scripts[0];

cs.js.push(manifest.background.service_worker);

cs.js.forEach((jsFile: string) => {
  const jsFileData = Deno.readTextFileSync(jsFile);

  Deno.writeTextFileSync(
    path.join(buildPath, jsFile),
    UglifyJS.minify(jsFileData, {}).code
  );
});

cs.css.forEach((cssFile: string) => {
  const cssFileData = Deno.readTextFileSync(cssFile);

  Deno.writeTextFileSync(
    path.join(buildPath, cssFile),
    minify(cssFileData).css
  );
});

Deno.mkdirSync(path.join(buildPath, "media"));

//copy all files referenced in media directory to build folder
const icns = manifest.icons;

//loop through icons in object
for (const size in icns) {
  Deno.copyFileSync(
    path.join("./", icns[size]),
    path.join("./build", icns[size])
  );
}

compress(buildPath, "build.zip", { overwrite: true });
