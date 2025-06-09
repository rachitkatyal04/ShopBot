"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image_url);

  // Fallback placeholder image using a more reliable service
  const fallbackImage = `https://picsum.photos/400/400?random=${product.id}`;

  // If the image URL has the potentially problematic "unsplash.com/random" format,
  // preemptively use the fallback image instead
  useEffect(() => {
    if (
      product.image_url.includes("unsplash.com/random") ||
      !product.image_url
    ) {
      setImageSrc(fallbackImage);
    } else {
      setImageSrc(product.image_url);
    }
  }, [product.image_url, fallbackImage, product.id]);

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 hover:border-purple-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="animate-pulse h-16 w-16 rounded-full border-t-2 border-purple-400 animate-spin"></div>
          </div>
        )}
        <Image
          src={imageError ? fallbackImage : imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          onLoad={() => setImageLoaded(true)}
          loading="eager"
          priority={product.id < 200} // Prioritize loading for first few products
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        <div className="absolute bottom-2 right-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.stock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock > 0
              ? product.stock > 10
                ? "In Stock"
                : `Only ${product.stock} left`
              : "Out of Stock"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-300 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-white">
            $
            {typeof product.price === "number"
              ? product.price.toFixed(2)
              : parseFloat(product.price).toFixed(2)}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 ease-in-out hover:from-purple-400 hover:to-cyan-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.7)]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
