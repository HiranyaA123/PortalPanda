import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const pointOnCurve = (start, end, t) => {
  const inverse = 1 - t;
  const controlOne = { x: start.x, y: start.y + (end.y - start.y) * 0.42 };
  const controlTwo = { x: end.x, y: start.y + (end.y - start.y) * 0.58 };

  return {
    x: inverse ** 3 * start.x
      + 3 * inverse ** 2 * t * controlOne.x
      + 3 * inverse * t ** 2 * controlTwo.x
      + t ** 3 * end.x,
    y: inverse ** 3 * start.y
      + 3 * inverse ** 2 * t * controlOne.y
      + 3 * inverse * t ** 2 * controlTwo.y
      + t ** 3 * end.y,
  };
};

function buildThreadPoints(nodes, pageWidth) {
  const mobile = pageWidth <= 640;
  const sideInset = clamp(pageWidth * 0.075, 70, 118);
  const anchors = nodes.map((node, index) => {
    const rect = node.getBoundingClientRect();
    const side = node.dataset.scrollThread === 'left' ? 'left' : 'right';
    const isTarget = node.dataset.scrollThread === 'target';
    const mobileTrack = side === 'left'
      ? clamp(pageWidth * 0.3, 92, pageWidth * 0.38)
      : clamp(pageWidth * 0.78, pageWidth * 0.67, pageWidth - 52);
    return {
      // On small screens, use the semantic left/right anchors to make a broad
      // weave. The thread stays behind the content, but no longer resembles a
      // fixed rail along the right edge.
      x: isTarget
        ? rect.left + rect.width / 2
        : mobile
          ? mobileTrack
          : side === 'left' ? sideInset : pageWidth - sideInset,
      y: isTarget
        ? rect.top + window.scrollY + rect.height / 2
        : rect.top + window.scrollY + clamp(rect.height * 0.3, 120, 290),
    };
  });

  const points = [];
  anchors.forEach((anchor, index) => {
    if (index === anchors.length - 1) return;
    const next = anchors[index + 1];
    for (let step = 0; step <= 72; step += 1) {
      if (index > 0 && step === 0) continue;
      points.push(pointOnCurve(anchor, next, step / 72));
    }
  });

  let total = 0;
  const measured = points.map((point, index) => {
    if (index > 0) {
      const previous = points[index - 1];
      total += Math.hypot(point.x - previous.x, point.y - previous.y);
    }
    return { ...point, distance: total };
  });

  return { anchors, points: measured, total };
}

function traceToDistance(context, points, distance, scrollY) {
  if (!points.length) return null;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y - scrollY);
  let lead = points[0];

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const previous = points[index - 1];
    if (point.distance <= distance) {
      context.lineTo(point.x, point.y - scrollY);
      lead = point;
      continue;
    }

    const segment = point.distance - previous.distance;
    const ratio = segment > 0 ? clamp((distance - previous.distance) / segment, 0, 1) : 0;
    lead = {
      x: previous.x + (point.x - previous.x) * ratio,
      y: previous.y + (point.y - previous.y) * ratio,
      distance,
    };
    context.lineTo(lead.x, lead.y - scrollY);
    break;
  }

  return lead;
}

export default function ScrollThread() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const home = canvas?.closest('.cp-home');
    const nodes = home ? [...home.querySelectorAll('[data-scroll-thread]')] : [];
    const target = nodes.find((node) => node.dataset.scrollThread === 'target');
    if (!canvas || !home || nodes.length < 2) return undefined;

    const context = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let thread = { anchors: [], points: [], total: 0 };
    let frame = 0;
    let pixelRatio = 1;

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      thread = buildThreadPoints(nodes, window.innerWidth);
      draw();
    };

    const drawNodes = (activeDistance, scrollY) => {
      thread.anchors.forEach((anchor) => {
        const closest = thread.points.reduce((best, point) => (
          Math.abs(point.y - anchor.y) < Math.abs(best.y - anchor.y) ? point : best
        ), thread.points[0]);
        if (!closest || closest.distance > activeDistance + 12) return;
        const y = anchor.y - scrollY;
        if (y < -30 || y > window.innerHeight + 30) return;

        context.save();
        context.shadowBlur = 18;
        context.shadowColor = '#75e4e8';
        context.fillStyle = 'rgba(117, 228, 232, 0.22)';
        context.beginPath();
        context.arc(anchor.x, y, 10, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
        context.fillStyle = '#b9f8fa';
        context.beginPath();
        context.arc(anchor.x, y, 3.25, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
    };

    const draw = () => {
      frame = 0;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scrollY = window.scrollY;
      context.clearRect(0, 0, width, height);
      if (!thread.points.length || !thread.total) return;

      const startY = thread.points[0].y;
      const endY = thread.points[thread.points.length - 1].y;
      const homeRect = home.getBoundingClientRect();
      if (homeRect.bottom < 0 || homeRect.top > height) return;

      const probe = scrollY + height * 0.74;
      const progress = clamp((probe - startY) / Math.max(endY - startY, 1), 0, 1);
      const activeDistance = reduceMotion ? thread.total : thread.total * progress;
      target?.classList.toggle('is-thread-reached', !reduceMotion && progress >= 0.985);
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#7578ff');
      gradient.addColorStop(0.55, '#8c8eff');
      gradient.addColorStop(1, '#71e1e6');

      context.save();
      context.lineCap = 'round';
      context.lineJoin = 'round';
      traceToDistance(context, thread.points, thread.total, scrollY);
      context.strokeStyle = 'rgba(112, 117, 240, 0.12)';
      context.lineWidth = 1.2;
      context.stroke();
      context.restore();

      if (!reduceMotion && activeDistance > 0) {
        context.save();
        context.lineCap = 'round';
        context.lineJoin = 'round';
        const lead = traceToDistance(context, thread.points, activeDistance, scrollY);
        context.strokeStyle = 'rgba(104, 111, 255, 0.17)';
        context.lineWidth = 13;
        context.shadowBlur = 22;
        context.shadowColor = '#676cff';
        context.stroke();

        context.shadowBlur = 8;
        context.strokeStyle = gradient;
        context.lineWidth = 2.4;
        context.stroke();
        context.restore();

        if (lead) {
          const leadY = lead.y - scrollY;
          if (leadY > -30 && leadY < height + 30) {
            const glow = context.createRadialGradient(lead.x, leadY, 0, lead.x, leadY, 19);
            glow.addColorStop(0, 'rgba(220, 252, 255, 0.95)');
            glow.addColorStop(0.22, 'rgba(117, 228, 232, 0.8)');
            glow.addColorStop(1, 'rgba(91, 93, 240, 0)');
            context.fillStyle = glow;
            context.beginPath();
            context.arc(lead.x, leadY, 19, 0, Math.PI * 2);
            context.fill();
          }
        }
      }

      drawNodes(activeDistance, scrollY);
    };

    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(resize);
    observer?.observe(home);
    nodes.forEach((node) => observer?.observe(node));
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', requestDraw, { passive: true });
    resize();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', requestDraw);
      target?.classList.remove('is-thread-reached');
    };
  }, []);

  return <canvas ref={canvasRef} className="cp-scroll-thread" aria-hidden="true" />;
}
