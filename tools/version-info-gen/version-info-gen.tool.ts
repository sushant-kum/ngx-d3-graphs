const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

const package_doc = require('../../package.json');
const package_lib = require('../../projects/ngx-graphs-d3/package.json');

const version_doc = package_doc.version;
const version_lib = package_lib.version;

// const VERSION_ARG_FLAG = 'version-tag';

// function getArgVersion() {
//   for (const arg of process.argv) {
//     if (arg.indexOf(`--${VERSION_ARG_FLAG}`) === 0) {
//       if (arg.indexOf(`--${VERSION_ARG_FLAG}=`) === 0) {
//         return arg.split(`--${VERSION_ARG_FLAG}=`)[1];
//       } else {
//         if (process.argv[process.argv.indexOf(arg) + 1]) {
//           return process.argv[process.argv.indexOf(arg) + 1];
//         } else {
//           const VERSION_FLAG_VALUE_ERROR = `Value for "--${VERSION_ARG_FLAG}" is not provided.`;
//           throw new Error(VERSION_FLAG_VALUE_ERROR);
//         }
//       }
//     }
//   }
//   return null;
// }

// const argVersion = getArgVersion();

const versionInfo = {
  version: {
    lib: version_lib,
    doc: version_doc
  },
  buildDateTime: new Date()
};

// Write version info to `src\environments\version-info.ts`
const file = resolve(__dirname, '..', '..', 'projects', 'ngx-graphs-d3-doc', 'src', 'environments', 'version-info.ts');
writeFileSync(
  file,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(versionInfo, null, 2)};
/* tslint:enable */
`,
  { encoding: 'utf-8' }
);

console.log(
  `Wrote version info lib:${versionInfo.version.lib}, doc:${versionInfo.version.doc} to ${relative(
    resolve(__dirname, '..', '..'),
    file
  )}`
);

// Write version info to `src\assets\version-info.json`
const assetJsonFile = resolve(
  __dirname,
  '..',
  '..',
  'projects',
  'ngx-graphs-d3-doc',
  'src',
  'assets',
  'version-info.json'
);
writeFileSync(assetJsonFile, `${JSON.stringify(versionInfo, null, 2)}`, { encoding: 'utf-8' });

console.log(
  `Wrote version info lib:${versionInfo.version.lib}, doc:${versionInfo.version.doc} to ${relative(
    resolve(__dirname, '..', '..'),
    assetJsonFile
  )}`
);
