<h1 align="center">
 AIMS Node
</h1>

<div align="center">
  A Node.js library to integrate the AIMS API.
  <br />
  <br />
  Reach for more information at <a href="https://aimsapi.com" target="_blank">aimsapi.com</a>
  <br />
  <a href="https://github.com/aims-api/aims-node/issues/new">Report a Bug</a>
  -
  <a href="https://github.com/aims-api/aims-node/issues/new">Request a Feature</a>
  -
  <a href="mailto:hello@aimsapi.com">Ask a Question</a>
</div>
  <br />

<div align="center">
<!-- <a href="https://github.com/aims-api/aims-node/actions?query=branch%3Amain"><img src="https://github.com/aims-api/aims-node/actions/workflows/test.yml/badge.svg?event=push&branch=main" alt="CI status" /></a> -->
<a href="https://aimsapi.com" rel="nofollow" target="_blank"><img src="https://img.shields.io/badge/created%20by-AIMS%20API-8137CF
" alt="Created by AIMS API"></a>
<a href="https://npmjs.org/package/badges" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@aims-api/aims-node.svg" alt="NPM version" /></a></span>
</div>

<details open="open">
<summary style="font-size: 20px; font-weight: bold;">Table of Contents</summary>

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
    - [Authentication](#authentication)
- [Usage](#usage)
  - [Examples](#examples)
- [License](#license)
- [Acknowledgements](#acknowledgements)

</details>

---

<details open="open">
<summary style="font-size: 20px; font-weight: bold; margin-top: 20px;">Getting Started</summary>

<br />
Instructions on how to install your project.

### Prerequisites

To work with the package you need to have npm installed.

#### Authentication

In order to use the lirbary you need to obtain an API key. You can get a demo key by contating us at [hello@aimsapi.com](mailto:hello@aimsapi.com).

Every HTTP request should include the following headers:

```
Authorization: Bearer <your-api-key>
Content-Type: application/json
```

<details>
<summary>Example</summary>

```javascript
const aims = require('@aims-api/aims-node')

aims.setApiKey('your-api-key')

aims
  .get('https://api.aimsapi.com/v1/users/me')
  .then((response) => console.log(response))
  .catch((error) => console.error(error))
```

</details>
</details>

## Usage

Instructions on how to use our library.

### Routes

List of routes available in your project.

## License

See [LICENSE](LICENSE) for more information.

## Acknowledgements
