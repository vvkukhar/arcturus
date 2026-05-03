'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotateY = ((mouseX / width) - 0.5) * 12;
    const rotateX = ((mouseY / height) - 0.5) * -12;
    setStyle({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setStyle({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) scale3d(1, 1, 1)`,
        transition: 'all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
      }}
      className={cn('transform-gpu h-full w-full', className)}
    >
      {children}
    </div>
  );
}