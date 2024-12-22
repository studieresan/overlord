import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function signedUploadRequest(req: any, res: any) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
  });

  const fileName = req.query['file-name']
  const fileType = req.query['file-type']
  console.log("req.query: ", fileName, fileType)
  const BUCKET = process.env.S3_BUCKET
  const REGION = process.env.AWS_REGION
  const key = `uploads/${Date.now()}/${fileName}`
  console.log("AWS_REGION:", process.env.AWS_REGION);
  console.log("S3_BUCKET:", process.env.S3_BUCKET);
  console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
  console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);


  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
    // ACL: 'public-read'
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    const returnData = {
      signedRequest: signedUrl,
      url: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`,
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(returnData))
    res.end()
  } catch (err) {
    console.log(err)
    res.end()
  }
}

