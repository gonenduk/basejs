module.exports = string => {
  let checksum = 0x12345678;
  for (let index = 0; index < string.length; index++) {
    checksum += (string.charCodeAt(index) * (index + 1));
  }
  return checksum;
};
