import app from './src/app';
import { env } from './src/configs/env';

app.listen(env.PORT, () => {
  console.log(`servidor corriendo en puerto ${env.PORT}`);
});
