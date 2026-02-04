/**
 * @Filename:    amplify-bootstrap.ts
 * @Type:        Bootstrap Helper
 * @Date:        2026-01-27
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   Ensures Amplify.configure(outputs) runs exactly once before any Data client is generated.
 */

import { Amplify } from 'aws-amplify';
import outputs from '../../../../../../../src/amplify_outputs.json';

let isConfigured = false;

export function configureAmplifyOnce(): void {
  if (isConfigured) return;

  Amplify.configure(outputs);

  isConfigured = true;
}
