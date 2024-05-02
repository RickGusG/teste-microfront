/**
 * @param remote - the remote global name
 * @param shareScope - the shareScope Object OR scope key
 * @param remoteFallbackUrl - fallback url for remote module
 * @returns Federated Module Container
 */
export const getLoadRemoteContainer = (
  remote,
  shareScope,
  remoteFallbackUrl
) =>
  new Promise((resolve, reject) => {
    console.log(`Checking if remote ${remote} exists on window`); // Log the start of checking
    if (!(remote in window)) {
      console.log(`Remote ${remote} not found on window, searching DOM`); // Log the search in DOM
      const existingRemote = document.querySelector(
        `[data-webpack="${remote}"]`
      );
      const onload = async (ev) => {
        console.log(`Remote ${remote} loaded, checking initialization`); // Log the loaded remote
        if (window[remote] && !window[remote]?.__initialized) {
          console.log(`Remote ${remote} not initialized, initializing now`); // Log the initialization process
          if (typeof __webpack_share_scopes__ === 'undefined') {
            console.log(`Using manual share scope for ${remote}`); // Log the use of manual share scope
            await window[remote].init(shareScope);
          } else {
            console.log(`Using webpack share scopes for ${remote}`); // Log the use of webpack share scopes
            await window[remote].init(
              __webpack_share_scopes__[shareScope]
            );
          }
          window[remote].__initialized = true;
          console.log(`Remote ${remote} initialized`); // Log the initialization complete
        }
        resolve();
      };
      if (existingRemote) {
        console.log(`Remote ${remote} found in DOM, hooking into onload`); // Log the found remote in DOM
        existingRemote.onload = onload;
        existingRemote.onerror = reject;
      } else if (remoteFallbackUrl) {
        console.log(`Injecting remote ${remote} from fallback URL`); // Log the injection from fallback URL
        const d = document,
          script = d.createElement('script');
        script.type = 'text/javascript';
        script.setAttribute('data-webpack', `${remote}`);
        script.async = true;
        script.onerror = reject;
        script.onload = onload;
        script.src = remoteFallbackUrl;
        d.getElementsByTagName('head')[0].appendChild(script);
      } else {
        console.log(`Cannot find remote ${remote} to inject`); // Log the failure to find remote
        reject(`Cannot Find Remote ${remote} to inject`);
      }
    } else {
      console.log(`Remote ${remote} already exists on window, resolving`); // Log the remote already exists
      resolve();
    }
  });
