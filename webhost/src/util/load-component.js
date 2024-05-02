import { getLoadRemoteContainer } from './get-load-remote-contaier';

window.__repack__ = {
  loadChunkCallback: [],
  loadChunk: async (
    url,
    cb,
    chunkName,
    chunkId,
    parentChunkId
  ) => {
    console.log(
      `Attempting to load chunk with name: ${chunkName}, id: ${chunkId}, parent id: ${parentChunkId}`
    ); // Log the start of chunk loading
    if (chunkName !== undefined && chunkId !== undefined) {
      console.log(`Chunk name and id are defined, proceeding with loading`); // Log the conditions checked
      // Load webpack chunk
      try {
        console.log(`Loading chunk with url: ${url}`); // Log the URL used for loading
        await getLoadRemoteContainer(
          `${parentChunkId}@${chunkId}`,
          'default',
          url
        );
        console.log(`Chunk loaded successfully`); // Log successful loading
      } catch (error) {
        console.error(`Error loading chunk: ${error}`); // Log any errors encountered
        cb(error);
      }
    } else {
      console.log(`Chunk name or id is undefined, skipping loading`); // Log the condition where loading is skipped
    }
  },
};

export const loadComponent = (
  remote,
  sharedScope,
  module,
  url
) => {
  return async () => {
    console.log(`Loading remote component: ${remote}`); // Log the start of loading
    await getLoadRemoteContainer(remote, sharedScope, url);
    const container = window[remote];
    console.log(`Container for ${remote} loaded:`, container); // Log the loaded container
    const factory = await container.get(module);
    console.log(`Factory for module ${module} obtained:`, factory); // Log the obtained factory
    const Module = factory();
    console.log(`Module ${module} instantiated:`, Module); // Log the instantiated module
    return Module;
  };
};
