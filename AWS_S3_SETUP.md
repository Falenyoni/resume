# Hosting Your Resume Website on Amazon S3

This guide will walk you through hosting your resume website on Amazon S3 and optimizing it for proper animation functionality.

## Prerequisites

- An AWS account
- Your resume website files ready to be uploaded
- Basic familiarity with AWS services

## Step 1: Create an S3 Bucket

1. Sign in to the AWS Management Console at https://console.aws.amazon.com/
2. Navigate to the S3 service
3. Click "Create bucket"
4. Enter a unique bucket name (e.g., `your-name-resume`)
5. Select the AWS Region closest to your target audience
6. Uncheck "Block all public access" (since you want your website to be public)
7. Acknowledge the warning about making the bucket public
8. Keep all other default settings and click "Create bucket"

## Step 2: Configure the Bucket for Static Website Hosting

1. Click on your newly created bucket name
2. Go to the "Properties" tab
3. Scroll down to "Static website hosting" and click "Edit"
4. Select "Enable" for static website hosting
5. Enter `index.html` for both the index and error document
6. Click "Save changes"

## Step 3: Set Bucket Policy for Public Access

1. Go to the "Permissions" tab
2. Under "Bucket policy", click "Edit"
3. Copy and paste the following policy (replace `your-bucket-name` with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

4. Click "Save changes"

## Step 4: Configure CORS (Cross-Origin Resource Sharing)

1. Stay in the "Permissions" tab
2. Under "Cross-origin resource sharing (CORS)", click "Edit"
3. Copy and paste the following CORS configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

4. Click "Save changes"

## Step 5: Upload Your Website Files

1. Go to the "Objects" tab
2. Click "Upload"
3. Add all your website files and folders, maintaining the directory structure
4. Click "Upload"

## Step 6: Set Custom Headers for Security and Animation Compatibility

For proper animation functionality, we need to add some custom headers. S3 alone can't set custom HTTP headers, so we'll need to use CloudFront:

1. Go to CloudFront in the AWS console
2. Click "Create Distribution"
3. For "Origin Domain", select your S3 website endpoint
4. Under "Origin", select "Origin Shield" as disabled
5. Under "Default cache behavior":
   - Set "Viewer protocol policy" to "Redirect HTTP to HTTPS"
   - Set "Allowed HTTP methods" to "GET, HEAD"
   - Set "Cache policy" to "CachingOptimized"
6. Under "Function associations", click "Add response header policy"
7. Click "Create policy"
8. Name the policy "ResumeWebsiteHeaders"
9. Add these headers:
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; img-src 'self' data:; font-src 'self' cdnjs.cloudflare.com; frame-ancestors 'none';
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   ```
10. Save the policy and select it for your distribution
11. Click "Create distribution"

## Step 7: Create a Lambda@Edge Function (Optional but Recommended)

To ensure all animations work properly across all browsers and handle certain edge cases, you can create a Lambda@Edge function:

1. Go to Lambda in the AWS console
2. Click "Create function"
3. Select "Author from scratch"
4. Name the function "ResumeWebsiteEnhancer"
5. Select "Node.js 16.x" for the runtime
6. For architecture, choose "x86_64"
7. Click "Create function"
8. Replace the code with:

```javascript
'use strict';

exports.handler = (event, context, callback) => {
    // Get the request and response
    const response = event.Records[0].cf.response;
    const request = event.Records[0].cf.request;
    
    // Add security headers
    response.headers['content-security-policy'] = [{
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; img-src 'self' data:; font-src 'self' cdnjs.cloudflare.com; frame-ancestors 'none';"
    }];
    response.headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains'
    }];
    response.headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }];
    response.headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'DENY'
    }];
    response.headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    }];
    
    // Return the modified response
    callback(null, response);
};
```

9. Click "Deploy"
10. In the CloudFront console, edit your distribution
11. Under "Function associations", add this Lambda function with the trigger "Origin response"
12. Save your changes

## Step 8: Test Your Website

1. Wait for CloudFront to deploy your distribution (status will change to "Deployed")
2. Get your CloudFront domain name (like d1234abcde.cloudfront.net)
3. Open your website in a browser and verify that animations are working properly

## Step 9: Set Up a Custom Domain (Optional)

1. Register a domain in Route 53 or use an existing domain
2. Create a new certificate in AWS Certificate Manager (ACM) for your domain
3. Add your domain as an alternate domain name in your CloudFront distribution
4. Create a Route 53 record that points to your CloudFront distribution

## Troubleshooting Animation Issues

If you still encounter animation issues:

1. **Check Browser Console**: Look for any JavaScript errors or CSP violations
2. **Verify CSS Loading**: Ensure all CSS files are being loaded properly
3. **Test in Incognito Mode**: This eliminates extension interference
4. **Try Different Browsers**: Test in Chrome, Firefox, Safari, and Edge
5. **Check Network Tab**: Verify all assets are loading properly
6. **Adjust CSP Headers**: You might need to modify the Content-Security-Policy header

## Maintaining Your Website

When you need to update your website:

1. Make your changes locally
2. Upload the changed files to your S3 bucket
3. If you're using CloudFront, create an invalidation to clear cached content

By following these steps, your resume website should now be hosted on Amazon S3 with proper animation support and enhanced security features!
