'use client'; // Wajib Client Component biar bisa klik-klik

import React, { useState } from 'react';

interface ProductInfoTabsProps {
  description: string | null;
  specifications: string | null;
}

export default function ProductInfoTabs({ description, specifications }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'spec'>('detail');

  return (
    <div className="mt-8">
      {/* HEADER TABS */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('detail')}
            className={`pb-3 font-medium text-sm transition-colors relative ${
              activeTab === 'detail' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Detail Produk
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`pb-3 font-medium text-sm transition-colors relative ${
              activeTab === 'spec' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Spesifikasi
          </button>
        </div>
      </div>

      {/* ISI KONTEN */}
      <div className="prose prose-sm text-gray-600 max-w-none min-h-[100px]">
        {activeTab === 'detail' ? (
          <div>
            {description ? (
              <p className="whitespace-pre-line leading-relaxed">{description}</p>
            ) : (
              <p className="text-gray-400 italic">Tidak ada deskripsi detail.</p>
            )}
          </div>
        ) : (
          <div>
            {specifications ? (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="whitespace-pre-line font-mono text-sm">{specifications}</p>
              </div>
            ) : (
              <p className="text-gray-400 italic">Belum ada data spesifikasi.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}