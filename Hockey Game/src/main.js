import { GAME_CONFIG } from './config.js';
import { drawPitch } from './draw_pitch.js';
import { drawPlayers } from './draw_player.js';
import { drawBall } from './draw_ball.js';
import { screenToPitch, pitchToScreen } from './pitch_utils.js';
import { HOME_TEAM_STYLE, AWAY_TEAM_STYLE } from './team_styles.js';
import { PassingLineManager } from './draw_passing_lines.js';
import { PositionOverlayManager } from './position_overlays.js';

let coordText;
let gameBall;
let possession = null;
let homePlayers = [];
let awayPlayers = [];
let lineManager;
let overlayManager;
let maxPassDistance = 40;
let tackleZoneDistance = 3;
let linesVisible = true;
let overlayActive = false;

function create() {
  const graphics = this.add.graphics();
  drawPitch(this, graphics);

  const { homePlayers: home, awayPlayers: away } = drawPlayers(this);
  homePlayers = home;
  awayPlayers = away;

  lineManager = new PassingLineManager(this);
  lineManager.setMaxDistance(maxPassDistance);
  lineManager.setTackleDistance(tackleZoneDistance);
  lineManager.setOppositionPlayers(awayPlayers);

  overlayManager = new PositionOverlayManager(this);

  gameBall = drawBall(this, 45.6, 27.8);

  coordText = this.add.text(10, 10, '', {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#000000'
  });

  this.input.on('pointermove', (pointer) => {
    const pitchCoords = screenToPitch(pointer.x, pointer.y, this);
    coordText.setText(`X: ${pitchCoords.x.toFixed(1)} m, Y: ${pitchCoords.y.toFixed(1)} m`);
  });

  const resetBtn = this.add.text(20, 40, 'Reset All', {
    fontSize: '16px',
    fontFamily: 'Arial',
    backgroundColor: '#dddddd',
    color: '#000000',
    padding: { x: 10, y: 5 }
  }).setInteractive({ useHandCursor: true });

  resetBtn.on('pointerdown', () => {
    [...homePlayers, ...awayPlayers].forEach(p => {
      p.container.x = p.startX;
      p.container.y = p.startY;
      p.updateCoords();
    });
    gameBall.container.x = gameBall.startX;
    gameBall.container.y = gameBall.startY;
    gameBall.updateCoords();
    lineManager.updateLines();
  });

  function createTeamButton(label, x, y, fillColor, strokeColor, teamKey) {
    const container = this.add.container(x, y);
    const rect = this.add.rectangle(0, 0, 120, 30, fillColor).setStrokeStyle(2, strokeColor).setOrigin(0.5);
    const text = this.add.text(0, 0, label, {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: strokeColor === 0x000000 ? '#000000' : '#ffffff'
    }).setOrigin(0.5).setY(-2);

    container.add([rect, text]);
    container.setSize(120, 30);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerdown', () => {
      possession = teamKey;
      lineManager.setActivePlayers(teamKey === 'home' ? homePlayers : awayPlayers);
      lineManager.setOppositionPlayers(teamKey === 'home' ? awayPlayers : homePlayers);
      lineManager.updateLines();
    });

    return container;
  }

  createTeamButton.call(this, 'Home Team', 90, 80, HOME_TEAM_STYLE.fill, HOME_TEAM_STYLE.stroke, 'home');
  createTeamButton.call(this, 'Away Team', 90, 120, AWAY_TEAM_STYLE.fill, AWAY_TEAM_STYLE.stroke, 'away');

  // Toggle Passing Lines
  const toggleLinesBtn = this.add.text(20, 300, 'Passing Lines: ON', {
    fontSize: '16px',
    fontFamily: 'Arial',
    backgroundColor: '#88ff88',
    color: '#000000',
    padding: { x: 10, y: 5 }
  }).setInteractive({ useHandCursor: true });

  toggleLinesBtn.on('pointerdown', () => {
    linesVisible = !linesVisible;
    lineManager.toggleVisibility();
    toggleLinesBtn.setText(linesVisible ? 'Passing Lines: ON' : 'Passing Lines: OFF');
    toggleLinesBtn.setBackgroundColor(linesVisible ? '#88ff88' : '#dddddd');
  });

  // Randomise Ball
  const randomBallBtn = this.add.text(20, 340, 'Randomise Ball Position', {
    fontSize: '16px',
    fontFamily: 'Arial',
    backgroundColor: '#dddddd',
    color: '#000000',
    padding: { x: 10, y: 5 }
  }).setInteractive({ useHandCursor: true });

  randomBallBtn.on('pointerdown', () => {
    const { x: minX, y: minY } = pitchToScreen(0.1, 0.1, this);
    const { x: maxX, y: maxY } = pitchToScreen(90.0, 54.5, this);

    const targetX = Phaser.Math.Between(minX, maxX);
    const targetY = Phaser.Math.Between(minY, maxY);
    const distance = Phaser.Math.Distance.Between(gameBall.container.x, gameBall.container.y, targetX, targetY);
    const speed = 5;
    const duration = distance / speed * (1000 / 60);

    this.tweens.add({
      targets: gameBall.container,
      x: targetX,
      y: targetY,
      duration: duration,
      ease: 'Linear',
      onUpdate: () => gameBall.updateCoords()
    });
  });

  // Toggle Position Overlay
  const toggleOverlayBtn = this.add.text(20, 380, 'Position Overlay: OFF', {
    fontSize: '16px',
    fontFamily: 'Arial',
    backgroundColor: '#dddddd',
    color: '#000000',
    padding: { x: 10, y: 5 }
  }).setInteractive({ useHandCursor: true });

  toggleOverlayBtn.on('pointerdown', () => {
    overlayActive = !overlayActive;
    overlayManager.toggleVisibility();
    toggleOverlayBtn.setText(overlayActive ? 'Position Overlay: ON' : 'Position Overlay: OFF');
    toggleOverlayBtn.setBackgroundColor(overlayActive ? '#88ff88' : '#dddddd');
  });

  // Clicking on a player triggers zone if overlay is on
  this.input.on('gameobjectdown', (pointer, gameObject) => {
  if (!overlayActive) return;

  const allPlayers = [...homePlayers, ...awayPlayers];
  const clickedPlayer = allPlayers.find(p => p.container === gameObject);
  if (clickedPlayer && clickedPlayer.container.data.get('position')) {
    const team = homePlayers.includes(clickedPlayer) ? 'home' : 'away';
    const pos = clickedPlayer.container.data.get('position');
    overlayManager.showZone(pos, team); // pass teamKey
  }
  });


  const sliderText = this.add.text(20, 160, 'Max Passing Length: 40m', {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#000000'
  });

  const slider = this.add.dom(160, 190).createFromHTML(`
    <input type="range" min="3" max="40" value="40" step="1" style="width: 200px;" />
  `);
  slider.addListener('input');
  slider.on('input', (event) => {
    maxPassDistance = parseInt(event.target.value);
    sliderText.setText(`Max Passing Length: ${maxPassDistance}m`);
    lineManager.setMaxDistance(maxPassDistance);
    lineManager.updateLines();
  });

  const tackleText = this.add.text(20, 230, 'Tackle Zone Distance: 3m', {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#000000'
  });

  const tackleSlider = this.add.dom(160, 260).createFromHTML(`
    <input type="range" min="1" max="5" value="3" step="0.1" style="width: 200px;" />
  `);
  tackleSlider.addListener('input');
  tackleSlider.on('input', (event) => {
    tackleZoneDistance = parseFloat(event.target.value);
    tackleText.setText(`Tackle Zone Distance: ${tackleZoneDistance.toFixed(1)}m`);
    lineManager.setTackleDistance(tackleZoneDistance);
    lineManager.updateLines();
  });

  this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    lineManager.handleDragUpdate(gameObject);
  });
}

GAME_CONFIG.scene.create = create;
const game = new Phaser.Game(GAME_CONFIG);
