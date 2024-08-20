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
npx nx generate @nx/js:library @owl-app/crud-nestjs --directory=packages/crud/nestjs --publishable --importPath=@owl-app/crud-nestjs
```

Gnerate lib
```
npx nx g @nx/nest:library --directory=libs/api/building-blocks --buildable=true
```

Build
```
npx nx build @owl-app/crud-nestjs --skip-nx-cache
```

APP:
```
yarn nx g @nx/vue:lib @owl-app/lib-app-module-rbac --directory=libs/app/modules/rbac
```