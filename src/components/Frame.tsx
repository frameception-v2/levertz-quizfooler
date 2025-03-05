"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import * as THREE from 'three';
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

    // Three.js scene setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      antialias: true,
      preserveDrawingBuffer: true
    });
    
    // Responsive scene setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Basic particle system for initial effect
    const particles = new THREE.BufferGeometry();
    const particleCount = 1000;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({
      size: 0.005,
      color: 0xffffff
    });
    
    const points = new THREE.Points(particles, material);
    scene.add(points);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      points.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Responsive handler
    const resizeHandler = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', resizeHandler);

    // Frame interaction handler
    const interactionHandler = ({ x, y }: { x: number; y: number }) => {
      // Convert screen coords to WebGL normalized device coords
      const ndcX = (x / width) * 2 - 1;
      const ndcY = -(y / height) * 2 + 1;
      sdk.emit('FRAME_CLICK', { x: ndcX, y: ndcY });
    };

    // Mobile-friendly events
    canvas.addEventListener('click', (e) => interactionHandler({ 
      x: e.clientX, 
      y: e.clientY 
    }));
    
    canvas.addEventListener('touchstart', (e) => {
      interactionHandler({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    });

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.remove(points);
      particles.dispose();
      material.dispose();
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
          supportedHandlers: ['click', 'GESTURE', 'INPUT'],
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
