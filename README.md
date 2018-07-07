# awilix-groa

[![CircleCI](https://circleci.com/gh/galenwarren/awilix-groa/tree/master.svg?style=svg)](https://circleci.com/gh/galenwarren/awilix-groa/tree/master)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) [![Coverage Status](https://img.shields.io/coveralls/github/galenwarren/awilix-groa/master.svg)](https://img.shields.io/coveralls/github/galenwarren/awilix-groa/master.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[Awilix](https://github.com/jeffijoe/awilix) helpers, router and scope-instanatiating middleware for [groa](https://github.com/GroaJS/groa). This does for [groa](https://github.com/GroaJS/groa) and [groa-router](https://github.com/GroaJS/groa-router) what [awilix-koa](https://github.com/jeffijoe/awilix-koa) does for [koa](https://github.com/koajs/koa) and [koa-router](https://github.com/alexmingoia/koa-router), i.e. enables [grpc](https://grpc.io/) server development using middleware and dependency injection, with routing support.

## Requirements

Requires Node v7.6+, as `groa` depends on async/await support.

## Installation

```
npm install --save awilix-koa
```

## Motivation

See the [discussion](https://github.com/jeffijoe/awilix-koa#why-do-i-need-it) in `awilix-koa`.

## Differences vs. awilix-koa

This library mimics `awilix-koa` wherever possible, and it uses the same underlying [awilix-router-core](https://github.com/jeffijoe/awilix-router-core) library.

The main difference is that grpc does not use verbs (i.e GET, POST, etc.) so the the verb-related builder methods and decorators are not supported. Instead, the builder supports an [rpc]() method (builder pattern) and there is an [@RPC]() decorator to declare rpc methods (decorator pattern).

## Documentation

More detailed library documentation is [here](https://galenwarren.github.io/awilix-groa/) (*in progress*).
