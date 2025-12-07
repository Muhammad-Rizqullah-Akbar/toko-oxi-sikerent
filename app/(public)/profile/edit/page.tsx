// app/(public)/profile/edit/page.tsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import EditProfileForm from '@/components/profile/EditProfileForm'; // Sudah dibuat di step 2
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id }
  });

  if (!customer) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/profile" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Profil</h1>
            <p className="text-slate-600 text-sm">Perbarui informasi kontak Anda</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <EditProfileForm customer={customer} />
        </div>
      </div>
    </div>
  );
}