import { S3Client,PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function signedUploadRequest(req: any, res: any) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION
  });

  const fileName = req.query['file-name']
  const fileType = req.query['file-type']
  const BUCKET = process.env.S3_BUCKET
  const key = `uploads/${Date.now()}/${fileName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    //Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    
    const returnData = {
      signedRequest: signedUrl,
      url: `https://${BUCKET}.s3.amazonaws.com/${key}`,
    }
    
    res.write(JSON.stringify(returnData))
    res.end()
  } catch (err) {
    console.log(err)
    res.end()
  }
}

