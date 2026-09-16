import { useLayoutEffect, useRef, useState, type ComponentProps } from 'react';
import LiquidGlass from 'liquid-glass-react';

const STATIC_POINTER = { x: 0, y: 0 };

// Keep native layout, focus, disabled states and content outside the optical layer.
// The library's default centered layout and typography only apply to this decoration.
function GlassMaterial() {
  const materialRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState({ radius: 16, visible: false });

  useLayoutEffect(() => {
    const material = materialRef.current;
    const host = material?.parentElement;
    if (!material || !host) return;
    const measure = () => {
      const rect = material.getBoundingClientRect();
      const next = {
        radius: parseFloat(getComputedStyle(host).borderTopLeftRadius) || 0,
        visible: rect.width > 0 && rect.height > 0 && getComputedStyle(material).display !== 'none',
      };
      setMetrics((current) =>
        current.radius === next.radius && current.visible === next.visible ? current : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    observer.observe(material);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={materialRef} className="glass-material" aria-hidden="true">
      {metrics.visible && (
        <LiquidGlass
          className="glass-optics"
          displacementScale={70}
          blurAmount={0.025}
          saturation={140}
          aberrationIntensity={2}
          elasticity={0}
          cornerRadius={metrics.radius}
          globalMousePos={STATIC_POINTER}
          mouseOffset={STATIC_POINTER}
          mode="standard"
          padding="0"
          style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%' }}
        >
          <span />
        </LiquidGlass>
      )}
    </span>
  );
}

function surfaceClass(className = '') {
  const primary = /(?:^|\s)bg-white(?:\s|$)/.test(className);
  return `glass-surface${primary ? ' glass-primary' : ''} ${className}`;
}

export function GlassButton({ children, className, ...props }: ComponentProps<'button'>) {
  return <button {...props} className={surfaceClass(className)}><GlassMaterial />{children}</button>;
}

export function GlassPanel({ children, className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={surfaceClass(className)}><GlassMaterial />{children}</div>;
}

export function GlassLink({ children, className, ...props }: ComponentProps<'a'>) {
  return <a {...props} className={surfaceClass(className)}><GlassMaterial />{children}</a>;
}
