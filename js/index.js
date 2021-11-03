import { VctrApi } from 'https://www.vectary.com/viewer-api/v1/api.js';

const viewerApi = new VctrApi('52f7eb92-d707-4c91-bc24-909d653c0ff1');

const allSceneMeshes = viewerApi.getMeshes();
console.log('Meshes', allSceneMeshes);

async function run() {
  await viewerApi.init();
  console.log(await viewerApi.getObjects());
}

run();
