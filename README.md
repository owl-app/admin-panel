# Admin panel

NestJs, Vue.

## Features
- RBAC
- CRUD

## Commands

Publish package

```
npx nx run @owl-app/registry-nestjs:publish --version=0.0.1 --tag=0.0.1
```

Generate package
```
npx nx generate @nx/js:library @owl-app/nestjs-query-core --directory=packages/query/core --publishable --importPath=@owl-app/nestjs-query-core
```

Gnerate lib
```
npx nx g @nx/nest:library --directory=libs/api/building-blocks --buildable=true
```

Build
```
npx nx build @owl-app/nestjs-query-core --skip-nx-cache
```

APP:
```
yarn nx g @nx/vue:lib @owl-app/lib-app-module-rbac --directory=libs/app/modules/rbac
```

PM2
pm2 start npm --name "timetracker" -- run start:build