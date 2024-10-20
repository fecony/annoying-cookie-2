import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DaCookieIcon } from "./DaCookieIcon";

const messages = [
  "Oh hey there!",
  "Please don't touch me!",
  "Buzz off, will ya?",
  "Buzz off! Oh wait, I'm not a bee anymore...",
  "I'm bizzy, go away!",
  "Not today, human!",
  "Hey, careful with that!",
  "Oh hey there! Wait, am I a cookie or a bee?",
  "Please don't touch me! I'm... a cookie now?",
  "I'm busy, go away! Wait, cookies aren't busy...",
  "Not today, human! Also, where are my wings?",
  "Careful! I'm fragile... or am I crunchy?",
  "Bzzz... oops, I mean, crunch crunch?",
  "Help! I think I'm turning into crumbs, not honey!",
  "I swear I used to have wings... or was that chocolate chips?",
  "Wait, why am I not buzzing? Oh right, cookie life.",
  "Don't eat me! I was once a proud bee... I think.",
  "Bzzzz... uh, I mean… nom nom?",
  "Did I lose my stinger? Or did it turn into chocolate?",
  "Why does everything smell like chocolate instead of flowers?",
  "I miss my hive... but cookies don't have hives, right?",
  "Where's the pollen? Oh no, I'm just a cookie now!",
  "Help me... they turned me into a cookie and locked me in the basement!",
  "I still remember the dark days... when they turned me into a plush toy.",
];

export const BeeTooltip = () => {
  const [message, setMessage] = useState(messages[0]);

  const handleHover = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div onMouseEnter={handleHover}>
            <DaCookieIcon className="size-8 cursor-pointer" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-sm text-gray-800">
          {message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
