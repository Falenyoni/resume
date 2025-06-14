﻿# My Resume

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

## Summary of Portfolio Website Enhancements

### 1. Added CV Download Functionality

- Added CV download button in social links section with animated hover effects
- Implemented download links in both desktop and mobile navigation menus
- Added CV link in the footer for easy access
- Ensured mobile-friendly design with responsive styling

### 2. Added a New Blog Post on Modern CSS Features

Created `modern-css-features.md` with comprehensive content about modern CSS features including:
- CSS Custom Properties (Variables)
- CSS Grid Layout
- Logical Properties
- Container Queries
- Modern Selectors
- Aspect Ratio

### 2. Added Reading Time Estimation

- Implemented a function to calculate estimated reading time for blog posts
- Added reading time indicators to both blog post listings and individual posts
- Used a clean, icon-based display format for reading time

### 3. Enhanced Code Block Styling

- Added language indicators to code blocks for better readability
- Improved code block styling with better syntax highlighting
- Added responsive design adjustments for code blocks on mobile devices

### 4. Added Dynamic Copyright Year

- Made the copyright year in the footer dynamic instead of static
- Added a function to automatically update the year without manual changes

### 5. Improved Blog Post Navigation

- Added a share button to blog posts
- Implemented sharing functionality using the Web Share API with clipboard fallback
- Enhanced styling for blog post actions

### 6. Enhanced Mobile Responsiveness

- Improved blog display on mobile devices
- Added specific styling for tables and other elements on smaller screens
- Added print styles for better printing of blog posts
