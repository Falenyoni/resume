# My Resume 

> This is a simple website hosted in AWS.
![Alt text](image.png)

> Pricing
![Alt text](image-1.png)

> The files are uploaded to an s3 bucket called nyonibongani.com

> The bucket name is the same as the domain name bought using AWS Registrar Route 56.

> In Route 53 Hosted zone Add an A record that will point to the S3 Bucket you can change this later to point to the CloudFront distribution

> A certificate was created that directs http to https in AWS Certificate Manager (ACM)

> A cloud distribution was created, it points to the S3 bucket website end point and the certificate attached

> A C record was created in Route53 hosted zone.


Things Left
> Block access through the S3 website end point
> 
