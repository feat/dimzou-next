/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const path = require('path');
const modules = fs.readdirSync(
  path.join(__dirname, '../../../app/modules'),
);

function componentExists(comp) {
  return modules.indexOf(comp) >= 0;
}

module.exports = componentExists;
