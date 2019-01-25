const dotenv = require('dotenv');

dotenv.config();

module.exports.linkedin = {
  oauth: process.env.LINKEDIN_OAUTH,
  peopleURL: process.env.LINKEDIN_PEOPLE,
  tokenURL: process.env.LINKEDIN_TOKEN,
  grantType: process.env.LINKEDIN_GRANT_TYPE,
  redirect: process.env.LINKEDIN_REDIRECT,
  id: process.env.LINKEDIN_ID,
  secret: process.env.LINKEDIN_SECRET,
};
