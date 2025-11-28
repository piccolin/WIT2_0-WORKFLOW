import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

// -----------------------------------------------------------------
// Amplify v6 Config (in main.ts)
// -----------------------------------------------------------------
import { Amplify } from 'aws-amplify';
import amplifyOutputs from './amplify_outputs.json'; // From Amplify CLI: npx ampx generate graphql-client-code

//console.log('🔧 Amplify Config Loaded:', amplifyOutputs?.auth ? '✅ Auth section found' : '❌ Missing auth config!');  // Debug: Check if auth is there
Amplify.configure(amplifyOutputs); // Loads API endpoints, auth, credentials (e.g., API_KEY, Cognito)

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
