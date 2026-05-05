const getResultData = (result) => (result && result.success ? result.data : null);

module.exports = { getResultData };
