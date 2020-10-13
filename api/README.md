# API

## Development

### Installation and usage

Development of the API is run through docker. The docker compose file at the project root will run the API as well as all required services.

- Run migrations:

  `docker-compose run api knex migrate:latest`

- Run tests:

  `docker-compose -f docker-compose.test.yml run test_api jest --watchAll`

- Clear all volumes (database, etc):

  `docker-compose down -v`

- Rebuild images:

  `docker-compose build`

- Run server:

  `docker-compose up`

### Authenticating through graphql playground for testing

When Keycloak isn't configured and the API isn't in production, the bearer token can be replaced with a JSON encoded string containing user data.

#### Example:

```js
// User auth object:
{
  id: '<random valid uuid>',
  roles: ['USER'], // optionally add ADMIN
  preferred_username: 'blabla@example.com',
}

// Encoded and put in GraphQL Playground:
{
  "Authorization": "Bearer {\"id\":\"aec061ab-eebf-4bc9-9029-961e27368a1c\",\"roles\":[\"USER\"],\"preferred_username\":\"coolguy@gmail.com\"}"
}
```
