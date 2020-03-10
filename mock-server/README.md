# ngx-graphs-d3 - Mock Server

## Overview

ngx-graphs-d3 - Mock Server is a mock-server to cater to API requests emitted by ngx-graphs-d3 documentation.

## Capabilities

The mock server is built using [json-server](https://www.npmjs.com/package/json-server) to mock API responses for the incoming requests from Angular when in **dev environment**. Along with default functionalities of `json-server`, the mock server can be configured to:

- send pre-defined JSON as response for request of **GET** as well as **non-GET** HTTP method type.
- respond to API request with **non-200** STATUS CODE.
- respond to API request with **non-default** STATUS MESSAGE

## Directory Structure of Mock Server

```
│
│   README.md
│   server.ts // runs the json-server
│
├───configs
|   |   config.ts // contains misc configs
|   |   db.config.ts // maps json-server compatible paths to JSON files in ./mock-data
│   │   routes.config.ts // mapping to rewrite incoming API request paths to json-server compatible paths
│   │
│   └───optional
│           http-methods.config.ts // config to send pre-defined JSON responses to non-GET requests
│           http-status-message.config.ts // config to send non-default STATUS MESSAGE responses
│           http-status.config.ts // config to send non-200 STATUS CODE responses
│
├───mock-data // contains mock data JSON files
│
└───public // contains static files to be served
    └───static
```

## Steps to Mock

1. Add response JSON file to `mock-server/mock-data/` with appropriate sub-directory arrangement.
2. Add json-server rewrite rule to redirect API request path to _json-server compatible_ path in `mock-server/configs/routes.config.ts`. Example: `"/insights/settings/activation_state": "/insights__settings__activation_state"`
3. Add rule to `mock-server/configs/db.config.ts` to serve the JSON file for the incoming _json-server compatible_ path. Example: `insights__settings__activation_state: require("./mock-data/login/get-activation-state.json");`
4. Add optional rules to other config files:
   - Add rule to `mock-server/configs/optional/http-methods.config.ts`, to respond to **non-GET** requests with pre-defined JSON response. Example: `"/insights/settings/activation_state": "post"`
   - Add rule to `mock-server/configs/optional/http-status.config.ts`, to respond with **non-200** STATUS CODE. Example: `"/insights/settings/activation_state": 400`
   - Add rule to `mock-server/configs/optional/http-status-message.config.ts`, to respond with **non-default** STATUS MESSAGE. Example: `"/insights/settings/activation_state": "Conflict"`
5. Make sure corresponding proxy-forwarding rule is listed in `proxy-config.json`. If not, add a new rule. Help can be found [here](https://angular.io/guide/build#proxying-to-a-backend-server).
