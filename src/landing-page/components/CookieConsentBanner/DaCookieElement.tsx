import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { cn } from "@/lib/utils";
import daCookie from "@/assets/da_cookie.png";
import { Position } from "./types";

type DaCookieElementProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  position: Position;
  isEaten: boolean;
  onClick: (event: React.MouseEvent) => void;
};

export const DaCookieElement = ({
  position,
  isEaten,
  onClick,
  style,
  ...props
}: DaCookieElementProps) => {
  const [didExplode, setDidExplode] = useState(false);
  const [isSmallExploding, setIsSmallExploding] = useState(false);

  if (didExplode) return null;

  return (
    <div className="size-5 absolute" style={style}>
      <img
        src={daCookie}
        {...props}
        key={[position.x, position.y].join("-")}
        className={cn(
          "absolute size-5 rounded-full cursor-pointer flex items-center justify-center text-white font-bold select-none",
          isEaten && "hidden"
        )}
        onClick={(event) => {
          onClick(event);
          setIsSmallExploding(true);
        }}
      />
      {isSmallExploding && (
        <ConfettiExplosion
          {...{
            force: 0.4,
            zIndex: 99,
            duration: 1200,
            particleCount: 15,
            width: 400,
          }}
          onComplete={() => {
            setDidExplode(true);
          }}
        />
      )}
    </div>
  );
};
