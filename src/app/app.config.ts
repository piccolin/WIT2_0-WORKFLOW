import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

import {PRESIGN_FUNCTION_URL, SAVE_UPLOAD_RECORD_URL } from "@app/app.config.token";



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
   provideHttpClient(withInterceptorsFromDi()),

    // Lambda function URL
    { provide: PRESIGN_FUNCTION_URL, useValue: 'https://cvba3e5zcec2cxdorqsbppisga0rxlbi.lambda-url.us-east-2.on.aws/' },

    { provide: SAVE_UPLOAD_RECORD_URL, useValue: 'https://h2f36uvfazwhucb5muoljeclg40ahmgq.lambda-url.us-east-2.on.aws/' }
  ]
};
