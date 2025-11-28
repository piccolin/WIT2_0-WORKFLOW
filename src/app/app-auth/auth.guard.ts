// /**
//  *  @name-space     angular.router.guard
//  *  @module         auth.module
//  *  @name           AuthGuard
//  *  @author         created by Guido A. Piccolino Jr.
//  *  @copyright      05/14/2020
//  *  @description    An Angular Router Guard used to check an authentication state prior to activating routes requiring authentication.
//  *  @injected
//  *
//  */
//
// import { Injectable } from '@angular/core';
// import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Navigation} from '@angular/router';
// import { Observable } from 'rxjs';
// import {AuthService} from '@app/app-auth/auth.service';
// import {ConfirmDialogService} from "@app/app-building-blocks/confirm-dialog/services/confirm-dialog.service";
// import {LoggingService} from        "@app/app-logging/services/logging.service";
// // state store so when the user logs in can drop them where they were trying to navigate to
// import {AppStateStoreService} from  "@app/app-state/services/app-state-store.service";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor( private _router: Router,
//                private _authService: AuthService,  //
//                private appStateStoreService: AppStateStoreService,
//                private confirmDialogService:ConfirmDialogService,
//                ) { }
//
//   // --------------
//   //  1) Guard to ensure user is authenticated prior to granting access.
//   //  2) Redirect unauthenticated users to signin page
//   // --------------
//   public canActivate(
//     activatedRouteSnapshot: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | any{
//     let url: string = state.url
//     console.log(state);
//     console.log(activatedRouteSnapshot);
//
//     //getting details of where the user is trying to go
//     let uri = this.getURI(activatedRouteSnapshot);
//     let relativePath = this.getRelativePath(url,uri)
//     let paramArray:Array<string> = this.getParams(activatedRouteSnapshot);
//     console.log('\n\nURI:', uri);
//     console.log('\n\nPath:', relativePath);
//     console.log('\n\nParams:', paramArray);
//
//
//     //check server (aws cognito) to see if user is authenticated
//     console.log('%c1) 👮 AuthGuard activated from path request <%s>', LoggingService.LOGGING_GUARDS_ACTIVATED, state.url);
//     return this._authService.isUserAuthenticated()
//       .then(async (result) => {
//         console.log('\t%c 🔑 AuthGuard passed... <%s> allowed => Result: <%s>', LoggingService.LOGGING_GUARDS_PASSED, state.url, result);
//         return true;
//       })
//       .catch((error) => { //not authenticated
//         console.log('\t%c 🔒 AuthGuard failed... <%s> NOT allowed...redirected to <app-auth/signin> or <app-auth/signup> => Error: <%s>', LoggingService.LOGGING_GUARDS_FAILED, state.url, error);
//         this.openDialog('User Account Required',
//           ``,
//           '',
//           '')
//         this.confirmDialogService.confirmed().subscribe(async (confirmed) => {
//           //close button
//           if(confirmed === 'no-action')
//             return false;
//           // sign in button
//           else if (confirmed) {
//             this.confirmDialogService.close(true);
//             this.appStateStoreService.setToRequest("", relativePath, uri, paramArray)
//             // redirect to the login page if the user is not authenticated
//             await this._router.navigate(['dashboard/auth/signin']);
//             //return this._router.parseUrl('dashboard/auth/signin');
//           }
//           //creat account button
//           else {
//             this.confirmDialogService.close(true);
//             this.appStateStoreService.setToRequest("", relativePath, uri, paramArray)
//             await this._router.navigate(['dashboard/auth/signup']);
//             return false;
//           }
//         })
//       });
//   }
//
//   getRelativePath(url, uri){
//     let path = url.split(uri)[0];
//     if(path.charAt(0) === "/")
//       path = path.substr(1);
//     return path.trim();
//   }
//
//   getURI(activatedRouteSnapshot:ActivatedRouteSnapshot){
//     //no params on URI
//     if(!activatedRouteSnapshot.routeConfig.path.includes("/:"))
//       return activatedRouteSnapshot.routeConfig.path;
//     //URI includes params
//     else {
//       let pathWithParams = activatedRouteSnapshot.routeConfig.path;
//       let path = pathWithParams.split("/:")[0];
//       return path.trim();
//     }
//   }
//
//   getParams(activatedRouteSnapshot:ActivatedRouteSnapshot){
//     //no params on URI
//     if(!activatedRouteSnapshot.routeConfig.path.includes("/:"))
//       return [];
//     //URI includes params
//     else {
//       let pathWithParams = activatedRouteSnapshot.routeConfig.path;
//       let pathArray = pathWithParams.split("/:");
//
//       let paramKeysArray = [];
//       for(let i = 0; i < pathArray.length; i++){
//         if(i > 0)
//           paramKeysArray.push(pathArray[i].trim());
//       }
//
//       let paramArray: Array<string> = [];
//       let param = activatedRouteSnapshot.params
//       for(let i = 0; i < paramKeysArray.length; i++){
//           let paramKey = paramKeysArray[i];
//           paramArray.push(param[paramKey].trim());
//       }
//
//       return paramArray;
//     }
//   }
//
//
//   // --------------
//   //  Confirm Dialog - a popup modal
//   // --------------
//   openDialog(title:string, message:string, cancelText:string, confirmText:string) {
//     const options = {
//       title:        title,
//       message:      message,
//       hasCloseIcon: true,
//       isLoginMsg:   true
//     };
//     this.confirmDialogService.open(options);
//   }
// }//end class


// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from './auth.service';
//
// export const authGuard: CanActivateFn = async (_route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//
//   const loggedIn = await authService.isAuthenticated();
//
//   if (loggedIn) return true;
//
//   return router.createUrlTree(['/login'], {
//     queryParams: { returnUrl: state.url } // keep intended URL
//   });
// };

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

export const authGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);

  try {
    await getCurrentUser();
    return true;
  } catch {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
};
