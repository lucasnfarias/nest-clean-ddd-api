# Nest Clean DDD API

This API using [NestJS](https://docs.nestjs.com/) framework was developed during Rocketseat Full-stack MBA.

It's a simple Forum-like REST API applying DDD and Clean Architecture concepts. So it has some entities/components such as users, questions, answers, comments, attachments, etc.

# Table of Contents

1. [How to run](#how-to-run)
2. [Concepts](#concepts)

## How to run

- First to setup the `.env`

  - SSH keys:
    - Create a private and public key using ssh and RS-256 algorithm
    - Encode the to base64 and set the values on `.env`
  - Files storage:
    - We used [Cloudflare R2](https://www.cloudflare.com/pt-br/developer-platform/products/r2/) because to it has zero egress fees and it's simple to setup
    - Follow the docs to generate the AWS bucket: https://developers.cloudflare.com/r2/buckets/

- After setting up the `.env`, to start the application:

  - run `npm i` (use node version indicated on .nvmrc)
  - run `docker-compose up -d` to start Postgres (PG) and Redis containers
  - run `npx prisma migrate dev` to run migrations on the PG database
  - run `npm run start:dev` to start the application

- To run tests:
  - For unit tests, run `npm run test`
  - For e2e tests, run `npm run test:e2e` (you need to have pg and redis containers running during e2e tests)

## Concepts

### DDD (Domain Driven Design)

#### Domain

The domain refers to a set of concepts, rules, processes and behaviors that are fundamental to a given business or application. It is the area of ​​knowledge that describes and organizes all the knowledge and understanding necessary to develop software that meets the needs of the business or application.

The domain is the basis of DDD and it is from it that business models are built. It is composed of a set of entities, aggregates, services and events that represent fundamental business concepts. Domain knowledge is essential for developers to understand business needs and build software that meets those needs efficiently and effectively.

Furthermore, DDD emphasizes the importance of clear and constant communication between developers and domain experts (known as domain experts), so that domain knowledge can be shared and incorporated into the software development process.

#### Entities

Entities are domain objects that represent important business concepts. They are responsible for encapsulating the state and behavior related to these concepts, and are fundamental for domain modeling.

An entity is characterized by having a unique and constant identity, which differentiates it from other entities of the same type.

They are important for DDD because they represent the main abstractions of the domain, and their correct modeling helps to ensure that the software accurately reflects the rules and behavior of the business. Furthermore, entities are often the entry point for other system operations, such as validations, calculations and specific business rules.

#### Use cases

Use cases are a technique for describing the functional requirements of a system. They describe a specific interaction between the user and the system, showing what actions the user takes and how the system responds to those actions.

They are an important part of the software development process as they help define system requirements and ensure that it meets the needs of end users.

#### Ubiquitous language

Ubiquitous language is a technique that consists of using a common language, understandable by both developers and domain experts, to describe and understand the concepts and processes of the domain in question.

It is important because it helps align communication between development team members and domain experts. By using a common language, everyone involved in the project can have a shared understanding of key domain terms and concepts, facilitating the development of software that meets business needs.

Additionally, it must be incorporated into the software source code and related documents, such as diagrams and technical documentation, to ensure that everyone involved uses the same terminology. In this way, ubiquitous language helps ensure that the software is built to meet the needs of the business and that everyone involved in the project is on the same page.

#### Aggregates

An aggregate is a set of domain objects that are treated as a cohesive unit. They are used to delimit consistent state change transactions within the domain.

An aggregate has an aggregate root, which is a single entity that is responsible for ensuring the consistency of the aggregate as a whole. The root of the aggregate is the only entity that can be referenced from outside the aggregate. All other entities within the aggregate can only be accessed through the aggregate root.

Their use is one of the main techniques for managing complexity in DDD-based software systems. By defining the aggregate boundaries, you can create a clearer, more focused domain model, with well-defined transactions and responsibilities for each object in the aggregate.

#### Bounded Context

Bounded Context is a technique for defining explicit boundaries around a set of domain models. Each Bounded Context is a logical boundary that separates a specific domain model, with its own rules, terms, and limits, from other domain models within the same system.

A Bounded Context can be viewed as a subdomain or a sector of a larger system, where interactions between domain objects are highly related. Within a Bounded Context, business rules may be different and may have entity or concept names with different meanings in other contexts.

This technique helps avoid confusion between different business concepts, avoids code duplication and reduces system complexity. Each Bounded Context can have its own architecture, design patterns and technologies, allowing the development team to choose the most appropriate tools to deal with the specifics of the context.

Furthermore, DDD encourages clear communication and collaboration between different Bounded Contexts, through well-defined integrations and clear agreements on how domain objects will be shared between contexts.

Establishing Bounded Contexts is an important part of modeling a DDD-based system and must be conducted in close collaboration between the development team and domain experts to ensure that context boundaries are well defined and understood.

#### Value Objects

A Value Object is a class that represents a value that is important to the domain, but that has no identity of its own. In other words, a Value Object is an object that is defined by its attributes, rather than being defined by a unique identity.

For example, in an online shopping system, an Address can be modeled as a Value Object, as it is not important to maintain a unique identifier for each address, but rather its attributes, such as street, number, neighborhood, city, state and zip code. . From a business point of view, the address is just information that needs to be stored and consulted, and is not an entity that needs to be tracked or managed.

However, it is important to remember that not all objects without identity are necessarily Value Objects. The decision to model an object as a Value Object depends on the domain context and the analysis of business experts and the development team.

#### Domain events

A domain event is an asynchronous notification that indicates that something important has happened in the system domain. It represents an event that occurred within the system that may be interesting to other parts of the system and can be used to make decisions or generate new actions.

For example, in an e-commerce system, a domain event may be generated when a new purchase is made successfully. This event may contain information such as the purchase identifier, the total amount, the delivery address, among other information relevant to the domain.

Domain events are important because they allow different parts of the system to be notified and updated when important changes occur in the domain. They also allow the system to be designed in a more modular and scalable way, as different parts of the system can be designed to react to different types of events independently.

#### Subdomínios

It helps to categorize the domain parts of the application and understand which are most relevant and priorities.

- **Core:** in simple words, it's what makes money $$$. Exemples for e-commerce:
  - Order, Catalog, Payment
- **Supporting:** gives support to core. Exemples for e-commerce:
  - Stock
- **Generic:** são extras e trazem valor a aplicação/serviço/produto are extras that bring value to the application/service/product. Exemples for e-commerce:
  - Notifications, Promotions, Chat

### Clean Architecture

Focus on decoupling!

![image](.github/assets/clean-architecure-schema.png)

### Refs

- https://www.domainlanguage.com/ddd/blue-book/
- https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
