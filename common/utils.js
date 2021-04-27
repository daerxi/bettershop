const isNullOrEmpty = (obj) => {
    return !obj || !obj.trim() || obj.trim() !== '';
}

module.exports = {
    isNullOrEmpty
}