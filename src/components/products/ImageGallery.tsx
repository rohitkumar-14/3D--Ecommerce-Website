'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  dataAiHint?: string;
}

export function ImageGallery({ images, productName, dataAiHint }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <Card className="aspect-square w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No image available</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden relative aspect-square w-full shadow-md">
        <Image
          src={selectedImage}
          alt={`${productName} - selected view`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-opacity duration-300"
          priority // Prioritize loading of the main image
          data-ai-hint={dataAiHint || 'product image'}
        />
      </Card>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <Card
              key={index}
              className={cn(
                "overflow-hidden aspect-square cursor-pointer transition-all duration-200 hover:opacity-100 hover:ring-2 hover:ring-primary",
                selectedImage === image ? "ring-2 ring-primary opacity-100" : "opacity-70 ring-0"
              )}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`${productName} - thumbnail ${index + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                  data-ai-hint={dataAiHint ? `${dataAiHint} thumbnail` : 'product thumbnail'}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
