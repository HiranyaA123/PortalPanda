import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const pointOnCurve = (start, controlOne, controlTwo, end, t) => {
  const inverse = 1 - t;

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

function buildThreadPoints(nodes, home, pageWidth) {
  const compact = pageWidth <= 640;
  const homeRect = home.getBoundingClientRect();
  const edgeInset = compact ? 12 : 24;
  const anchorGap = compact ? 14 : 28;
  const anchors = nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    const markerRect = node.querySelector('i')?.getBoundingClientRect();
    const side = node.dataset.scrollThread === 'left' ? 'left' : 'right';
    const isTarget = node.dataset.scrollThread === 'target';
    const relativeLeft = rect.left - homeRect.left;
    const relativeRight = rect.right - homeRect.left;

    return {
      // Every point is tied to the real label/button, rather than a viewport
      // percentage. That keeps the thread stable through zoom and reflow.
      x: clamp(
        isTarget
          ? relativeLeft + rect.width / 2
          : markerRect
            ? markerRect.left - homeRect.left + markerRect.width / 2
          : side === 'left' ? relativeLeft - anchorGap : relativeRight + anchorGap,
        edgeInset,
        pageWidth - edgeInset,
      ),
      y: markerRect
        ? markerRect.top - homeRect.top + markerRect.height / 2
        : rect.top - homeRect.top + rect.height / 2,
      isTarget,
    };
  });

  // Route through alternating outer waypoints. The labels remain exact anchors,
  // while these stable page-local guides restore the large cross-page sweeps.
  const routeInset = compact ? 22 : clamp(pageWidth * 0.07, 72, 168);
  const points = [];
  const appendCurve = (start, controlOne, controlTwo, end) => {
    for (let step = 0; step <= 46; step += 1) {
      if (points.length && step === 0) continue;
      const point = pointOnCurve(start, controlOne, controlTwo, end, step / 46);
      points.push({
        x: clamp(point.x, edgeInset, pageWidth - edgeInset),
        y: point.y,
      });
    }
  };

  anchors.forEach((anchor, index) => {
    if (index === anchors.length - 1) return;
    const next = anchors[index + 1];
    const routeRight = index % 2 === 0;
    const verticalSpan = next.y - anchor.y;
    const route = {
      x: routeRight ? pageWidth - routeInset : routeInset,
      y: anchor.y + verticalSpan * 0.5,
    };
    const bend = verticalSpan * 0.2;
    const finalSegment = index === anchors.length - 2;

    appendCurve(
      anchor,
      { x: anchor.x, y: anchor.y + bend },
      { x: route.x, y: route.y - bend },
      route,
    );
    appendCurve(
      route,
      { x: route.x, y: route.y + bend },
      {
        x: finalSegment ? next.x + (route.x - next.x) * 0.34 : next.x,
        y: next.y - bend,
      },
      next,
    );
  });

  let total = 0;
  const measured = points.map((point, index) => {
    if (index > 0) {
      const previous = points[index - 1];
      total += Math.hypot(point.x - previous.x, point.y - previous.y);
    }
    return { ...point, distance: total };
  });

  const measuredAnchors = anchors.map((anchor) => {
    const closest = measured.reduce((best, point) => (
      Math.hypot(point.x - anchor.x, point.y - anchor.y)
        < Math.hypot(best.x - anchor.x, best.y - anchor.y) ? point : best
    ), measured[0]);
    return { ...anchor, distance: closest?.distance ?? 0 };
  });

  return { anchors: measuredAnchors, points: measured, total };
}

function traceToDistance(context, points, distance) {
  if (!points.length) return null;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  let lead = points[0];

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const previous = points[index - 1];
    if (point.distance <= distance) {
      context.lineTo(point.x, point.y);
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
    context.lineTo(lead.x, lead.y);
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
    let resizeFrame = 0;
    let pixelRatio = 1;
    let targetReached = false;

    const resize = () => {
      const width = home.clientWidth;
      const height = home.scrollHeight;
      const safeRatio = Math.min(16384 / Math.max(width, 1), 16384 / Math.max(height, 1));
      pixelRatio = Math.max(0.75, Math.min(window.devicePixelRatio || 1, 1.25, safeRatio));
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      thread = buildThreadPoints(nodes, home, width);
      draw();
    };

    const drawNodes = (activeDistance) => {
      thread.anchors.forEach((anchor) => {
        if (anchor.isTarget) return;
        if (anchor.distance > activeDistance + 12) return;

        context.save();
        context.shadowBlur = 18;
        context.shadowColor = '#75e4e8';
        context.fillStyle = 'rgba(117, 228, 232, 0.22)';
        context.beginPath();
        context.arc(anchor.x, anchor.y, 10, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
        context.fillStyle = '#b9f8fa';
        context.beginPath();
        context.arc(anchor.x, anchor.y, 3.25, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
    };

    const draw = () => {
      frame = 0;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scrollY = window.scrollY;
      const canvasWidth = home.clientWidth;
      const canvasHeight = home.scrollHeight;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      if (!thread.points.length || !thread.total) return;

      const startY = thread.points[0].y;
      const endY = thread.points[thread.points.length - 1].y;
      const homePageTop = home.getBoundingClientRect().top + scrollY;

      const probe = scrollY + height * 0.74 - homePageTop;
      const progress = clamp((probe - startY) / Math.max(endY - startY, 1), 0, 1);
      const activeDistance = reduceMotion ? thread.total : thread.total * progress;
      if (!reduceMotion && !targetReached && progress >= 0.985) {
        targetReached = true;
        target?.classList.add('is-thread-reached');
      }
      const gradient = context.createLinearGradient(0, startY, canvasWidth, endY);
      gradient.addColorStop(0, '#7578ff');
      gradient.addColorStop(0.55, '#8c8eff');
      gradient.addColorStop(1, '#71e1e6');

      context.save();
      context.lineCap = 'round';
      context.lineJoin = 'round';
      traceToDistance(context, thread.points, thread.total);
      context.strokeStyle = 'rgba(112, 117, 240, 0.12)';
      context.lineWidth = 1.2;
      context.stroke();
      context.restore();

      if (!reduceMotion && activeDistance > 0) {
        context.save();
        context.lineCap = 'round';
        context.lineJoin = 'round';
        const lead = traceToDistance(context, thread.points, activeDistance);
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
          const glow = context.createRadialGradient(lead.x, lead.y, 0, lead.x, lead.y, 19);
          glow.addColorStop(0, 'rgba(220, 252, 255, 0.95)');
          glow.addColorStop(0.22, 'rgba(117, 228, 232, 0.8)');
          glow.addColorStop(1, 'rgba(91, 93, 240, 0)');
          context.fillStyle = glow;
          context.beginPath();
          context.arc(lead.x, lead.y, 19, 0, Math.PI * 2);
          context.fill();
        }
      }

      drawNodes(activeDistance);
    };

    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const requestResize = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    };

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(requestResize);
    observer?.observe(home);
    nodes.forEach((node) => observer?.observe(node));
    window.addEventListener('resize', requestResize);
    window.visualViewport?.addEventListener('resize', requestResize);
    window.addEventListener('scroll', requestDraw, { passive: true });
    resize();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      observer?.disconnect();
      window.removeEventListener('resize', requestResize);
      window.visualViewport?.removeEventListener('resize', requestResize);
      window.removeEventListener('scroll', requestDraw);
      target?.classList.remove('is-thread-reached');
    };
  }, []);

  return <canvas ref={canvasRef} className="cp-scroll-thread" aria-hidden="true" />;
}
