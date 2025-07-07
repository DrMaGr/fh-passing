export const SCALE = 14;
export const PITCH_WIDTH_M = 91.4;
export const PITCH_HEIGHT_M = 55;

export const PITCH_WIDTH_PX = PITCH_WIDTH_M * SCALE;
export const PITCH_HEIGHT_PX = PITCH_HEIGHT_M * SCALE;

export function getPitchOffset(scene) {
  return {
    x: (scene.scale.width - PITCH_WIDTH_PX) / 2,
    y: (scene.scale.height - PITCH_HEIGHT_PX) / 2
  };
}

export function screenToPitch(screenX, screenY, scene) {
  const offset = getPitchOffset(scene);
  const xMeters = (screenX - offset.x) / SCALE;
  const yMeters = (screenY - offset.y) / SCALE;
  return { x: xMeters, y: yMeters };
}

export function pitchToScreen(xMeters, yMeters, scene) {
  const offset = getPitchOffset(scene);
  return {
    x: offset.x + xMeters * SCALE,
    y: offset.y + yMeters * SCALE
  };
}
