const LINK_REG_EXP = /https?:\/\/[a-z0-9-.]{2,}.[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/i;
const EMAIL_REG_EXP = /[a-z0-9_]{2,}@[a-z0-9]{2,}\.[a-z]{2,5}/i;

module.exports = { LINK_REG_EXP, EMAIL_REG_EXP };
