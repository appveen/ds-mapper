const Mapper = require('./index');


const mappings = [
    {
        "source": [
            {
                "type": "String",
                "dataPath": "firstName"
            },
            {
                "type": "String",
                "dataPath": "lastName"
            }
        ],
        "target": {
            "type": "String",
            "dataPath": "name"
        },
        "formula": "return input1 + ' ' + input2;"
    },
    {
        "source": [
            {
                "type": "String",
                "dataPath": "email"
            }
        ],
        "target": {
            "type": "String",
            "dataPath": "email"
        },
        "formula": "logger.info('Checking Email:', input1); return input1;"
    },
    {
        "source": [
            {
                "type": "Array",
                "dataPath": "contactNumbers"
            }
        ],
        "target": {
            "type": "Array",
            "dataPath": "contactNumbers"
        },
        "formula": "return input1.map( e=>{return { value:e}} );"
    }
];

(async () => {
    const mapper = new Mapper(mappings, { db: { hello: 'world' }, logger: { info: console.log, error: console.log } });

    const result = await mapper.convert({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        contactNumbers: ['one', 'two', 'three']
    });

    console.log(result);
})();