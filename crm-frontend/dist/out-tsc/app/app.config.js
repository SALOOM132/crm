import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
export const appConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient()
    ]
};
//# sourceMappingURL=app.config.js.map