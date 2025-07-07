import { SCALE } from './pitch_utils.js';

export class PassingLineManager {
  constructor(scene) {
    this.scene = scene;
    this.lines = [];
    this.activePlayers = [];
    this.oppositionPlayers = [];
    this.maxDistance = 40;
    this.tackleDistance = 3;
    this.visible = true; // ✅ initialize visibility
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(1); // below players but above pitch
  }

  setActivePlayers(players) {
    this.activePlayers = players;
  }

  setOppositionPlayers(players) {
    this.oppositionPlayers = players;
  }

  toggleVisibility() {
    this.visible = !this.visible;

    for (const line of this.lines) {
      line.setVisible(this.visible);
    }
  }

  setMaxDistance(distance) {
    this.maxDistance = distance;
  }

  setTackleDistance(distance) {
    this.tackleDistance = distance;
  }

  handleDragUpdate(gameObject) {
    if (!gameObject || !gameObject.data) return;
    const type = gameObject.data.get('type');
    const position = gameObject.data.get('position');

    if (
      type === 'player' &&
      position &&
      this.activePlayers.some(p => p.container.data.get('position') === position)
    ) {
      this.updateLines();
    }
  }

  clearLines() {
    this.lines.forEach(line => line.destroy());
    this.lines = [];
  }

  updateLines() {
    this.clearLines();

    for (let i = 0; i < this.activePlayers.length; i++) {
      const a = this.activePlayers[i];
      const posA = a.container.data.get('position');
      if (posA === 'GK') continue;

      for (let j = i + 1; j < this.activePlayers.length; j++) {
        const b = this.activePlayers[j];
        const posB = b.container.data.get('position');
        if (posB === 'GK') continue;

        const dist = Phaser.Math.Distance.Between(
          a.container.x,
          a.container.y,
          b.container.x,
          b.container.y
        );

        if (dist <= this.maxDistance * SCALE) {
          // Line thickness logic
          const minWidth = 0.5;
          const maxWidth = 5;
          const normalized = 1 - dist / (this.maxDistance * SCALE);
          const thickness = Phaser.Math.Clamp(
            minWidth + (maxWidth - minWidth) * normalized,
            minWidth,
            maxWidth
          );

          const line = this.scene.add
            .line(0, 0, a.container.x, a.container.y, b.container.x, b.container.y, 0x000000)
            .setOrigin(0, 0)
            .setLineWidth(thickness)
            .setDepth(0)
            .setVisible(this.visible); // ✅ show/hide based on state

          if (this.isLineContested(a.container, b.container)) {
            line.setStrokeStyle(2, 0xff0000); // contested = red
          }

          this.lines.push(line);
        }
      }
    }
  }

  isLineContested(start, end) {
    const distThreshold = this.tackleDistance * SCALE;

    for (let opp of this.oppositionPlayers) {
      const px = opp.container.x;
      const py = opp.container.y;
      const dist = Phaser.Math.Distance.BetweenPoints(
        { x: px, y: py },
        this.closestPointOnLine(start, end, { x: px, y: py })
      );
      if (dist <= distThreshold) return true;
    }

    return false;
  }

  closestPointOnLine(a, b, p) {
    const ax = a.x,
      ay = a.y;
    const bx = b.x,
      by = b.y;
    const apx = p.x - ax;
    const apy = p.y - ay;
    const abx = bx - ax;
    const aby = by - ay;

    const abLenSq = abx * abx + aby * aby;
    const dot = apx * abx + apy * aby;
    const t = Math.max(0, Math.min(1, dot / abLenSq));

    return {
      x: ax + abx * t,
      y: ay + aby * t
    };
  }
}
