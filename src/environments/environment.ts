// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  supremeServiceApiUrl: "http://localhost:4000/api/supremeService/",
  facilitatorAdminServiceApiUrl:
    "http://localhost:4002/api/userService/facilitator/admin/",
  facilitatorInternalUserServiceApiUrl:
    "http://localhost:4002/api/userService/facilitator/internalUser/",
  hospitalAdminServiceApiUrl:
    "http://localhost:4002/api/userService/hospital/admin/",
  hospitalInternalUserServiceApiUrl:
    "http://localhost:4002/api/userService/hospital/internalUser/",
  sharedServiceApiUrl: "http://localhost:4002/api/userService/shared/",
  cmsApiUrl: "https://cms.simplifymvt.com/api/",
  secretKeyCrypto: "Sai$$@jkCjle90$@m$$pina943SaiCgjekBjeio$&&y73980@@Ssdsd==",
  socketUrl: "http://localhost:4000/",
  s3Bucket: "https://simplifymvt-dev.s3.ap-south-1.amazonaws.com/",
  cmsS3Bucket: "https://cms-simplifymvt.s3.ap-south-1.amazonaws.com/",
  vapidPublicKey:
    "BDOz2OOKKnlveffA2ZBZAlAxRTR8uPNwR-QRsPfnmOLU3e8s2y0jk91MG8WpLySn77aoE15E5vL9WmF5uDNXAks",
  stringSimilarityPercentage: 75,
  periscopeBaseUrl: "https://api.periskope.app/v1",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
