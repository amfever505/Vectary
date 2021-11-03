import { VctrApi } from 'https://www.vectary.com/viewer-api/v1/api.js';

const viewerApi = new VctrApi('52f7eb92-d707-4c91-bc24-909d653c0ff1');

const allSceneMeshes = viewerApi.getMeshes();
console.log('Meshes', allSceneMeshes);

async function run() {
  console.log('Example script running..');

  function errHandler(err) {
    console.log('API error', err);
  }

  async function onReady() {
    console.log('API ready..');

    console.log(await viewerApi.getObjects());

    const allMaterials = await viewerApi.getMaterials();
    const allMeshes = await viewerApi.getMeshes();
    addOptionsToSelector(
      allMaterials.map((mat) => mat.name),
      materialSelector
    );
    addOptionsToSelector(
      allMeshes.map((mesh) => mesh.name),
      meshSelector
    );
  }

  viewerApi = new VctrApi('0feb5eb2-c1fb-4644-850d-46c1bb55e548', errHandler);
  try {
    await viewerApi.init();
  } catch (e) {
    errHandler(e);
  }

  addListeners();
  onReady();
}

run();
