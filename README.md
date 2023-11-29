# My Resume

## Steps

1.  Create HTML, CSS and JavaScript files — with the help of ChatGPT/other material optional

2.  Create an S3 bucket
    > The files are uploaded to an s3 bucket called nyonibongani.com

    > The bucket name is the same as the domain name bought using AWS Registrar Route 56. The bucket This domain name brings traffic to your bucket
3.  Configure the S3 bucket for static website hosting
4.  Create a bucket policy to allow public read access in the S3 bucket
    ```
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowPublicReadAccess",
                "Effect": "Allow",
                "Principal": "*",
                "Action": ["s3:GetObject"],
                "Resource": ["arn:aws:s3:::<bucket_name>/*"]
            }
        ]
    }
    ```
        > Replace the <bucket_name> with the bucket name you created
5.  Upload resume code files to the S3 bucket
6.  Test things out with the S3 bucket website endpoint
7.  Register a domain name with Route 53
    > In Route 53 Hosted zone Add an A record that will point to the S3 Bucket website you can change this later to point to the CloudFront distribution

    > View the status of DNS propagation in Route 53
8.  Request a public SSL/TLS certificate in AWS Certificate Manager
    > A certificate was created that directs http to https in AWS Certificate Manager (ACM)
9.  Create a CloudFront distribution to point to our static website in S3
    > A cloud distribution was created, it points to the S3 bucket website end point and the certificate attached

    > A C record was created in Route53 hosted zone.
10. Update the A Record in Route 53 to point to the CloudFront distribution
11. Review the final masterpiece of what we built—nice work!

## Things Left

1. Block access through the S3 website end point
2. Create CI/CD For the project
3. Create Terraform project uploading files to s3 (look into the pros and cons for this when its a team)
