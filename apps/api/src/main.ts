import { bootstrap } from './bootstrap';

import { BootstrapModule } from './app/bootstrap.module';

bootstrap(BootstrapModule)
  .catch((error) => {
    console.log(error);
    process.exit(1);
});
