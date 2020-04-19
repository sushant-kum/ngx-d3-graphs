# Version Info Generator Tool

This tool creates version-info files at paths `src/environment/version-info.ts` and `src/assets/version-info.json`

---

## Usage

An NPM script is created to run this tool:

```json
"version_info_gen": "node tools/version-info-gen/version-info-gen.tool.ts"
```

To run the tool, run:

```bash
npm run version_info_gen
```

<!-- To create version-info files with a user-provided version/tag, run:

```bash
npm run version_info_gen [-- [--version-tag-lib=x.y.z] [--version-tag-doc=x.y.z]]
# OR
npm run version_info_gen [-- [--version-tag-lib x.y.z] [--version-tag-doc x.y.z]]
```

where `x.y.z` is the version/tag.

If no `--version-tag-lib` is provided, this tool falls back and uses `version` property of `package.json` files of lib to create the version-info files.

Similarly, if no `--version-tag-doc` is provided, this tool falls back and uses `version` property of `package.json` files of doc to create the version-info files -->

---

## Version Info Files

Two version-info files are created by this tool, one _TS_ file at `projects/ngx-graphs-d3-doc/src/environmentsversion-info.ts`, and one _JSON_ file at `projects/ngx-graphs-d3-doc/src/assets/version-info.json`.
The _TS_ file is consumed by the `environment.ts` file and in return prints the version info on the browser console on init of `app.component.ts`. This file is not retained in the build files.
The _JSON_ file is not consumed by any component/module of the app. It is created so that one can view the version-info in the code-base when using SSHJ. This file is retained in the build files.

### File Formats

The content of the version-info files are as below:

#### `projects/ngx-graphs-d3-doc/src/environment/version-info.ts`

```ts
// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = {
  version: {
    lib: 'x.y.z',
    doc: 'a.b.c'
  },
  buildDateTime: '2019-12-17T10:08:50.286Z'
};
/* tslint:enable */
```

#### `projects/ngx-graphs-d3-doc/src/assets/version-info.json`

```json
{
  "version": {
    "lib": "x.y.z",
    "doc": "a.b.c"
  },
  "buildDateTime": "2019-12-17T10:08:50.286Z"
}
```
