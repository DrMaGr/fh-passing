import { pitchToScreen, screenToPitch } from './pitch_utils.js';

export function drawBall(scene) {
  const BALL_RADIUS = 3;
  const INITIAL_POSITION = { x: 45.6, y: 27.8 }; // In meters

  const screenPos = pitchToScreen(INITIAL_POSITION.x, INITIAL_POSITION.y, scene);

  const container = scene.add.container(screenPos.x, screenPos.y);
  container.setDepth(2); // Draw over lines but under players if needed

  const ball = scene.add.circle(0, 0, BALL_RADIUS, 0xffff00); // Yellow ball
  container.add(ball);

  // Optional: display coordinates under ball
  const coordText = scene.add.text(0, 6, '', {
    fontSize: '10px',
    fontFamily: 'Arial',
    color: '#444444'
  }).setOrigin(0.5);
  container.add(coordText);

  const updateCoords = () => {
    const pitchCoords = screenToPitch(container.x, container.y, scene);
    coordText.setText(`${pitchCoords.x.toFixed(1)}, ${pitchCoords.y.toFixed(1)}`);
  };

  updateCoords();

  container.setSize(BALL_RADIUS * 2, BALL_RADIUS * 2);
  container.setInteractive({ useHandCursor: true });
  scene.input.setDraggable(container);

  container.setData('type', 'ball');

  return {
    container,
    updateCoords,
    startX: screenPos.x,
    startY: screenPos.y
  };
}
