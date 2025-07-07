export const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'phaser-container',  // Must match the div ID
  backgroundColor: '#ffffff',
  dom: {
    createContainer: true
  },
  scene: {
    preload: () => {},
    create: null,
    update: () => {}
  }
};
