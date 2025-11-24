// components/ui/CategoryCard.tsx
import React from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  slug: string;
  isActive: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, slug, isActive }) => {
  // Jika slug 'all', link ke root. Jika tidak, link ke query param
  const href = slug === 'all' ? '/' : `/?category=${slug}`;

  return (
    <Link 
      href={href}
      className={`
        flex-shrink-0 w-32 h-24 sm:h-28 bg-white border rounded-xl shadow-sm p-3 text-center flex flex-col items-center justify-center
        transition-all duration-200 cursor-pointer group
        ${isActive 
            ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50' 
            : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
        }
      `}
    >
      {/* Icon Placeholder (Bisa diganti icon dinamis nanti) */}
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full mb-2 flex items-center justify-center text-sm font-bold
        ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
      `}>
        {name.charAt(0)}
      </div>
      
      {/* Nama Kategori */}
      <span className={`text-xs sm:text-sm font-medium line-clamp-2
        ${isActive ? 'text-indigo-700' : 'text-gray-700 group-hover:text-indigo-600'}
      `}>
        {name}
      </span>
    </Link>
  );
};

export default CategoryCard;