const crypto = require('crypto');

const hashPassword = (password) => {
    return crypto.createHash("sha256").update(password).digest("hex");
};


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'veryveryyyyyysecretkey';

module.exports = { hashPassword, JWT_SECRET_KEY }