import { VERSION as version_info } from './version-info';

version_info.version.lib = `${version_info.version.lib}.dev`;
version_info.version.doc = `${version_info.version.doc}.dev`;

export const environment = {
  production: true,
  version_info
};
