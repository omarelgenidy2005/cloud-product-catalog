# Cloud Product Catalog

Cloud Product Catalog is a web application built for the Cloud Computing 2026 AWS hosting milestone. The application allows users to perform CRUD operations on products and upload product images.

The project is deployed on AWS using EC2, Application Load Balancer, CloudFront, DynamoDB, S3, Lambda, IAM, and CloudWatch.

## Live Deployment

### CloudFront Distribution URL

```text
https://d3h5tvlxhf45qy.cloudfront.net
```

CloudFront is configured in front of the Application Load Balancer. It delivers the web application through a global CDN and forwards requests to the ALB origin.

### Application Load Balancer URL

```text
http://product-app-alb-1780355096.eu-north-1.elb.amazonaws.com
```

### API Test URL

```text
https://d3h5tvlxhf45qy.cloudfront.net/api/products
```

Alternative ALB API URL:

```text
http://product-app-alb-1780355096.eu-north-1.elb.amazonaws.com/api/products
```

## Project Features

* Create new products
* View all products
* View product details
* Update existing products
* Delete products
* Upload product images to Amazon S3
* Display uploaded product images in the frontend
* Store product data in Amazon DynamoDB
* Store image URL and image key with each product item
* Keep image version history using the `imageVersions` field
* Trigger AWS Lambda when a new image is uploaded to S3
* Store Lambda execution logs in CloudWatch
* Deploy the application on two EC2 instances
* Use an Application Load Balancer to distribute traffic across EC2 instances
* Use Amazon CloudFront to deliver the application through a global CDN

## Technology Stack

### Frontend

* React
* Vite
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* Multer
* AWS SDK for JavaScript v3

### AWS Services

* Amazon EC2
* Application Load Balancer
* Amazon CloudFront
* Amazon DynamoDB
* Amazon S3
* AWS Lambda
* AWS IAM
* Amazon CloudWatch

## Architecture Summary

The application is deployed in the Europe Stockholm region.

```text
Region: eu-north-1
```

Architecture flow:

```text
User / Browser
        ↓
Amazon CloudFront
        ↓
Application Load Balancer
        ↓
Two EC2 instances in public subnets
        ↓
Nginx serves React frontend
Express backend handles API requests
        ↓
DynamoDB stores product data
S3 stores product images
        ↓
S3 upload triggers Lambda
Lambda creates output in resized/
CloudWatch stores Lambda logs
```

## AWS Resources

### CloudFront

```text
Distribution domain name: d3h5tvlxhf45qy.cloudfront.net
Purpose: Delivers the web application through a global CDN and forwards requests to the Application Load Balancer.
```

### Application Load Balancer

```text
product-app-alb-1780355096.eu-north-1.elb.amazonaws.com
```

### EC2 Instances

#### EC2 Instance 1

```text
Name: product-app-ec2-1
Public IP: 13.61.104.131
Private IP: 172.31.44.124
Runs: Nginx + React + Express backend
```

#### EC2 Instance 2

```text
Name: product-app-ec2-2
Public IP: 16.170.226.75
Private IP: 172.31.43.115
Runs: Nginx + React + Express backend
```

### DynamoDB

```text
Table name: Products
Partition key: productId
```

Stored product attributes include:

```text
productId
name
description
price
category
imageKey
imageUrl
imageVersions
createdAt
updatedAt
```

### S3

```text
Bucket name: omar-product-images-2026
```

S3 folder structure:

```text
products/   original uploaded product images
resized/    Lambda output images
```

### Lambda

```text
Function name: resizeProductImage
Trigger: S3 object-created event on products/
Purpose: Process uploaded product images and create output in resized/
```

### IAM

```text
Role name: EC2ProductAppRole
Purpose: Allows EC2 backend to access DynamoDB and S3
```

### CloudWatch

```text
Used for Lambda execution logs
```

## Backend API Endpoints

Base URL through CloudFront:

```text
https://d3h5tvlxhf45qy.cloudfront.net/api/products
```

Base URL through ALB:

```text
http://product-app-alb-1780355096.eu-north-1.elb.amazonaws.com/api/products
```

### Get all products

```http
GET /api/products
```

### Get one product

```http
GET /api/products/:id
```

### Create product

```http
POST /api/products
```

Body type:

```text
multipart/form-data
```

Fields:

```text
name
description
price
category
image
```

### Update product

```http
PATCH /api/products/:id
```

Body type:

```text
multipart/form-data
```

Fields:

```text
name
description
price
category
image
```

### Delete product

```http
DELETE /api/products/:id
```

## Local Development

### Backend

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5001
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE=Products
S3_BUCKET=omar-product-images-2026
```

Run backend locally:

```bash
npm run dev
```

Backend local URL:

```text
http://localhost:5001
```

API local URL:

```text
http://localhost:5001/api/products
```

### Frontend

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend locally:

```bash
npm run dev
```

Frontend local URL:

```text
http://localhost:5173
```

## EC2 Deployment Summary

Each EC2 instance runs:

```text
Nginx
React production build
Express backend with PM2
```

Backend runs on:

```text
localhost:5001
```

Nginx serves the frontend and proxies API requests:

```text
/api/ → http://localhost:5001/api/
```

PM2 command used:

```bash
pm2 start server.js --name product-backend
pm2 save
```

Nginx configuration:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

## CloudFront Configuration Summary

CloudFront is configured with the Application Load Balancer as its origin.

```text
CloudFront domain: d3h5tvlxhf45qy.cloudfront.net
Origin: product-app-alb-1780355096.eu-north-1.elb.amazonaws.com
Default root object: index.html
Allowed methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
Cache policy: CachingDisabled
Origin request policy: AllViewer
```

## Deployment Notes

* The application is deployed on two EC2 instances.
* Both EC2 instances are behind an Application Load Balancer.
* CloudFront is configured in front of the Application Load Balancer.
* Both EC2 instances connect to the same DynamoDB table.
* Both EC2 instances upload images to the same S3 bucket.
* Lambda is triggered when images are uploaded to the S3 `products/` folder.
* The deployed app can be accessed through the CloudFront distribution URL.
* The Application Load Balancer is used as the CloudFront origin.

## Architecture Diagram

The architecture diagram is included in the project submission files.

File names:

```text
cloud-product-catalog-architecture.png
cloud-product-catalog-architecture.pdf
```

## Demo Checklist

The demo should show:

* Opening the deployed app using the CloudFront URL
* Showing that CloudFront forwards requests to the Application Load Balancer
* Viewing products
* Creating a product with an image
* Verifying the item in DynamoDB
* Verifying the image in S3
* Verifying Lambda output in the `resized/` folder
* Editing a product
* Deleting a product
* Showing both EC2 instances
* Showing the Application Load Balancer target group health
* Showing the CloudFront distribution
* Explaining the architecture diagram

## Submission Details

### GitHub Repository

```text
https://github.com/omarelgenidy2005/cloud-product-catalog
```

### CloudFront Distribution Domain

```text
d3h5tvlxhf45qy.cloudfront.net
```

### CloudFront URL

```text
https://d3h5tvlxhf45qy.cloudfront.net
```

### Application Load Balancer DNS

```text
product-app-alb-1780355096.eu-north-1.elb.amazonaws.com
```

### EC2 Private IPs

```text
product-app-ec2-1 private IP: 172.31.44.124
product-app-ec2-2 private IP: 172.31.43.115
```

## Important Note

Do not terminate AWS resources after submission. Stop EC2 instances if needed, but do not terminate them.
