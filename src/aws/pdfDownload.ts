import * as aws from 'aws-sdk'

export const getPDF = (req: any, res: any) => {
    aws.config.region = process.env.AWS_REGION
    aws.config.signatureVersion = 'v4'
    const s3 = new aws.S3()
    const getParams = {
        Bucket: 'studs21',
        Key: req.originalUrl === '/brochure.pdf'
            ? 'sales/Broschyr_3.0.pdf'
            : 'sales/Broschyr_3.0_eng.pdf',
    }

    res.setHeader('Content-Security-Policy', 'frame-ancestors *')
    s3.getObject(getParams).createReadStream().pipe(res)
}