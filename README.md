# ds-mapper

A Node JS Based Data Mapping Library.

## Install

```sh
npm i @appveen/data-mapper
```

## How it works

```javascript
const Mapper = require("@appveen/data-mapper");

(async () => {

const mappings = [....]; // Mapping JSON

  const mapper = new Mapper('first-mapper', mappings, {
    //Additional Libraries or Objects you want to use
  });

  const result = await mapper.convert({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com"
    });

  console.log(result);
})();
```

## Mapping JSON

The Mapping JSON Contains a data path, This data path follows LoDash Library Data Path pattern.

```javascript
[
  {
    source: [
      {
        type: "String",
        dataPath: "firstName",
      },
      {
        type: "String",
        dataPath: "lastName",
      },
    ],
    target: {
      type: "String",
      dataPath: "name",
    },
    formula: "return input1 + ' ' +input2;",
  },
];
```

User can write a JS code block in the formula to do much more.

## Example

Check example.js in the repo.

## LICENSE

MIT
