import { L5K, getL5K_Components } from '../ultility/L5K';

const fileDataWrangling = input => {
    let data, result, message
    try {
        data = String(input)
        //Getting all routine out of L5K
        data = { Type: 'ROUTINE', Items: getL5K_Components(data, L5K.Component.Routine) }
        result = 'successful'
    } catch (e) {
        data = {}
        result = 'fail'
        message = e
    }
    return { data, result, message };
}

export { fileDataWrangling }

