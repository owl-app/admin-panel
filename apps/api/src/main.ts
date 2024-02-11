import { bootstrap } from '@owl/server-core';

import { BootstrapModule } from './bootstrap';

bootstrap(BootstrapModule)
  .catch((error) => {
    console.log(error);
    process.exit(1);
});
