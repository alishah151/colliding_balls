function generateRandomPoint(max) {
  return Math.ceil(Math.random() * max);
}
function isCollide(a, b, size) {
  let squareDistance = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
  return squareDistance <= (size + size) * (size + size);
}
export function collidingBalls({
  $ele,
  count = 100,
  isStatic = false,
  size = 5,
  speed = 7,
  sameSize = true,
  id = "myCanvas",
}) {
  if (!$ele) {
    return null;
  }
  const heightC = $ele.offsetHeight;
  const widthC = $ele.offsetWidth;
  const balls = [];
  const placeholder = document.createElement("div");
  placeholder.innerHTML = `<canvas id="${id}" height="${heightC}" width="${widthC}" style="position: absolute; top: 0; left: 0;"></canvas>`;

  if (!placeholder?.firstElementChild) {
    return null;
  }
  const canvas = placeholder.firstElementChild;
  const ctx = canvas.getContext("2d");

  function update() {
    if (!ctx) {
      return null;
    }
    ctx.clearRect(0, 0, widthC, heightC);

    for (let i = 0; i < count; i++) {
      balls[i].x += balls[i].dx;
      if (balls[i].x > widthC) {
        balls[i].dx = -balls[i].dx;
        balls[i].x = widthC;
      }
      if (balls[i].x < 0) {
        balls[i].dx = -balls[i].dx;
        balls[i].x = 0;
      }
      balls[i].y += balls[i].dy;
      if (balls[i].y > heightC) {
        balls[i].dy = -balls[i].dy;
        balls[i].y = heightC;
      }
      if (balls[i].y < 0) {
        balls[i].dy = -balls[i].dy;
        balls[i].y = 0;
      }

      ctx.beginPath();
      ctx.arc(balls[i].x, balls[i].y, balls[i].size, 0, 2 * Math.PI, true);
      ctx.fill();
    }

    for (let i = 0; i < count - 1; i++) {
      for (let j = i + 1; j < count; j++) {
        if (isCollide(balls[i], balls[j], size)) {
          let vCollision = {
            x: balls[j].x - balls[i].x,
            y: balls[j].y - balls[i].y,
          };
          let distance = Math.sqrt(
            (balls[j].x - balls[i].x) * (balls[j].x - balls[i].x) +
              (balls[j].y - balls[i].y) * (balls[j].y - balls[i].y)
          );
          let vCollisionNorm = {
            x: vCollision.x / distance,
            y: vCollision.y / distance,
          };
          let vRelativeVelocity = {
            x: balls[i].dx - balls[j].dx,
            y: balls[i].dy - balls[j].dy,
          };
          let speed =
            vRelativeVelocity.x * vCollisionNorm.x +
            vRelativeVelocity.y * vCollisionNorm.y;
          if (speed > 0) {
            balls[i].dx -= speed * vCollisionNorm.x;
            balls[i].dy -= speed * vCollisionNorm.y;
            balls[j].dx += speed * vCollisionNorm.x;
            balls[j].dy += speed * vCollisionNorm.y;
          }
        }
      }
    }
    if (!isStatic) {
      window.requestAnimationFrame(update);
    }
  }

  function init() {
    if (!ctx) {
      return null;
    }
    for (let i = 0; i < count; i++) {
      let x = generateRandomPoint(widthC);
      let y = generateRandomPoint(heightC);
      balls.push({
        x,
        y,
        size: sameSize ? size : Math.ceil(Math.random() * size),
        dx: (Math.random() * 100 > 50 ? 1 : -1) * generateRandomPoint(speed),
        dy: (Math.random() * 100 > 50 ? 1 : -1) * generateRandomPoint(speed),
      });
    }

    $ele.append(canvas);
    window.requestAnimationFrame(update);
  }

  init();

  return canvas;
}
