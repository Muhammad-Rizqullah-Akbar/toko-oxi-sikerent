// components/products/ProductCard.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Definisikan tipe untuk data produk yang akan diterima sebagai props
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl }) => {
  // Format harga menjadi mata uang Rupiah (contoh)
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

  return (
    // Gunakan Link dari Next.js untuk navigasi ke halaman detail produk
    <Link href={`/product/${id}`} className="block group border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
      
      {/* Area Gambar Produk (sesuai wireframe) */}
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={imageUrl}
          alt={`Gambar Produk ${name}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {/* Placeholder untuk ikon 'love/wishlist' (lihat wireframe) */}
        <div className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md">
          {/* Ikon Heart Placeholder */}
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </div>
      </div>

      {/* Detail Produk */}
      <div className="p-3">
        {/* Nama Produk */}
        <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600">
          {name}
        </h3>
        {/* Harga Produk */}
        <p className="mt-1 text-base font-bold text-indigo-700">
          {formattedPrice}
        </p>
      </div>

    </Link>
  );
};

export default ProductCard;