/**
 * src/components/widget/atoms/logos/NYTimesLogo.tsx
 * NYTimesLogo - Pure presentational component
 * 50x50px black circle with NYT logo image
 * Based on exact Figma specifications
 */

import { tokens } from "@/lib/design-tokens";
import nytLogo from "@/assets/icons/nytlogo.png";

interface NYTimesLogoProps {
  className?: string;
}

export function NYTimesLogo({ className = "" }: NYTimesLogoProps) {
  const { container, image } = tokens.dimensions.logo;

  return (
    <div
      className={className}
      style={{
        width: container.width,
        height: container.height,
        position: "relative",
      }}
    >
      {/* Black circular background */}
      <div
        style={{
          width: container.width,
          height: container.height,
          left: "0px",
          top: "0px",
          position: "absolute",
          background: tokens.colors.background.logo,
          borderRadius: tokens.borderRadius.full,
        }}
      />
      {/* NYT Logo image positioned exactly per Figma */}
      <div
        style={{
          width: image.width,
          height: image.height,
          left: image.position.left,
          top: image.position.top,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={nytLogo}
          alt="The New York Times"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          loading="eager"
          draggable={false}
        />
      </div>
    </div>
  );
}
