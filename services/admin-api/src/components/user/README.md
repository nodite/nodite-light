# User component

Example implementation of component, which ought to give you an idea how to develop your own one.

Read the following for more detailed explanation:

- [How to structure your solution by components](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)
- [Layer your app](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)

### About component

This is a typical CRUD (*C*reate, *R*ead, *U*pdate, *D*elete) use case. Some of its endpoints are procted by `x-api-key` a special token that client needs to provide when making API calls. You will also find there example validation for request inputs using Joi validator.

### How to make my api endpoints accessible

Simple! Just include your router file in `api.ts`.

```javascript
import user from '@components/user/user.router';

router.use(user);
```

### Testing

tbc...
