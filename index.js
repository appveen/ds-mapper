const path = require('path');
const { writeFileSync } = require('fs');
const { v4: uuid } = require('uuid');
const _ = require('lodash');


function Mapper(mappings, options) {
    this.options = options;
    this.mappings = mappings;
    const code = genrateCode(mappings, options);
    writeFileSync(path.join(__dirname, 'mapper.js'), code, 'utf-8');
}

Mapper.prototype.convert = async function (inputJSON) {
    const json = await require('./mapper.js')(inputJSON, this.options);
    return json;
};



function genrateCode(mappings, options) {
    let code = [];
    code.push(`const _ = require('lodash');`);
    code.push(`async function convert(inputJSON, options) {`);
    if (options) {
        Object.keys(options).forEach(key => {
            code.push(`${tab(1)}const ${key} = options.${key};`);
        });
    }
    code.push(`${tab(1)}let newBody = {};`);
    mappings.forEach(mappingData => {
        const formulaCode = [];
        const formulaID = 'formula_' + _.camelCase(uuid());
        mappingData.formulaID = formulaID;
        formulaCode.push(`${tab(1)}async function ${formulaID}(data) {`);
        mappingData.source.forEach((source, i) => {
            formulaCode.push(`${tab(2)}let input${i + 1} = _.get(data, '${source.dataPath}');`);
        });
        if (mappingData.formula) {
            formulaCode.push(`${tab(2)}${mappingData.formula}`);
        } else if (mappingData.source && mappingData.source.length > 0) {
            formulaCode.push(`${tab(2)}return input1;`);
        }
        formulaCode.push(`${tab(1)}}`);
        code.push(formulaCode.join('\n'));
    });
    // code.push(`${tab(1)}if (Array.isArray(inputJSON)) {`);
    // code.push(`${tab(2)}newBody = [];`);
    // code.push(`${tab(2)}let promises = inputJSON.map( async(item) => {`);
    // code.push(`${tab(3)}let tempBody = {};`);
    // mappings.forEach(mappingData => {
    //     code.push(`${tab(3)}_.set(tempBody, '${mappingData.target.dataPath}', await ${mappingData.formulaID}(item));`);
    // });
    // code.push(`${tab(3)}newBody.push(tempBody);`);
    // code.push(`${tab(2)}});`);
    // code.push(`${tab(2)}await Promises.all(promises);`);
    // code.push(`${tab(1)}} else {`);
    mappings.forEach(mappingData => {
        code.push(`${tab(2)}_.set(newBody, '${mappingData.target.dataPath}', await ${mappingData.formulaID}(inputJSON));`);
    });
    // code.push(`${tab(1)}}`);
    code.push(`${tab(1)}return newBody;`);
    code.push(`}`);
    code.push(`module.exports = convert;`);
    return code.join('\n');
}

function tab(len) {
    let d = '';
    while (len > 0) {
        d += '\t';
        len--;
    }
    return d;
}


module.exports = Mapper;