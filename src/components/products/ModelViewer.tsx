
'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Orbit } from 'lucide-react';

// Define props for model-viewer specifically for TypeScript and React
// This helps with type checking and editor autocompletion.
// You might need to expand this with more model-viewer attributes as needed.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'ar'?: boolean;
        'ios-src'?: string; // For AR on iOS
        poster?: string; // Optional poster image
        style?: React.CSSProperties;
        // Add other model-viewer specific attributes here
      }, HTMLElement>;
    }
  }
}

interface ModelViewerProps {
  modelUrl: string;
  productName: string;
}

export function ModelViewer({ modelUrl, productName }: ModelViewerProps) {
  if (!modelUrl) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Orbit className="mr-2 h-5 w-5 text-primary" />
          3D Model Viewer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
          <model-viewer
            src={modelUrl}
            alt={`3D model of ${productName}`}
            camera-controls
            auto-rotate
            ar // Enable AR mode if supported
            style={{ width: '100%', height: '100%', minHeight: '400px' }}
            poster="https://placehold.co/600x400.png?text=Loading+3D+Model" // Generic poster
            data-ai-hint="3d model product" // This hint is for the poster image
          >
            <div slot="progress-bar" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground">
              Loading 3D model...
            </div>
          </model-viewer>
        </div>
      </CardContent>
    </Card>
  );
}
