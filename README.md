# Project Name

A review module for a short term apartment booking app. Built with React, Node/Express, Webpack and deployed through Docker & AWS.

## Related Projects

  - https://github.com/stay-app/Stay-Overview
  - https://github.com/stay-app/Stay-Reservation-Service
  - https://github.com/stay-app/Stay-PhotoGallery-Service
  - https://github.com/bijinjing/Stay-Review-Proxy

## Table of Contents

1. [Requirements](#requirements)
2. [Development](#development)


## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- React
- Express

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
yarn start
yarn test
yarn build
```
### API

Use end point :5002/?={listing} to fetch listing data. Listing ranges from 1 to 100:



