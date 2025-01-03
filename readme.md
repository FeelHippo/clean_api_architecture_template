# Clean API Architecture

It aspires to produce a separation of concerns by subdividing a project into layers.
Each layer abides by the Single Responsibility Principle, ensuring each class is only handling one part of the process, and is more easily and thoroughly unit tested.

We define the following layers:

- Frameworks and Cloud
- Interface Adapters
- Application Logic
- Entity Logic
- Data

None of the layers have visibility into higher layers. They may have references to their child layer, but definitely not their grandchildren.

![Clean Architecture](https://miro.medium.com/v2/resize:fit:700/1*yTDpfIqqAdeKRhbHwfhrYQ.png)

## Frameworks and Cloud

Any endpoint request must be routed to the appropriate code path through a Load Balancer, Web Server, Application Server, and an API / Web Framework.
Cloud services are included as supporting classes for the Framework layer. AWS services like EC2, SQS, RDS and ElastiCache are supporting classes — NOT “inner” or central layer — because the UI and the database depend on the business rules, but the business rules don’t depend on the UI or database.

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
- SQS:
  - [Documentation](https://docs.aws.amazon.com/sqs/)
- ExpressJs Server:
  - [Documentation](https://expressjs.com/)
  - Why not use [express-openapi-validator](https://www.npmjs.com/package/express-openapi-validator)?
    - Open API Validator uses middleware at the ExpressJs framework level to [validate requests and responses](https://github.com/FeelHippo/apis_comparison/blob/b547a1f28f082471f4b30fc99b476929c6e32260/Express/src/app.ts#L19)
    - Validation is performed against a single Open API Description which is also part of the framework and independent of the "Interface" and "Application" layers
  - Why use [express-openapi](https://github.com/kogosoftwarellc/open-api/tree/main/packages/express-openapi)?
    - On the one hand, it allows to define routes without implementing Express' Router
    - An "operation" refers to an "operationId" defined in the OpenAPI definition yml, including its RESTful method, route, and parameters
    - Each "operation" accepts a list of middleware, which allows to extend the native Request and Response objects with their respective validators
    - Validators can then be used at the "Controller" level, see below

Swagger UI can be accessed [here](http://localhost:3000/api-docs/) once the app is running locally.

## Interface Adapters

Controllers orchestrate the processing of the endpoint by invoking a Request object to extract each parameter, validate its syntax, and authenticate the user making the request.
Controllers instantiate our classes and move data between classes in the Application Logic Layer.

Controllers depend on classes including

- Validators: check the syntax of incoming data. See note above regarding "express-openapi",
- Presenters, which format outgoing data. This template does not provide an example of that,
- Response objects, which map objects and/or hashes into JSON, HAML and other formats. This template takes advantage of "express-openapi"s:
  - validateRequest: this is not provided out of the box, hence the use of [this](https://github.com/kogosoftwarellc/open-api/tree/main/packages/openapi-request-validator) additional package
  - validateResponse: this method is attached to both request and response objects by "express-openapi" out of the box.
- Socket relay classes communicate state changes to the client over a socket communication channel, such as Websockets. Not implemented in this template.

## Application Logic

GET requests made to read endpoints are next passed to the Application Logic layer where a Service ensures the validity of the inputs, makes sure the user is authorized to access data, and then retrieves data from the Entity Logic Layer through a Repo (for databases) and/or Adapter (for APIs).

POST, DELETE and PUT requests made to write endpoints do the same thing as read endpoints, but defer processing by enqueuing Service inputs through our queue — Amazon SQS — and write the data to the Entity Logic Layer through a Job or Service.

This template relies on [Mongoose](https://mongoosejs.com/) to guarantee user authentication, ideally via authenticated URIs to Mongo Atlas, and data validity, thanks to the data schema.
Adapters did not come in handy to the extent of this exercise.

## Entity Logic

Entity logic refers to components that are common not only to this endpoint, but others as well. Repositoryclasses, which provide access to persistent stores like Mysql or Postgres databases, and Adapter classes, which provide us access to APIs, including AWS storage apis like S3, ElastiCache and others. We expect classes in this layer to be used over and over again; classes in the layer above are often single-purpose to an endpoint.

## Data Layer

This is ideally a very simple layer that provides an actual interface into our different storage systems.

## References:

- [Clean API Architecture, The pattern you need — or probably had but didn’t realize, by Eric Silverberg](https://medium.com/perry-street-software-engineering/clean-api-architecture-2b57074084d5)
- [node.js-clean-architecture, A use case of Clean Architecture in Node.js comprising of Express.js, MongoDB and Redis as the main (but replaceable) infrastructure.](https://github.com/panagiop/node.js-clean-architecture)

## Notes

Before you run this app, make sure mongod is running:
- from a terminal, run `~ % mongod --dbpath ~/srv/mongodb/`
- from MongoDB Compass, connect to `localhost:27017`
- in MongoDB, create a new database and collection called both `something`
- make sure the api client is including the `api-key` header
- example GET request

```curl
curl --location 'localhost:3000/v1/get-something/6777ece700ccedd69ec6faa8' \
--header 'api-key: test'
```