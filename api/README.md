# API

## Development

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
