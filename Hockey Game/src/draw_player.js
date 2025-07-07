import { playerPositions, oppositionPositions } from './player_positions.js';
import { pitchToScreen, screenToPitch } from './pitch_utils.js';
import { HOME_TEAM_STYLE, AWAY_TEAM_STYLE } from './team_styles.js';

export function drawPlayers(scene) {
  const homePlayers = drawHomeTeam(scene, playerPositions, HOME_TEAM_STYLE.fill, HOME_TEAM_STYLE.stroke);
  const awayPlayers = drawAwayTeam(scene, oppositionPositions, AWAY_TEAM_STYLE.fill, AWAY_TEAM_STYLE.stroke);

  // Shared drag logic for all players
  scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;

    const allPlayers = [...homePlayers, ...awayPlayers];
    const draggedPlayer = allPlayers.find(p => p.container === gameObject);
    if (draggedPlayer) draggedPlayer.updateCoords();
  });

  return { homePlayers, awayPlayers };
}

// HOME TEAM
function drawHomeTeam(scene, positions, fillColor, strokeColor) {
  const players = [];
  const radius = 10;
  const strokeWidth = 2;

  Object.entries(positions).forEach(([posName, pos]) => {
    const screen = pitchToScreen(pos.x, pos.y, scene);
    const container = scene.add.container(screen.x, screen.y).setDepth(2);

    // Circle
    const circle = scene.add.circle(0, 0, radius, fillColor);
    circle.setStrokeStyle(strokeWidth, strokeColor);

    // Text label inside
    const label = scene.add.text(0, 0, posName, {
      fontSize: '10px',
      fontFamily: 'Arial',
      color: strokeColor === 0x000000 ? '#000000' : '#ffffff'
    }).setOrigin(0.5);

    // Coordinates
    const coordText = scene.add.text(0, 18, '', {
      fontSize: '10px',
      fontFamily: 'Arial',
      color: '#444444'
    }).setOrigin(0.5);

    const updateCoords = () => {
      const pitchCoords = screenToPitch(container.x, container.y, scene);
      coordText.setText(`${pitchCoords.x.toFixed(1)}, ${pitchCoords.y.toFixed(1)}`);
    };
    updateCoords();

    container.add([circle, label, coordText]);
    container.setSize(28, 36).setInteractive({ useHandCursor: true });
    scene.input.setDraggable(container);

    container.setData('type', 'player');
    container.setData('position', posName);

    players.push({ container, position: posName, updateCoords, startX: screen.x, startY: screen.y });
  });

  return players;
}

// AWAY TEAM
function drawAwayTeam(scene, positions, fillColor, strokeColor) {
  const players = [];
  const radius = 10;
  const strokeWidth = 2;

  Object.entries(positions).forEach(([posName, pos]) => {
    const screen = pitchToScreen(pos.x, pos.y, scene);
    const container = scene.add.container(screen.x, screen.y).setDepth(2);

    // Circle
    const circle = scene.add.circle(0, 0, radius, fillColor);
    circle.setStrokeStyle(strokeWidth, strokeColor);

    // Text label inside
    const label = scene.add.text(0, 0, posName, {
      fontSize: '10px',
      fontFamily: 'Arial',
      color: strokeColor === 0x000000 ? '#000000' : '#ffffff'
    }).setOrigin(0.5);

    // Coordinates
    const coordText = scene.add.text(0, 18, '', {
      fontSize: '10px',
      fontFamily: 'Arial',
      color: '#444444'
    }).setOrigin(0.5);

    const updateCoords = () => {
      const pitchCoords = screenToPitch(container.x, container.y, scene);
      coordText.setText(`${pitchCoords.x.toFixed(1)}, ${pitchCoords.y.toFixed(1)}`);
    };
    updateCoords();

    container.add([circle, label, coordText]);
    container.setSize(28, 36).setInteractive({ useHandCursor: true });
    scene.input.setDraggable(container);

    container.setData('type', 'player');
    container.setData('position', posName);

    players.push({ container, updateCoords, startX: screen.x, startY: screen.y });
  });

  return players;
}
