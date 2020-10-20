const fileDataWrangling = input => {
    let data, result, message
    try {
        data = String(input)
        result = 'successful'
    } catch (e) {
        data = {}
        result = 'fail'
        message = e
    }
    return { data, result, message };
}

export { fileDataWrangling }