const CACHE_NAME = "marinecalc-v7";

const APP_SHELL = [

  // ================================
  // MARINECALC ROOT
  // ================================

  "./",
  "./index.html",
  "./style.css",
  "./manifest.webmanifest",

  // ================================
  // ROOT JAVASCRIPT
  // ================================

  "./pro-access.js",

  // ================================
  // OFFLINE PRO AUTHORIZATION
  // ================================

  "./js/offline-pro.js",

  // ================================
  // ICONS
  // ================================

  "./icons/marinecalc-favicon-32.png",
  "./icons/marinecalc-icon-192.png",
  "./icons/marinecalc-icon-512.png",

  // ================================
  // BUNKER MT CALCULATOR
  // ================================

  "./calculators/bunker-mt/index.html",
  "./calculators/bunker-mt/script.js",
  "./calculators/bunker-mt/style.css",

  // ================================
  // NOON CALCULATION
  // ================================

  "./calculators/noon-calculation/index.html",
  "./calculators/noon-calculation/script.js",
  "./calculators/noon-calculation/style.css"

];


/* =====================================================
   INSTALL
   ===================================================== */

self.addEventListener("install", (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME).then(async (cache) => {

      /*
         Cache each file individually.

         This prevents ONE missing file from
         breaking the entire installation.
      */

      for (const url of APP_SHELL) {

        try {

          await cache.add(url);

          console.log(
            "MarineCalc cached:",
            url
          );

        } catch (error) {

          console.warn(
            "MarineCalc could not cache:",
            url,
            error
          );

        }

      }

    })

  );

  self.skipWaiting();

});


/* =====================================================
   ACTIVATE
   ===================================================== */

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))

      );

    }).then(() => {

      return self.clients.claim();

    })

  );

});


/* =====================================================
   FETCH
   ===================================================== */

self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") {
    return;
  }


  /*
     Only handle normal HTTP/HTTPS requests.
  */

  const requestUrl =
    new URL(event.request.url);


  if (
    requestUrl.protocol !== "http:" &&
    requestUrl.protocol !== "https:"
  ) {

    return;

  }


  event.respondWith(

    caches.match(event.request).then((cached) => {

      /*
         Cached MarineCalc resource:
         return it immediately.
      */

      if (cached) {

        return cached;

      }


      /*
         Resource is not cached.
         Try the network.
      */

      return fetch(event.request).then((response) => {

        /*
           Cache successful responses.
        */

        if (
          response &&
          response.ok
        ) {

          const copy =
            response.clone();


          caches.open(CACHE_NAME).then((cache) => {

            cache.put(
              event.request,
              copy
            ).catch((error) => {

              console.warn(
                "MarineCalc cache put skipped:",
                error
              );

            });

          });

        }


        return response;

      }).catch(() => {

        /*
           Offline page fallback.
        */

        if (
          event.request.mode === "navigate"
        ) {

          /*
             First try the exact requested page.
          */

          return caches.match(
            event.request
          ).then((exactPage) => {

            if (exactPage) {
              return exactPage;
            }


            /*
               If exact page isn't cached,
               fall back to MarineCalc home.
            */

            return caches.match(
              "./index.html"
            );

          });

        }


        throw new Error(
          "MarineCalc resource unavailable offline."
        );

      });

    })

  );

});