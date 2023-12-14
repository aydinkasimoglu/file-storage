# File Storage Web Application

A robust web application designed for secure and scalable file storage. This project utilizes a combination of AWS services and NextJS for a seamless user experience.

## Features

- **AWS S3 Integration**: Leverage the power of AWS S3 for efficient and reliable file storage.
- **AWS Cognito Authentication**: Ensure data security with AWS Cognito, providing robust user authentication and access control.
- **NextJS Frontend**: Experience a responsive and dynamic user interface crafted with NextJS, enhancing usability.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/aydinkasimoglu/file-storage
```

2. Install dependencies:

```bash
cd filevault
npm install
```
3. Set up AWS credentials:
  Ensure you have AWS credentials configured access to S3 and Cognito services.

4. Configure environment variables:
  Create a *.env.local.* file in the root directory and add the following:

```env
S3_REGION=<your_aws_region>
S3_ACCESS_KEY_ID=<your_s3_acces_key>
S3_SECRET_ACCESS_KEY=<your_secret_acces_key_of_iam_user>
S3_BUCKET_NAME=<your_s3_bucket_name>
```

5. Create *userPool.ts* file in the /app directory and add the following:

```js
import { CognitoUserPool } from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: <your_cognito_user_pool_id>,
  ClientId: <your_cognito_client_id>,
});

export default userPool;
```

7. Run the application:

```bash
npm run dev
```

  Open your browser and navigate to http://localhost:3000

## License

This project is licensed under the [MIT License](LICENSE), making it open for collaboration and improvement.
