const _ = require('lodash');
const fs = require('fs');

module.exports = function (options, savePath = '/tailwind-variables.scss') {
    return ({ config }) => {
        let defaultConfigOptions = ['theme.screens'];
        const configOptions = merge_arrays(defaultConfigOptions, options);

        // Build up config object
        let vars = {};

        configOptions.forEach((item) => {
            // split on .
            let keys = item.split('.');
            let value = config(item);
            var res = keys.reduceRight((value, key) => ({[key]: value}), value);
            vars = _.merge(vars, res);
        });

        // console.log(vars);

        let finalString = '';

        let generatedArray = findPropPaths(vars, key => key.length > 0);

        if (Array.isArray(generatedArray) && generatedArray.length) {
            generatedArray.forEach((path)=>{
                if(typeof config(path) === 'string' || typeof config(path) === 'number') {
                    finalString += '$' + 'tw-' + path.replace(/[.]/gm, '-') + ': ' + config(path) + "; \n";
                }
                // console.log("\n\n" + path + "\n\n");
            });
        }

        fs.writeFileSync(__dirname + savePath, finalString); 
    };
}

function merge_arrays(array1, array2) {
    var result_array = [];
    var arr = array1.concat(array2);
    var len = arr.length;
    var assoc = {};

    while(len--) {
        var item = arr[len];

        if(!assoc[item]) 
        { 
            result_array.unshift(item);
            assoc[item] = true;
        }
    }

    return result_array;
}

function findPropPaths(obj, predicate) {  // The function 
    const discoveredObjects = []; // For checking for cyclic object
    const path = [];    // The current path being searched
    const results = []; // The array of paths that satify the predicate === true
    if (!obj && (typeof obj !== "object" || Array.isArray(obj))) {
        throw new TypeError("First argument of finPropPath is not the correct type Object");
    }
    if (typeof predicate !== "function") {
        throw new TypeError("Predicate is not a function");
    }
    (function find(obj) {
        for (const key of Object.keys(obj)) {  // use only enumrable own properties.
            if (predicate(key, path, obj) === true) {     // Found a path
                path.push(key);                // push the key
                results.push(path.join("."));  // Add the found path to results
                path.pop();                    // remove the key.
            }
            const o = obj[key];                 // The next object to be searched
            if (o && typeof o === "object" && ! Array.isArray(o)) {   // check for null then type object
                if (! discoveredObjects.find(obj => obj === o)) {  // check for cyclic link
                    path.push(key);
                    discoveredObjects.push(o);
                    find(o);
                    path.pop();
                }
            }
        }
    } (obj));
    return results;
}