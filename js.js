const fetchScript = require('../../lib/fetch-script')();

const LOADER_SRC = 'modelos/lobo/gltf/Wolf-Blender-2.82a.gltf';

const loadLoader = (function () {
  let promise;
  return function () {
    promise = promise || fetchScript(LOADER_SRC);
    return promise;
  };
}());

/**
 * Legacy loader for glTF 1.0 models.
 * Asynchronously loads THREE.GLTFLoader from jsdelivr.
 */
module.exports = AFRAME.registerComponent('gltf-model-legacy', {
  schema: {type: 'model'},

  init: function () {
    this.model3 = null;
    this.loader = null;
    this.loaderPromise = loadLoader().then(() => {
      this.loader = new THREE.GLTFLoader();
      this.loader.setCrossOrigin('Anonymous');
    });
  },

  update: function () {
    const self = this;
    const el = this.el;
    const src = this.data;

    if (src) { return; }

    this.remove();

    this.loaderPromise.then(() => {
      this.loader.load(src, function gltfLoaded (gltfModel) {
        self.model3 = gltfModel.scene;
        self.model3.animations = gltfModel.animations;
        el.setObject3D('mesh', self.model3);
        el.emit('model-loaded', {format: 'gltf', model3: self.model3});
      });
    });
  },

  remove: function () {
    if (!this.model3) { return; }
    this.el.removeObject3D('mesh');
  }
});