/**
 *  @author @AduragbemiShobowale  Aduragbemi Shobowale
 *  @version 1.0
 */

// utils/passwordUtils.js
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

function generateRandomPassword(length = 12) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

module.exports = {
  generateRandomPassword,
  hashPassword,
};
