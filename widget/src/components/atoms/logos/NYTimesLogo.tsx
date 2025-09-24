/**
 * NYTimesLogo - Pure presentational component
 * 50x50px black circle with NYT logo image
 * Based on exact Figma specifications
 */

import { tokens } from '@/lib/design-tokens';

interface NYTimesLogoProps {
  className?: string;
}

export function NYTimesLogo({ className = '' }: NYTimesLogoProps) {
  const { container, image } = tokens.dimensions.logo;

  return (
    <div
      className={className}
      style={{
        width: container.width,
        height: container.height,
        position: 'relative'
      }}
    >
      {/* Black circular background */}
      <div
        style={{
          width: container.width,
          height: container.height,
          left: '0px',
          top: '0px',
          position: 'absolute',
          background: tokens.colors.background.logo,
          borderRadius: tokens.borderRadius.full
        }}
      />
      {/* NYT Logo - using text for now since we don't have the actual image */}
      <div
        style={{
          width: image.width,
          height: image.height,
          left: image.position.left,
          top: image.position.top,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: 'serif'
        }}
      >
        NYT
      </div>
    </div>
  );
}