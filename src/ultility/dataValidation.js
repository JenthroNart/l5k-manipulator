import split from 'lodash/split';
import toNumber from 'lodash/toNumber';
import isInteger from 'lodash/isInteger';
import set from 'lodash/set';
import get from 'lodash/get';
import keys from 'lodash/keys';
import isNaN from 'lodash/isNaN';
import isString from 'lodash/isString';
import filter from 'lodash/filter';


const validateItem = (model, data, collection, dataPool, validatingKeys) => {
    const validatedData = {}
    const validation = {}
    model = model ? model : data
    validatingKeys = Array.isArray(validatingKeys) && validatingKeys.length > 0 ? validatingKeys : keys(model)
    validatingKeys.forEach(key => {
        let castedValue = get(data, key);
        let validationResult = undefined;
        //validating dataType
        const dataType = get(model, [key, 'data_type']);
        switch (dataType) {
            case 'array':
                castedValue = split(castedValue, ',')
                validationResult = true
                break;
            case 'number':
                castedValue = toNumber(castedValue)
                validationResult = isNaN(castedValue) ? false : true;
                break;
            case 'integer':
                castedValue = toNumber(castedValue)
                validationResult = isInteger(castedValue) ? true : false;
                break;
            case 'string':
                validationResult = isString(castedValue) ? true : false;
                break;
            default:
                validationResult = true
        }
        //validating uniqueness
        if (get(model, [key, 'unique']) === true) {
            const filteredList = filter(collection, item => item[key] === castedValue)
            validationResult = filteredList.length > 1 ? false : validationResult
        }
        set(validatedData, key, castedValue)
        set(validation, key, validationResult)
    })
    return { validatedData, validation }
}

const validateCollection = (model, item, collection, validatingKeys) => {

}
export { validateItem, validateCollection }