export function drawPitch(scene, graphics) {
  const scale = 14;
  const pitchWidth = 91.4 * scale;
  const pitchHeight = 55 * scale;
  const dRadius = 14.63 * scale;
  const outerDRadius = 19.63 * scale;
  const goalWidth = 3.66 * scale;
  const goalDepth = 2 * scale;
  const line25YardOffset = 22.85 * scale;
  const penaltySpotOffset = 6.4 * scale;

  const offsetX = (scene.scale.width - pitchWidth) / 2;
  const offsetY = (scene.scale.height - pitchHeight) / 2;

  const arcExtensionLeft = Math.PI / 6;
  const arcExtensionRight = Math.PI / 2;

  // Outline
  graphics.fillStyle(0x51b56a, 1);
  graphics.fillRect(offsetX - 50, offsetY - 50, pitchWidth + 100, pitchHeight + 100);

  // Pitch fill
  graphics.fillStyle(0x4acf6b, 1);
  graphics.fillRect(offsetX, offsetY, pitchWidth, pitchHeight);

  // White lines
  graphics.lineStyle(2, 0xffffff, 1);
  graphics.strokeRect(offsetX, offsetY, pitchWidth, pitchHeight);

  // Center + 25-yard lines
  graphics.lineBetween(offsetX + pitchWidth / 2, offsetY, offsetX + pitchWidth / 2, offsetY + pitchHeight);
  graphics.lineBetween(offsetX + line25YardOffset, offsetY, offsetX + line25YardOffset, offsetY + pitchHeight);
  graphics.lineBetween(offsetX + pitchWidth - line25YardOffset, offsetY, offsetX + pitchWidth - line25YardOffset, offsetY + pitchHeight);

  // Goals
// Left goal side lines
graphics.lineBetween(offsetX, offsetY + pitchHeight / 2 - goalWidth / 2, offsetX - goalDepth, offsetY + pitchHeight / 2 - goalWidth / 2);
graphics.lineBetween(offsetX, offsetY + pitchHeight / 2 + goalWidth / 2, offsetX - goalDepth, offsetY + pitchHeight / 2 + goalWidth / 2);

// Left goal back line
graphics.lineBetween(offsetX - goalDepth, offsetY + pitchHeight / 2 - goalWidth / 2, offsetX - goalDepth, offsetY + pitchHeight / 2 + goalWidth / 2);

// Right goal side lines
graphics.lineBetween(offsetX + pitchWidth, offsetY + pitchHeight / 2 - goalWidth / 2, offsetX + pitchWidth + goalDepth, offsetY + pitchHeight / 2 - goalWidth / 2);
graphics.lineBetween(offsetX + pitchWidth, offsetY + pitchHeight / 2 + goalWidth / 2, offsetX + pitchWidth + goalDepth, offsetY + pitchHeight / 2 + goalWidth / 2);

// Right goal back line
graphics.lineBetween(offsetX + pitchWidth + goalDepth, offsetY + pitchHeight / 2 - goalWidth / 2, offsetX + pitchWidth + goalDepth, offsetY + pitchHeight / 2 + goalWidth / 2);
  // Arcs
  drawArc(graphics, offsetX, offsetY + pitchHeight / 2, dRadius, -Math.PI / 2, Math.PI / 2);
  drawArc(graphics, offsetX + pitchWidth, offsetY + pitchHeight / 2, dRadius, 1.5 * Math.PI, 0.5 * Math.PI);

  // Dashed arcs
  drawDashedArc(graphics, offsetX, offsetY + pitchHeight / 2, outerDRadius, -Math.PI / 3 - arcExtensionLeft, Math.PI / 2.85 + arcExtensionLeft);
  drawDashedArc(graphics, offsetX + pitchWidth, offsetY + pitchHeight / 2, outerDRadius, 1.0 * Math.PI - arcExtensionRight, 1.015 * Math.PI + arcExtensionRight);

  // Penalty spots
  graphics.fillStyle(0xffffff, 1);
  graphics.fillCircle(offsetX + penaltySpotOffset, offsetY + pitchHeight / 2, 3);
  graphics.fillCircle(offsetX + pitchWidth - penaltySpotOffset, offsetY + pitchHeight / 2, 3);
}

function drawArc(graphics, centerX, centerY, radius, startAngle, endAngle) {
  const steps = 100;
  graphics.beginPath();
  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / steps);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) graphics.moveTo(x, y);
    else graphics.lineTo(x, y);
  }
  graphics.strokePath();
}

function drawDashedArc(graphics, centerX, centerY, radius, startAngle, endAngle) {
  const dashLength = 15;
  const gapLength = 15;
  const arcLength = radius * (endAngle - startAngle);
  const totalLength = dashLength + gapLength;
  const numDashes = Math.floor(arcLength / totalLength);
  const anglePerSegment = (endAngle - startAngle) / numDashes;

  for (let i = 0; i < numDashes; i++) {
    const angle1 = startAngle + i * anglePerSegment;
    const angle2 = angle1 + (dashLength / arcLength) * (endAngle - startAngle);
    const x1 = centerX + radius * Math.cos(angle1);
    const y1 = centerY + radius * Math.sin(angle1);
    const x2 = centerX + radius * Math.cos(angle2);
    const y2 = centerY + radius * Math.sin(angle2);

    graphics.lineStyle(1.5, 0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    graphics.strokePath();
  }
}
