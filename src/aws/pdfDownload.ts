import { S3 } from '@aws-sdk/client-s3';

export const getPDF = async (req: any, res: any) => {
    const s3 = new S3({
        region: process.env.AWS_REGION,
    });

    const getParams = {
        Bucket: 'studs21',
        Key: req.originalUrl === '/brochure.pdf'
            ? 'sales/Broschyr_3.0.pdf'
            : 'sales/Broschyr_3.0_eng.pdf',
    }
    res.setHeader('Content-Security-Policy', 'frame-ancestors *')
    const stream = await s3.getObject(getParams)
    if (!stream.Body) {
        throw new Error('No body returned from S3')
    }
    const readable = stream.Body as unknown as NodeJS.ReadableStream
    readable.pipe(res)
}