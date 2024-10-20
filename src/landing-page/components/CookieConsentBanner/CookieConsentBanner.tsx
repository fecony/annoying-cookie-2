import React, { useEffect, useRef, useState } from "react";
import { useGlitch } from "react-powerglitch";
import { IconInfinity, IconPray } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BeeTooltip } from "./BeeTooltip";
import { LazyImage } from "./LazyImage";
import { cn } from "@/lib/utils";
import LowCookieConsentMap from "@/assets/images/map_low.jpg";
import CookieConsentMap from "@/assets/images/map.jpeg";
import DaBeIsWatching from "@/assets/be.jpg";
import predefinedPositions from "./levelData.json";
import { DaCookieElement } from "./DaCookieElement";
import { Position } from "./types";

export const CookieConsentBanner = () => {
  const glitch = useGlitch({});

  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [itemPositions, setItemPositions] = useState<Position[]>([]);
  const [foundItems, setFoundItems] = useState<number[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [debugPositions, setDebugPositions] = useState<Position[]>([]); // Store clicked positions for debug

  useEffect(() => {
    if (isOpen) {
      const positionSet =
        predefinedPositions[
          Math.floor(Math.random() * predefinedPositions.length)
        ];

      console.log(
        `%cYay, only %c%d %ccookies to accept! What a treat. Thanks, like you had a choice! 🙃`,
        "color: #00aaff; font-weight: bold;",
        "color: #ff4500; font-weight: bold; font-size: 16px;",
        positionSet.length,
        "color: #00aaff;"
      );

      setItemPositions(positionSet);
      setFoundItems([]);
      setGameCompleted(false);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleItemClick = (item: number) => {
    if (!foundItems.includes(item)) {
      const newFoundItems = [...foundItems, item];
      setFoundItems(newFoundItems);

      if (newFoundItems.length === itemPositions.length) {
        setGameCompleted(true);
      }
    }
  };

  const handleZoom = (newZoom: number, centerX: number, centerY: number) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const zoomPoint = {
      x: (centerX - containerRect.left - pan.x) / zoom,
      y: (centerY - containerRect.top - pan.y) / zoom,
    };

    const newPan = {
      x: centerX - containerRect.left - zoomPoint.x * newZoom,
      y: centerY - containerRect.top - zoomPoint.y * newZoom,
    };

    setZoom(newZoom);
    setPan(constrainPan(newPan, newZoom));
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // const rect = containerRef.current.getBoundingClientRect();
    // const x = event.clientX - rect.left;
    // const y = event.clientY - rect.top;

    const delta = -event.deltaY;
    const zoomFactor = 0.1;
    const newZoom = Math.max(
      1,
      Math.min(zoom * (1 + Math.sign(delta) * zoomFactor), 5)
    );

    handleZoom(newZoom, event.clientX, event.clientY);
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newZoom = Math.min(zoom * 2, 5);
    handleZoom(newZoom, event.clientX, event.clientY);
  };

  const constrainPan = (newPan: Position, currentZoom: number) => {
    if (!containerRef.current || !imageRef.current) return { x: 0, y: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    const scaledImageWidth = imageRect.width * currentZoom;
    const scaledImageHeight = imageRect.height * currentZoom;

    // Calculate limits for panning
    const minX = containerRect.width - scaledImageWidth; // right limit
    const maxX = 0; // left limit
    const minY = containerRect.height - scaledImageHeight; // bottom limit
    const maxY = 0; // top limit

    // Constrain the x and y positions
    const constrainedX = Math.min(maxX, Math.max(newPan.x, minX));
    const constrainedY = Math.min(maxY, Math.max(newPan.y, minY));

    return {
      x: constrainedX,
      y: constrainedY,
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newPan = {
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      };
      setPan(constrainPan(newPan, zoom));
    }
  };

  const handleDraggingOff = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      const touch = event.touches[0];
      const newPan = {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      };
      setPan(constrainPan(newPan, zoom));
    }
  };

  const handleDebugClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    if (isCtrlOrCmd) {
      const x = (event.clientX - rect.left - pan.x) / zoom;
      const y = (event.clientY - rect.top - pan.y) / zoom;

      const newPosition = { x: x - 10, y: y - 10 };
      setDebugPositions((prev) => [...prev, newPosition]);
    }
  };

  return (
    <Card className="fixed bottom-4 md:right-4 md:max-w-md max-w-full md:m-0 m-2">
      <CardHeader>
        <CardTitle>
          🍪 We like cookies! Do you?{" "}
          <span className="text-sm text-muted">(Of course you do!)</span> 🍪
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600">
          Let's be honest — you probably won't read this. We use cookies to make
          things run smoothly, track your every click, and pretend we care about
          your preferences. But don't worry, whether you allow them or not...
          we'll just keep doing our thing.
        </p>
      </CardContent>

      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild className="w-full">
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Manage Cookies <IconPray />
            </Button>
          </DialogTrigger>

          <DialogContent
            className={cn(gameCompleted ? "max-w-lg w-auto" : "max-w-5xl")}
          >
            <DialogHeader>
              <DialogTitle>Da Cookie consent</DialogTitle>
            </DialogHeader>

            {!gameCompleted ? (
              <>
                <div
                  className="relative overflow-hidden cursor-move"
                  // style={{ height: "70vh" }}
                  style={{
                    height: "70vh",
                    backgroundImage: `url(${DaBeIsWatching})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "300px auto", // Adjust this value to make the image smaller
                    backgroundPosition: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.5)", // Add a semi-transparent white overlay
                    backgroundBlendMode: "overlay", // Blend the background image with the overlay
                  }}
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleDraggingOff}
                  onMouseLeave={handleDraggingOff}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleDraggingOff}
                  onWheel={handleWheel}
                  onDoubleClick={handleDoubleClick}
                  onClick={handleDebugClick}
                >
                  <div
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformOrigin: "0 0",
                      transition: isDragging
                        ? "none"
                        : "transform 0.1s ease-out",
                      willChange: "transform",
                    }}
                  >
                    <LazyImage
                      className="select-none"
                      ref={imageRef}
                      placeholderSrc={LowCookieConsentMap}
                      src={CookieConsentMap}
                      width={3943}
                      height={5000}
                      alt="Where's Da Cookie Scene"
                      draggable="false"
                    />

                    {itemPositions.map((position, index) => (
                      <DaCookieElement
                        key={[position.x, position.y].join("-")}
                        position={position}
                        isEaten={foundItems.includes(index)}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleItemClick(index);
                        }}
                        style={{
                          left: `${position.x}px`,
                          top: `${position.y}px`,
                        }}
                      />
                    ))}
                    {/* <img
                      className="select-none"
                      src={DaBeIsWatching}
                      width={700}
                      alt="Be is watching."
                      draggable="false"
                    /> */}
                  </div>
                </div>

                <div className="flex justify-between flex-col md:flex-row space-y-2 md:space-y-0 items-center">
                  <p className="text-sm text-gray-600 italic">
                    Can't see anything? Just use your mouse wheel or
                    double-click. Or, you know, consult your crystal ball!
                  </p>
                  <span className="text-sm flex space-x-2 items-center">
                    <BeeTooltip />
                    Agreed to: {foundItems.length}
                    {" / "}
                    <span ref={glitch.ref}>
                      <IconInfinity />
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <DialogFooter>
                <div className="w-full space-y-4">
                  <p>
                    Oh, look at you, cookie connoisseur! Thanks for granting us
                    permission to track your every click! We promise to use your
                    data for, um, absolutely nothing sinister... probably.
                    {/* {JSON.stringify(debugPositions)} */}
                  </p>

                  <p>Enjoy your browsing!</p>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Continue
                  </Button>
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
