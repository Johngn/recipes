/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import aws from 'aws-sdk';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();
  const post = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  res.status(200).json(post);
};
