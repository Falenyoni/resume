---
title: Setting Up a Dual-Stack VPC Using AWS CDK in C#
date: 2023-06-08
category: AWS
tags: [AWS, CDK, C#, VPC, IPv6]
image: /assets/blog-vpc.jpg
excerpt: A step-by-step guide to setting up a dual-stack (IPv4 and IPv6) Virtual Private Cloud using AWS CDK with C#.
---

# Setting Up a Dual-Stack VPC Using AWS CDK in C#

Cloud infrastructure management has evolved significantly over the years, with Infrastructure as Code (IaC) becoming the standard practice for deploying and managing cloud resources. AWS Cloud Development Kit (CDK) is one of the powerful IaC frameworks that allows you to define your infrastructure using familiar programming languages.

In this guide, I'll walk you through setting up a dual-stack (IPv4 and IPv6) Virtual Private Cloud (VPC) using AWS CDK with C#.

## Prerequisites

Before we start, make sure you have the following installed:

- [.NET Core SDK](https://dotnet.microsoft.com/download) (3.1 or later)
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials

## Project Setup

First, let's create a new CDK project:

```bash
mkdir DualStackVpcCdk
cd DualStackVpcCdk
cdk init app --language csharp
```

This will create a new CDK project with the necessary files and structure.

## Implementing the Dual-Stack VPC

Open the `src/DualStackVpcCdk/DualStackVpcCdkStack.cs` file and replace its contents with the following code:

```csharp
using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using System.Collections.Generic;

namespace DualStackVpcCdk
{
    public class DualStackVpcCdkStack : Stack
    {
        public DualStackVpcCdkStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            // Create a VPC with dual-stack support
            var vpc = new Vpc(this, "DualStackVpc", new VpcProps
            {
                MaxAzs = 2,
                IpAddresses = IpAddresses.Ipv4AndIpv6,
                NatGateways = 1,
                SubnetConfiguration = new[]
                {
                    new SubnetConfiguration
                    {
                        CidrMask = 24,
                        Name = "Public",
                        SubnetType = SubnetType.PUBLIC
                    },
                    new SubnetConfiguration
                    {
                        CidrMask = 24,
                        Name = "Private",
                        SubnetType = SubnetType.PRIVATE_WITH_EGRESS
                    }
                }
            });

            // Output the VPC ID
            new CfnOutput(this, "VpcId", new CfnOutputProps
            {
                Value = vpc.VpcId,
                Description = "The ID of the Dual-Stack VPC"
            });
        }
    }
}
```

In this code, we're creating a VPC with both IPv4 and IPv6 addressing using the `IpAddresses.Ipv4AndIpv6` property. We're also configuring public and private subnets across two availability zones.

## Deploying the Stack

Now, let's build and deploy our stack:

```bash
dotnet build
cdk deploy
```

This will synthesize a CloudFormation template from our CDK code and deploy it to AWS.

## Verifying the Deployment

Once the deployment is complete, you can verify that your VPC has been created with dual-stack support by checking the AWS Management Console or using the AWS CLI:

```bash
aws ec2 describe-vpcs --vpc-ids <your-vpc-id>
```

You should see that your VPC has both IPv4 and IPv6 CIDR blocks associated with it.

## Conclusion

In this guide, we've learned how to set up a dual-stack VPC using AWS CDK in C#. Dual-stack VPCs provide support for both IPv4 and IPv6 traffic, which is becoming increasingly important as the internet transitions to IPv6.

By using AWS CDK, we can define our infrastructure in a familiar programming language, which makes it easier to version control, test, and maintain our infrastructure code.

Happy coding!
