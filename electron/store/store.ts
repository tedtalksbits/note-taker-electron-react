import Store from 'electron-store';
// create a store for notes taking

const store = new Store({
  schema: {
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', minLength: 1, maxLength: 100 },
          title: { type: 'string', minLength: 1, maxLength: 100 },
          content: { type: 'string', minLength: 1, maxLength: 1000 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['title', 'content', 'createdAt', 'updatedAt'],
      },
    },
  },
});

export function init() {
  return store;
}
