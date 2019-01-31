// import { MAX_POOL_SIZE } from './constants';

const createEntityPool = (prefab) => {
  const _free = [];
  const _prefab = prefab;

  /*let clone;
  for (let counter = 0; counter < MAX_POOL_SIZE; counter += 1) {
    clone = prefab.clone();
    prefab.parent.addChild(clone);
    free.push(clone);
  }*/

  const expand = (count) => {
    for (let index = 0; index < count; index += 1) {
      _free.push(_prefab.clone());
    }
  };

  const size = () => _free.length;

  return {
    acquire: () => {
      if (_free.length <= 0) {
        // throw new Error('No free objects left');
        expand(10);
      }
      const next = _free.pop();
      // next.enabled = true;
      return next;
    },
    release: (entity) => {
      // entity.enabled = false;
      _free.push(entity);
    },
    expand,
    size,
  };
};

export { createEntityPool };
