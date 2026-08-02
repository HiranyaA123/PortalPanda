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
    const verticalSpan = next.y - anchor.y;
    if (compact) {
      const startsLeft = anchor.x <= pageWidth / 2;
      const nearEdge = startsLeft ? routeInset : pageWidth - routeInset;
      const farEdge = startsLeft ? pageWidth - routeInset : routeInset;
      const firstWaypoint = { x: farEdge, y: anchor.y + verticalSpan * 0.3 };
      const secondWaypoint = { x: nearEdge, y: anchor.y + verticalSpan * 0.66 };
      const bend = verticalSpan * 0.085;
      appendCurve(
        anchor,
        { x: anchor.x, y: anchor.y + bend },
        { x: firstWaypoint.x, y: firstWaypoint.y - bend },
        firstWaypoint,
      );
      appendCurve(
        firstWaypoint,
        { x: firstWaypoint.x, y: firstWaypoint.y + bend },
        { x: secondWaypoint.x, y: secondWaypoint.y - bend },
        secondWaypoint,
      );
      appendCurve(
        secondWaypoint,
        { x: secondWaypoint.x, y: secondWaypoint.y + bend },
        { x: next.x, y: next.y - bend },
        next,
      );
      return;
    }

    const routeRight = index % 2 === 0;
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

  return { anchors: measuredAnchors, points: measured, total, compact };
}

function indexAtOrAfterDistance(points, distance) {
  let low = 0;
  let high = points.length - 1;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (points[middle].distance < distance) low = middle + 1;
    else high = middle;
  }

  return low;
}

function pointAtDistance(points, distance) {
  if (!points.length) return null;
  const target = clamp(distance, 0, points[points.length - 1].distance);
  const index = indexAtOrAfterDistance(points, target);
  if (index === 0) return { ...points[0], distance: target };

  const point = points[index];
  const previous = points[index - 1];
  const segment = point.distance - previous.distance;
  const ratio = segment > 0 ? clamp((target - previous.distance) / segment, 0, 1) : 0;

  return {
    x: previous.x + (point.x - previous.x) * ratio,
    y: previous.y + (point.y - previous.y) * ratio,
    distance: target,
  };
}

function traceDistanceRange(context, points, startDistance, endDistance) {
  if (!points.length || endDistance <= startDistance) return null;
  const start = pointAtDistance(points, startDistance);
  const end = pointAtDistance(points, endDistance);
  if (!start || !end) return null;

  context.beginPath();
  context.moveTo(start.x, start.y);
  const firstIndex = indexAtOrAfterDistance(points, startDistance);

  for (let index = firstIndex; index < points.length; index += 1) {
    const point = points[index];
    if (point.distance <= startDistance) continue;
    if (point.distance >= endDistance) break;
    context.lineTo(point.x, point.y);
  }

  context.lineTo(end.x, end.y);
  return end;
}

