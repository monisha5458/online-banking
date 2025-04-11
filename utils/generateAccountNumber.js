// utils/generateAccountNumber.js
exports.generateAccountNumber = () => {
    return 'ACC' + Math.floor(1000000000 + Math.random() * 9000000000);
  };
  