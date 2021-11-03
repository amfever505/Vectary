import { VctrApi } from 'https://www.vectary.com/viewer-api/v1/api.js';

const viewerApi = new VctrApi('52f7eb92-d707-4c91-bc24-909d653c0ff1');

let vctrApi;
const materialSelector = document.getElementById('select_material');
const meshSelector = document.getElementById('select_mesh');
const colorSelector = document.getElementById('select_color');
const applySelectionBtn = document.getElementById('apply_selections');
const propertiesBtn = document.getElementById('properties');
const textureInputElem = document.getElementById('texture-input');

const preloaderElem = document.getElementById('preloader-demo');
const applyTextureBtn = document.getElementById('texture-apply');

const rootDocument = !!document.getElementsByTagName('iframe').length
  ? document.getElementsByTagName('iframe')[0].contentWindow.document
  : document;

function showLoader() {
  preloaderElem.style.display = 'initial';
}

function hideLoader() {
  preloaderElem.style.display = 'none';
}

function addListeners() {
  rootDocument.addEventListener('click', async (_event) => {
    const objectsHit = await vctrApi.getHitObjects();
    if (objectsHit.length) {
      selectByName(meshSelector, objectsHit[0].name);
      selectByName(materialSelector, objectsHit[0].material);
    }
  });

  meshSelector.addEventListener('change', async (_event) => {
    const selectedMesh = await vctrApi.getMeshByName(meshSelector.value);
    if (selectedMesh) {
      selectByName(materialSelector, selectedMesh.material);
    }
  });

  applySelectionBtn.addEventListener('click', async (_event) => {
    console.log(`Applying ${materialSelector.value} material onto ${meshSelector.value}`);
    const changeMaterialSuccess = await vctrApi.setMaterial(meshSelector.value, materialSelector.value);
    console.log(`Material change success: ${changeMaterialSuccess}`);

    if (colorSelector.value !== 'no-change') {
      const colorChangeResult = await vctrApi.updateMaterial(materialSelector.value, { color: colorSelector.value });

      console.log('Color change success:', colorChangeResult);
    }
  });

  propertiesBtn.addEventListener('click', async (_event) => {
    console.log(`Applying ${materialSelector.value} material onto ${meshSelector.value}`);
    const props = await vctrApi.getMaterialProperties(materialSelector.value);
    console.log(`Properties of ${materialSelector.value}: `, props);
  });

  applyTextureBtn.addEventListener('click', async (_event) => {
    if (!textureInputElem.value) {
      return;
    }

    console.log(`Applying ${textureInputElem.value} texture onto ${meshSelector.value}`);

    showLoader();

    await vctrApi.updateMaterial(materialSelector.value, { map: textureInputElem.value });

    hideLoader();
  });
}

function addOptionsToSelector(names, htmlSelectElem) {
  names.forEach((name) => {
    const newOption = document.createElement('option');
    newOption.value = name;
    newOption.innerText = name;

    htmlSelectElem.appendChild(newOption);
  });
}

function selectByName(htmlSelectElem, value) {
  const options = htmlSelectElem.getElementsByTagName('option');
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      options[i].selected = true;
    }
  }
}

async function run() {
  console.log('Example script running..');

  function errHandler(err) {
    console.log('API error', err);
  }

  async function onReady() {
    console.log('API ready..');

    console.log(await vctrApi.getObjects());

    const allMaterials = await vctrApi.getMaterials();
    const allMeshes = await vctrApi.getMeshes();
    addOptionsToSelector(
      allMaterials.map((mat) => mat.name),
      materialSelector
    );
    addOptionsToSelector(
      allMeshes.map((mesh) => mesh.name),
      meshSelector
    );
  }

  vctrApi = new VctrApi('52f7eb92-d707-4c91-bc24-909d653c0ff1', errHandler);
  try {
    await vctrApi.init();
  } catch (e) {
    errHandler(e);
  }

  addListeners();
  onReady();
}

run();
