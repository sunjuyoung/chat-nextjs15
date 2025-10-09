"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  fileNames: string[];
  productName: string;
}

export default function ProductImageGallery({
  fileNames,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 메인 이미지 */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-md">
        <Image
          src={`http://localhost:8080/${fileNames[selectedImageIndex]}`}
          alt={productName}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={true}
          className="rounded-lg"
        />
      </div>

      {/* 썸네일 이미지 목록 */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {fileNames.map((fileName, index) => (
          <div
            key={fileName}
            onClick={() => handleThumbnailClick(index)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-colors duration-200 ${
              selectedImageIndex === index
                ? "border-blue-500"
                : "border-transparent hover:border-blue-500"
            }`}
          >
            <Image
              src={`http://localhost:8080/s_${fileName}`}
              alt={`${productName} thumbnail ${fileName}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="50px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
