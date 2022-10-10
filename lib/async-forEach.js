//
// async-forEach.js
//
// Example usage:
//
// const people = ["eric", "max", "nate"];
// await forEach(people, async person => {
//   await flagUser(person);
// });
//
//
const forEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i],i);
  }
};

module.exports = forEach;

