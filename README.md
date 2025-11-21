Architecture Overview

This project uses a microservices-inspired architecture with Kafka as the messaging backbone to handle asynchronous communication.

Kafka & Zookeeper: Used for reliable message brokering between services. Topics allow decoupled communication and scalability.

Node.js Backend: Handles API requests, produces events to Kafka, and consumes messages from Kafka to process business logic.

Dockerized Services: All components (Kafka, Zookeeper, Node.js) run in Docker containers for consistent environments and easy deployment.

Database Layer (MySQL/PostgreSQL): Stores persistent data. Services interact via a clean separation of concerns, ensuring modularity and maintainability.

Choices Rationale:

Kafka ensures scalability and reliability for event-driven workflows.

Docker simplifies local development and deployment across environments.

Node.js provides fast I/O handling for real-time messaging and API responsiveness.

Microservice patterns (Producer/Consumer) decouple services, making the system easier to extend and maintain.