function distanceAtY(points, targetY) {
  if (!points.length || targetY <= points[0].y) return 0;
  const last = points[points.length - 1];
  if (targetY >= last.y) return last.distance;

  let low = 1;
  let high = points.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (points[middle].y < targetY) low = middle + 1;
    else high = middle;
  }

  const point = points[low];
  const previous = points[low - 1];
  const verticalSpan = point.y - previous.y;
  const ratio = verticalSpan > 0
    ? clamp((targetY - previous.y) / verticalSpan, 0, 1)
    : 0;
  return previous.distance + (point.distance - previous.distance) * ratio;
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
    let thread = { anchors: [], points: [], total: 0, compact: false };
    let frame = 0;
    let resizeFrame = 0;
    let resizeMustRebuild = false;
    let pixelRatio = 1;
    let targetReached = false;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let documentHeight = 0;
    let homePageTop = 0;
    let threadGradient = null;

    const resize = (force = false) => {
      const width = home.clientWidth;
      const height = home.scrollHeight;
      const nextPixelRatio = Math.min(window.devicePixelRatio || 1, 1);
      homePageTop = home.getBoundingClientRect().top + window.scrollY;
      documentHeight = document.documentElement.scrollHeight;

      if (!force && width === canvasWidth && height === canvasHeight && nextPixelRatio === pixelRatio) {
        draw();
        return;
      }

      canvasWidth = width;
      canvasHeight = height;
      pixelRatio = nextPixelRatio;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      thread = buildThreadPoints(nodes, home, width);
      const startY = thread.points[0]?.y ?? 0;
      const endY = thread.points[thread.points.length - 1]?.y ?? height;
      // Single-hue azure ramp. This used to run #7578ff -> #8c8eff -> #71e1e6,
      // a purple-to-cyan sweep: the most recognisable generated-UI gradient
      // there is. A gradient earns its place by giving depth within one hue,
      // not by travelling across the wheel.
      threadGradient = context.createLinearGradient(0, startY, width, endY);
      threadGradient.addColorStop(0, '#0b5ca8');
      threadGradient.addColorStop(0.55, '#1f77c9');
      threadGradient.addColorStop(1, '#4b9bdd');
      draw();
    };

    const drawNodes = (activeDistance, dirtyTop, dirtyBottom) => {
      thread.anchors.forEach((anchor) => {
        if (anchor.isTarget) return;
        if (anchor.distance > activeDistance + 12) return;
        if (anchor.y < dirtyTop - 28 || anchor.y > dirtyBottom + 28) return;

        context.save();
        context.shadowBlur = 18;
        context.shadowColor = '#4b9bdd';
        context.fillStyle = 'rgba(75, 155, 221, 0.22)';
        context.beginPath();
        context.arc(anchor.x, anchor.y, 10, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
        context.fillStyle = '#cfe6f8';
        context.beginPath();
        context.arc(anchor.x, anchor.y, 3.25, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
    };

    const draw = () => {
      frame = 0;
      const height = window.innerHeight;
      const scrollY = window.scrollY;
      if (!thread.points.length || !thread.total) return;

      // Only repaint the strip currently on screen. The previous version
      // cleared and redrew the full multi-thousand-pixel canvas on every scroll
      // frame, which was especially expensive on high-DPI phones.
      const overscan = thread.compact ? 56 : 96;
      const viewportTop = scrollY - homePageTop;
      const dirtyTop = clamp(viewportTop - overscan, 0, canvasHeight);
      const dirtyBottom = clamp(viewportTop + height + overscan, 0, canvasHeight);
      const dirtyHeight = Math.max(0, dirtyBottom - dirtyTop);
      if (!dirtyHeight) return;

      context.clearRect(0, dirtyTop, canvasWidth, dirtyHeight);
      context.save();
      context.beginPath();
      context.rect(0, dirtyTop, canvasWidth, dirtyHeight);
      context.clip();

      const probe = scrollY + height * 0.5 - homePageTop;
      const atPageEnd = scrollY + height >= documentHeight - 2;
      const activeDistance = reduceMotion || atPageEnd
        ? thread.total
        : distanceAtY(thread.points, probe);
      const progress = clamp(activeDistance / thread.total, 0, 1);
      canvas.dataset.threadProbeViewportY = `${Math.round(height * 0.5)}`;
      canvas.dataset.threadProgress = progress.toFixed(4);
      if (!reduceMotion && !targetReached && activeDistance >= thread.total - 2) {
        targetReached = true;
        target?.classList.add('is-thread-reached');
      }
      const visibleStartDistance = distanceAtY(thread.points, dirtyTop);
      const visibleEndDistance = distanceAtY(thread.points, dirtyBottom);

      context.save();
      context.lineCap = 'round';
      context.lineJoin = 'round';
      const visiblePath = traceDistanceRange(context, thread.points, visibleStartDistance, visibleEndDistance);
      if (visiblePath) {
        context.strokeStyle = 'rgba(11, 92, 168, 0.12)';
        context.lineWidth = 1.2;
        context.stroke();
      }
      context.restore();

      if (!reduceMotion && activeDistance > 0) {
        const activeEndDistance = Math.min(activeDistance, visibleEndDistance);
        const lead = pointAtDistance(thread.points, activeDistance);

        if (activeEndDistance > visibleStartDistance) {
          context.save();
          context.lineCap = 'round';
          context.lineJoin = 'round';
          traceDistanceRange(context, thread.points, visibleStartDistance, activeEndDistance);
          context.strokeStyle = 'rgba(11, 92, 168, 0.15)';
          context.lineWidth = 13;
          context.shadowBlur = thread.compact ? 12 : 18;
          context.shadowColor = '#0b5ca8';
          context.stroke();

          context.shadowBlur = thread.compact ? 4 : 7;
          context.strokeStyle = threadGradient;
          context.lineWidth = 2.4;
          context.stroke();
          context.restore();
        }

        if (lead) {
          canvas.dataset.threadLeadViewportY = `${Math.round(lead.y + homePageTop - scrollY)}`;
          if (lead.y >= dirtyTop - 20 && lead.y <= dirtyBottom + 20) {
            const glow = context.createRadialGradient(lead.x, lead.y, 0, lead.x, lead.y, 19);
            glow.addColorStop(0, 'rgba(235, 246, 255, 0.95)');
            glow.addColorStop(0.22, 'rgba(75, 155, 221, 0.8)');
            glow.addColorStop(1, 'rgba(11, 92, 168, 0)');
            context.fillStyle = glow;
            context.beginPath();
            context.arc(lead.x, lead.y, 19, 0, Math.PI * 2);
            context.fill();
          }
        }
      } else {
        canvas.dataset.threadLeadViewportY = '';
      }

      drawNodes(activeDistance, dirtyTop, dirtyBottom);
      context.restore();
    };

    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const requestResize = (mustRebuild = false) => {
      resizeMustRebuild ||= mustRebuild;
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        const force = resizeMustRebuild;
        resizeMustRebuild = false;
        resize(force);
      });
    };

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => requestResize(true));
    observer?.observe(home);
    nodes.forEach((node) => observer?.observe(node));
    const onResize = () => requestResize(false);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', requestDraw, { passive: true });
    resize(true);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      observer?.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', requestDraw);
      target?.classList.remove('is-thread-reached');
    };
  }, []);

  return <canvas ref={canvasRef} className="cp-scroll-thread" aria-hidden="true" />;
}
