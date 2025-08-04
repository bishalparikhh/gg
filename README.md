# GamersGlitch: Gaming Marketplace Platform

GamersGlitch is a **full-stack marketplace platform**—inspired by OLX—built for the secure buying and selling of **game skins, accounts, and accessories**. The project leverages modern web technologies, robust authentication, scalable cloud infrastructure, and DevOps best practices to deliver a seamless marketplace experience for gamers.

## Features

- **End-to-end Marketplace**: Buy and sell game assets including skins, accounts, and accessories.
- **Authentication**: Secure login/registration with Auth0.
- **Fast & Modern UI**: Built with Next.js for speed, SEO, and developer productivity.
- **Image Uploads**: Game asset images are stored securely using AWS S3.
- **Database**: Listings, users, and transactional data are handled via MongoDB.
- **CI/CD & DevOps**:
  - Automated builds with GitHub Actions.
  - Dockerized for reliable deployments.
  - Container registry via Amazon ECR.
  - Automated ECS deployments with new task definitions.
  - Secrets and configuration managed using AWS SSM Parameter Store.
  - Security best practices enforced via AWS IAM.

## Tech Stack

| Layer               | Tool/Service              |
|---------------------|--------------------------|
| Frontend            | Next.js                  |
| Authentication      | Auth0                    |
| Database            | MongoDB                  |
| Image Hosting       | AWS S3                   |
| Containerization    | Docker                   |
| CI/CD Pipeline      | GitHub Actions           |
| Container Registry  | Amazon ECR               |
| Orchestration       | Amazon ECS               |
| Secrets Management  | AWS SSM Parameter Store  |
| Security            | AWS IAM                  |

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Docker
- AWS Account (you’ll need permissions for S3, ECR, ECS, SSM, IAM)
- Auth0 account
- MongoDB Atlas or MongoDB URI

### Environment Variables

Set the following variables as **secrets** (ideally in AWS SSM Parameter Store):

```
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
MONGODB_URI=
AWS_REGION=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
Add additional required variables for ECR/ECS as needed.

### Local Development

1. **Clone** the repo:
    ```bash
    git clone https://github.com/yourusername/gamersglitch.git
    cd gamersglitch
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Run locally:**
    ```bash
    npm run dev
    ```
4. App will be available at `http://localhost:3000`

## Deployment

**Production deployments** are fully automated via a CI/CD pipeline:

1. **GitHub Actions** build and test on every push.
2. The app is **Dockerized** and images are pushed to **Amazon ECR**.
3. Upon new image availability, ECS task definition is updated and a rolling deployment is triggered.
4. Sensitive credentials are fetched from **AWS SSM Parameter Store**.
5. All AWS resources (ECS, ECR, S3, IAM) are set up with least-privilege access.

## Security & Best Practices

- **All sensitive credentials** are never stored as plain environment variables but instead managed securely in SSM.
- **IAM roles** are assigned for app and deployment, following the least-privilege principle.
- **Image uploads** are sanitized and secured.
- **Automated CI/CD pipeline** ensures seamlessly repeatable, reliable production deployments.

## Folder Structure

```
/pages              # Next.js app routes and API endpoints
/components         # React UI components
/models             # MongoDB models
/utils              # Utility functions
/public             # Static assets
/docker             # Docker related configs
/.github/workflows  # CI/CD pipelines
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/foo`)
3. Commit your changes
4. Push to your branch (`git push origin feature/foo`)
5. Open a pull request

## License

Distributed under the MIT License.

## Contact

**Project by:** GamersGLitch
For issues/queries: Open a GitHub issue or contact the project maintainer.

**Happy gaming and trading!**
