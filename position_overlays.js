import { pitchToScreen } from './pitch_utils.js';

export class PositionOverlayManager {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics({ depth: 1 }); // Above pitch, below players
    this.graphics.setVisible(false);
    this.zones = this.defineZones();
  }

  defineZones() {
    return {
      home: {
        CF: [[46.4, 15], [91, 7], [91, 48], [46, 41]],
        LW: [[41, 1], [91, 1], [90, 31], [46.5, 11]],
        RW: [[44, 43.5], [90, 24], [90, 54], [44, 53]],
        LI: [[7, 5], [91, 4], [90, 31], [7, 25]],
        RI: [[8, 29], [89, 24], [91, 51], [10, 49]],
        LHB: [[1, 1], [70, 0.5], [70, 15], [1, 31]],
        CH: [[8, 13], [85, 14], [85, 41], [5, 42]],
        RHB: [[1, 25], [70, 41], [70, 55], [1, 54]],
        LB: [[1, 8.5], [47, 10], [47, 30], [1, 30]],
        RB: [[1, 26], [47, 25], [47, 45], [1, 45]],
        GK: [[1, 20], [10, 26], [10, 29], [0.5, 34]]
      },
      away: {
        CF: [[40, 29], [0.5, 8], [45, 41], [0.5, 47]],
        LW: [[0.5, 25], [47, 44], [47, 53], [0.5, 54]],
        RW: [[0.5, 0.5], [46, 1.0], [46, 12], [0.5, 29]],
        LI: [[0.5, 25], [81, 26], [81, 50], [0.5, 49]],
        RI: [[0.5, 5.0], [82, 5.0], [85, 31], [0.5, 31]],
        LH: [[20, 40], [91, 25], [91, 54], [20, 54]],
        CH: [[8, 13], [85, 14], [85, 41], [5, 42]],
        RH: [[21, 1.0], [91, 0.5], [91, 30], [21, 15]],
        LB: [[44, 25], [91, 25], [91, 46], [44, 44]],
        RB: [[44.5, 11], [91, 11], [91, 30], [44, 30]],
        GK: [[79, 24], [91, 21], [91, 33], [78, 29]]
      }
    };
  }

  toggleVisibility() {
    const nowVisible = !this.graphics.visible;
    this.graphics.setVisible(nowVisible);
  }

  showZone(positionKey, teamKey) {
    if (!this.graphics.visible) return;

    const zone = this.zones[teamKey]?.[positionKey];
    if (!zone) return;

    this.graphics.clear();

    const points = zone.map(([x, y]) =>
      pitchToScreen(x, y, this.scene)
    );

    this.graphics.fillStyle(teamKey === 'home' ? 0x88ff88 : 0xff8888, 0.25); // green for home, red for away
    this.graphics.beginPath();
    this.graphics.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => this.graphics.lineTo(p.x, p.y));
    this.graphics.closePath();
    this.graphics.fillPath();
  }
}
