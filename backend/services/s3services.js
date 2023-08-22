const AWS = require("aws-sdk");

AWS.config.update({
  maxRetries: 3,
  httpOptions: { timeout: 30000, connectTimeout: 5000 },
  region: "eu-north-1",
  accessKeyId: process.env.IAM_USER_ACCESS_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET_KEY,
});

const uploadToS3 = (data, filename) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_ACCESS_KEY = process.env.IAM_USER_ACCESS_KEY;
  const IAM_SECRET_KEY = process.env.IAM_USER_SECRET_KEY;

  let s3bucket = new AWS.S3({
    accesskey: IAM_ACCESS_KEY,
    secretaccesskey: IAM_SECRET_KEY,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
};

module.exports = {
  uploadToS3,
};
