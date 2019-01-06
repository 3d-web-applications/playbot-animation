const { prototype } = pc.createScript('keyboardInput');

prototype.initialize = function () {
  this.orbitCamera = this.entity.script.orbitCamera;
};

prototype.postInitialize = function () {
  if (this.orbitCamera) {
    this.startDistance = this.orbitCamera.distance;
    this.startYaw = this.orbitCamera.yaw;
    this.startPitch = this.orbitCamera.pitch;
    this.startPivotPosition = this.orbitCamera.pivotPoint.clone();
  }
};

prototype.update = function (/* dt */) {
  if (this.orbitCamera) {
    if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
      this.orbitCamera.reset(
        this.startYaw, this.startPitch, this.startDistance,
      );
      this.orbitCamera.pivotPoint = this.startPivotPosition;
    }
  }
};
