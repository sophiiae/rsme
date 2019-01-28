const dotenv = require('dotenv');

dotenv.config();

module.exports.linkedin = {
  oauth: process.env.LINKEDIN_OAUTH_PRE + process.env.LINKEDIN_ID + process.env.LINKEDIN_OAUTH_REDIRECT + process.env.LINKEDIN_REDIRECT + process.env.LINKEDIN_OAUTH_SUF,
  peopleURL: process.env.LINKEDIN_PEOPLE,
  tokenURL: process.env.LINKEDIN_TOKEN,
  grantType: process.env.LINKEDIN_GRANT_TYPE,
  redirect: process.env.LINKEDIN_REDIRECT,
  id: process.env.LINKEDIN_ID,
  secret: process.env.LINKEDIN_SECRET,
};

module.exports.github = {
  pre: process.env.GITHUB_PRE,
};
