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
<a href="https://aimsapi.com" rel="nofollow" target="_blank"><img src="https://img.shields.io/badge/created%20by-AIMS%20API-8137CF" alt="Created by AIMS API"></a>
<a href="https://npmjs.org/package/badges" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@aims-api/aims-node.svg" alt="NPM version" /></a></span>
</div>

<details open="open">
<summary>

## Table of Contents

</summary>

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
<summary>

## Getting Started

</summary>

<br />
To work with the package you need to have npm (or other package manager) installed.
Library supports Node.js version 18.x and above, and can be used in a client codebase. 
<br />
<br />

```node
npm install @aims-api/aims-node
```

### Authentication

In order to use the lirbary you need to obtain an API key. You can get a demo key by contating us at [hello@aimsapi.com](mailto:hello@aimsapi.com).

After you have obtained your API key, you MAY USE the library on the client as well as on the server side.

<details>
<summary>

### Example with Next.js

</summary>

```typescript
// pages/api/searchByText.ts

import { NextApiRequest, NextApiResponse } from 'next'

const createSimilaritySearchClient = async (req: NextApiRequest) => {
  return new SimilaritySearchApiClient({
    authorization: YOUR_API_KEY,
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { text, filter } = req.body
      const client = await createSimilaritySearchClient(req)
      const response = await client.endpoints.query.byText({ text, detailed: true, filter })
      return res.status(200).send(response)
    } catch (error) {
      return res.status(error.status).json(error.json)
    }
  }
  return res.status(400).json('Method not allowed')
}

export default handler
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
