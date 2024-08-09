<h1 align="center">
 AIMS Node
</h1>

<div align="center">
  A Node.js library written in TypeScript to integrate the AIMS API.
  <br /> You MAY USE this library on the client as well as on the server side.
  <br />
  <br />
  Reach for more information at <a href="https://aimsapi.com">aimsapi.com</a>
  <br />
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
<a href="https://www.npmjs.com/package/@aims-api/aims-node" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@aims-api/aims-node.svg" alt="NPM version" /></a></span>
</div>

<details open="open">
<summary>

## Table of Contents

</summary>

- [Getting Started](#getting-started)
  - [Authentication](#authentication)
  - [Next.js example](#example-with-nextjs)
- [Usage](#usage)
  - [Routes](#routes)
  - [Response Structure](#response-structure)
- [License](#license)

</details>

---

<details open="open">
<summary>

## Getting Started

</summary>

<br />
To work with the package you need to have npm (or other package manager) installed.
Library supports Node.js version 18 and above, and can be used in a client codebase.
<br />
<br />

```
npm install @aims-api/aims-node
```

### Authentication

In order to use the lirbary you need to obtain an API key. You can get a demo key by contating us at [hello@aimsapi.com](mailto:hello@aimsapi.com).

<details open="open">
<summary>

### Example with Next.js

</summary>

TypeScript

```typescript
// pages/api/searchByText.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { Client as AIMSClient } from '@aims-api/aims-node'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { text, filter } = req.body
      const aims = new AIMSClient({
        authorization: 'YOUR_API_KEY',
      })
      const response = await aims.endpoints.query.byText({ text, detailed: true, filter })
      return res.status(200).send(response)
    } catch (error) {
      return res.status(error.status).json(error.json)
    }
  }
  return res.status(400).json('Method not allowed')
}

export default handler
```

<details>
<summary>
JavaScript
</summary>

```javascript
// pages/api/searchByText.js

import { Client as AIMSClient } from '@aims-api/aims-node'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { text, filter } = req.body
      const aims = new AIMSClient({
        authorization: 'YOUR_API_KEY',
      })
      const response = await aims.endpoints.query.byText({
        text,
        detailed: true,
        filter,
      })
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
</details>

## Usage

It is common to make a proxy request from client app to the server in order to hide foreign URL.

When you create a client instance in your codebase, you can then easily access all the existing endpoints via IDE autocomplete, as well as the required and optional parameters.

### TypeScript

Library uses [Zod](https://github.com/colinhacks/zod) for response validation, therefore you can use the types that are provided in every endpoint file.

#### Example

```typescript
import { type SearchResponse } from '@aims-api/aims-node/dist/endpoints/search'
```

### Routes

The library provides a set of endpoints that can be found in [src/client/index.ts](/src/client/index.ts#L95) file by the `endpoints` property on line #95.

List of all API endpoints could be found in [AIMS API Documentation](https://docs.aimsapi.com/) under Endpoints section, AIMS queries.

### Response Structure

Both network errors and response structure errors are handled within a library, so the response is always a valid JavaScript Object in the following structure:

```javascript
// successful request
{
  success: true
  data: any
}

// failed request
{
  success: false
  error: AxiosError | ZodError
}
```

## License

See [LICENSE](LICENSE) for more information.
