# Clean API Architecture

It aspires to produce a separation of concerns by subdividing a project into layers.
Each layer abides by the Single Responsibility Principle, ensuring each class is only handling one part of the process, and is more easily and thoroughly unit tested.

We define the following layers:

- Frameworks and Cloud
- Interface Adapters
- Application Logic
- Entity Logic
- Data

None of the layers have visibility into higher layers. They may have references to their child layer, but definitely not their grandchildren

## Frameworks and Cloud

Any endpoint request must be routed to the appropriate code path through a Load Balancer, Web Server, Application Server, and an API / Web Framework.
We include cloud services as supporting classes of our Framework layer. AWS services like EC2, SQS, RDS and ElastiCache are supporting classes — NOT “inner” or central layer — because the UI and the database depend on the business rules, but the business rules don’t depend on the UI or database.

To the extent of this template, the following belong to this layer:

- ECS `task-definition.json`:
  - [Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-definition-template.html)
  - [What is a Task Definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-definition-template.html)
- Dockerfile:
  - [Documentation](https://docs.docker.com/reference/dockerfile/)
  - The Dockerfile uses DSL (Domain Specific Language) and contains instructions for generating a Docker image.
- GitHub Worflows:
  - [Documentation](https://docs.github.com/en/actions/writing-workflows)
  - [About Workflows](https://docs.github.com/en/actions/writing-workflows/about-workflows#about-workflows)
- `swagger.yml`:
  - [Documentation](https://swagger.io/docs/specification/v3_0/basic-structure/)
