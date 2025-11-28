// /**
//  *  @name-space     angular.service
//  *  @name           AuthService
//  *  @author         created by Guido A. Piccolino Jr.
//  *  @copyright      05/14/2020
//  *  @description    A service wrapping the Amplify Cognito APIs
//  *  @injected
//  *
//  */
//
// //core
// import {Injectable } from '@angular/core';
//
// // external modules
// import Auth from '@aws-amplify/auth';
// import {ConsoleLogger as Logger} from '@aws-amplify/core';
//
// // --------------
// // Authentication Interfaces to keep service clear & well typed
// // --------------
// export interface NewUser {
//   email: string,
//   phone: string,
//   password: string,
//   firstName: string,
//   lastName: string,
//   birthdate: string,
//   gender: string
// }
//
// const logger = new Logger('AuthClass');
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//
//
//   // --------------
//   // Is User Authenticated
//   // --------------
//
//   public async isUserAuthenticated(): Promise<any> {
//     try {
//       //call out to AWS to get info from AWS Cognito
//       return await Auth.currentAuthenticatedUser()
//     }//end try
//     catch (error){
//       console.log(error)
//       throw error;
//     }//end catch
//   }//end function
// }//end class
//

// import { Injectable } from '@angular/core';
// import * as Auth from '@aws-amplify/auth';
//
// @Injectable({ providedIn: 'root' })
// export class AuthService {
//
//   async isAuthenticated(): Promise<boolean> {
//     try {
//       await Auth.getCurrentUser(); // will throw if not logged in
//       return true;
//     } catch {
//       return false;
//     }
//   }
//
//   async logout(): Promise<void> {
//     try {
//       await Auth.signOut();
//     } catch {}
//   }
// }

import { Injectable } from '@angular/core';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut();
  }
}
