import type { CodegenConfig } from '@graphql-codegen/cli';
 
const config: CodegenConfig = {

  schema: 'http://localhost:8084/graphql',
  generates: {
    './src/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-vue-apollo-smart-ops'],
    }
  }

};
 export default config;