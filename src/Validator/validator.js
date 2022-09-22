const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}
const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}
const isValidPhone = function (value) {
    if (!(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(value.trim()))) {
        return false
    }
    return true
}
const isValidEmail = function (value) {
    if (!(/^[a-z0-9+_.-]+@[a-z0-9.-]+$/.test(value.trim()))) {
        return false
    }
    return true
}
const isValidPassword = function(value) {
    if(!(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(value.trim()))) {
        return false
    }
    return true
}
const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}
module.exports= { isValid,isValidBody,isValidPhone,isValidEmail,
                isValidPassword,isValidobjectId }

 