# byteof [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[travis-image]: https://travis-ci.org/limin/byteof.svg?branch=master
[travis-url]: https://travis-ci.org/limin/byteof
[npm-image]: https://img.shields.io/npm/v/byteof.svg
[npm-url]: https://npmjs.org/package/byteof
[downloads-image]: https://img.shields.io/npm/dm/byteof.svg
[downloads-url]: https://npmjs.org/package/byteof
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

Calculate the approximate memory usage of javascript object in bytes.

## install

To use this module directly , install it:

```bash
npm install byteof
```

## usage

```js
const byteof=require('byteof')
const object={
    "n":1,
    "b":true,
    "s":"1234567890"
}        
const totalBytes=byteof(object)
```

### contributing

* Fork it!
* Create your feature branch: `git checkout -b my-new-feature`
* Commit your changes: `git commit -am 'Add some feature'`
* Push to the branch: `git push origin my-new-feature`
* Submit a pull request


### license

Copyright (c) 2018 Min Li

This program is free software: you can redistribute it and/or modify it under the terms of the Apache License Version 2.0 as published by Apache Software Foundation.