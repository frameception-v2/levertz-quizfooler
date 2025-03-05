"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

function ExampleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to the Frame Template</CardTitle>
        <CardDescription>
          This is an example card that you can customize or remove
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Label>Place content in a Card here.</Label>
      </CardContent>
    </Card>
  );
}

type CanvasFrameProps = {
  context?: Context.FrameContext;
};

function CanvasFrame({ context }: CanvasFrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    // Setup canvas dimensions based on device
    const pixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial frame rendering
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Add touch/click handler
    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e instanceof TouchEvent ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e instanceof TouchEvent ? e.touches[0].clientY : e.clientY) - rect.top;
      
      // Send interaction to frame handler
      sdk.interactions.send({
        type: 'CLICK',
        x,
        y,
        timestamp: Date.now()
      });
    };

    canvas.addEventListener('click', handleInteraction);
    canvas.addEventListener('touchstart', handleInteraction);

    return () => {
      canvas.removeEventListener('click', handleInteraction);
      canvas.removeEventListener('touchstart', handleInteraction);
    };
  }, [context]);

  return <canvas ref={canvasRef} />;
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  // Frame v2 initialization
  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.ready({
          version: 'v2',
          supportedHandlers: ['CLICK', 'GESTURE', 'INPUT'],
          canvasOptions: {
            preserveDrawingBuffer: true
          }
        });
        
        const context = await sdk.getContext();
        setContext(context);
        setIsSDKLoaded(true);

        // Handle frame updates
        sdk.onFrameUpdate((frameData) => {
          // Update canvas based on frame data
          console.log('Frame update:', frameData);
        });

      } catch (error) {
        console.error('Frame initialization failed:', error);
      }
    };

    initFrame();
    return () => sdk.destroy();
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
      className="flex flex-col h-full gap-4"
    >
      <CanvasFrame context={context} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 px-4 pb-4">
        {/* Option slots will be added here */}
        <div className="h-48 bg-neutral-100/50 rounded-xl backdrop-blur-sm"></div>
        <div className="h-48 bg-neutral-100/50 rounded-xl backdrop-blur-sm"></div>
      </div>
    </div>
  );
}
