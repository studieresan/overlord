import * as aws from 'aws-sdk'

aws.config.region = process.env.AWS_REGION

export function signedUploadRequest(req: any, res: any) {
  const s3 = new aws.S3()
  const fileName = req.query['file-name']
  const fileType = req.query['file-type']
  const BUCKET = process.env.S3_BUCKET
  const key = `uploads/${Date.now()}/${fileName}`
  const s3Params = {
    Bucket: BUCKET,
    Key: key,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  }

  s3.getSignedUrl('putObject', s3Params, (err: any, data: string) => {
    if (err) {
      console.log(err)
      return res.end()
    }
    const returnData = {
      signedRequest: data,
      url: `https://${BUCKET}.s3.amazonaws.com/${key}`,
    }
    res.write(JSON.stringify(returnData))
    res.end()
  })
}

