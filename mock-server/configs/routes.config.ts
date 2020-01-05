/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2020-01-05 17:41:04
 * @modify date 2020-01-05 17:41:04
 * @desc `Slash (/)` is replaced by `Double underscore (__)` as JSON Server doesn't support sub-paths
 * Add RegExp `(\\?.+)?` at end when expecting query parameters in incoming API path
 * Config rule format: `<actual request path>(string): <request path to process>(string)`
 * Config rule example: `"/insights/settings/activation_state": "/insights__settings__activation_state"`
 */

module.exports = {};
