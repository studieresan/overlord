import { PutObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3({
  apiVersion: '2006-03-01',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  region: process.env.AWS_REGION ?? "",
});

export async function signedUploadRequest(req: any, res: any) {
  const fileName = req.query['file-name']
  const fileType = req.query['file-type']
  console.log("fileName: ", fileName)
  console.log("fileType: ", fileType)

  if (!fileName || !fileType) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: "Missing required parameters" }));
    res.end();
    return;
  }

  const key = `${Date.now()}-${fileName}`

  const params = {
    Bucket: process.env.S3_BUCKET ?? "",
    Key: key,
    ContentType: fileType,
  };
  try {
    const signedUrl = await getSignedUrl(s3Client, new PutObjectCommand(params), { expiresIn: 60 });

    const returnData = {
      signedRequest: signedUrl,
      url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    }


    console.log("returnData: ", returnData)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(returnData))
    res.end()
  } catch (err) {
    console.log(err)
    res.end(err)
  }
}

