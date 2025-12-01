// app/admin/point-reward/page.tsx

'use client'; 
import React, { useState } from 'react';
import { Gift, Edit, Users, Search, BarChart } from 'lucide-react';

// Import Modals (Pastikan path ke komponen sudah benar)
import RewardPolicyModal from '../../../../components/ui/admin/RewardPolicyModal'; 
import EditMemberPointsModal from '../../../../components/ui/admin/EditMemberPointsModal'; 

// Mendefinisikan interface untuk data anggota (member)
interface Member {
    id: number;
    name: string;
    email: string;
    totalPoints: number;
    status: 'Active' | 'Inactive';
}

// Data mock untuk Anggota
const mockRewards: Member[] = [
    { id: 1, name: 'Adi Wibowo', email: 'adi@example.com', totalPoints: 12500, status: 'Active' },
    { id: 2, name: 'Siti Rahayu', email: 'siti@example.com', totalPoints: 500, status: 'Active' },
    { id: 3, name: 'Bambang Sudarso', email: 'bambang@example.com', totalPoints: 0, status: 'Inactive' },
    { id: 4, name: 'Clara Wijaya', email: 'clara@example.com', totalPoints: 3500, status: 'Active' },
    { id: 5, name: 'Doni Pratama', email: 'doni@example.com', totalPoints: 100, status: 'Inactive' },
];

export default function PointRewardPage() {
    // State untuk Modals
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null); // Member yang sedang diedit

    // State untuk Kebijakan Reward (Data mock yang bisa diupdate oleh modal)
    const [rewardPolicy, setRewardPolicy] = useState({
        earningRate: 1, 
        redemptionRate: 10000, 
        minRedeem: 500
    });

    // Handler untuk membuka modal Edit Poin Anggota
    const handleEditMemberPoints = (member: Member) => {
        setSelectedMember(member);
        setIsEditMemberModalOpen(true);
    };
    
    return (
        <div>
            
            {/* Kartu Ringkasan Reward */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Member Aktif</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">158</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <Gift className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Poin Terkumpul</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">18,250</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                        <BarChart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Poin Ditukar (Bulan Ini)</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">2,500</h3>
                    </div>
                </div>
            </div>

            {/* Kebijakan dan Pencarian Member */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Kelola Poin Member</h3>

                {/* Display Kebijakan Aktif */}
                <div className="mb-6 p-4 border-l-4 border-indigo-500 bg-indigo-50 text-sm text-gray-700">
                    <p className='font-semibold'>Kebijakan Aktif:</p>
                    <ul className='mt-1 list-disc list-inside'>
                        <li>Perolehan: {rewardPolicy.earningRate} Poin per Rp 1.000</li>
                        <li>Nilai Tukar: Rp {rewardPolicy.redemptionRate.toLocaleString()} untuk 100 Poin</li>
                        <li>Minimun Tukar: {rewardPolicy.minRedeem.toLocaleString()} Poin</li>
                    </ul>
                </div>

                {/* Search Bar dan Tombol Aksi */}
                <div className="flex justify-between items-center mb-4 space-x-4">
                    <div className="relative flex-grow max-w-sm">
                        <input
                            type="text"
                            placeholder="Cari nama atau email member..."
                            className="w-full border p-2 pl-10 text-sm rounded-lg bg-gray-50"
                        />
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {/* Tombol yang MEMBUKA MODAL KEBIJAKAN */}
                    <button 
                        onClick={() => setIsPolicyModalOpen(true)}
                        className="bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Edit Kebijakan Reward</span>
                    </button>
                </div>

                {/* Tabel Daftar Member */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Poin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockRewards.map((member) => (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{member.totalPoints.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {/* Tombol yang MEMBUKA MODAL EDIT MEMBER */}
                                        <button 
                                            onClick={() => handleEditMemberPoints(member)}
                                            className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit Poin</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. MODAL UTAMA: Edit Kebijakan Reward */}
            <RewardPolicyModal 
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                currentPolicy={rewardPolicy}
                onPolicySave={(newPolicy) => setRewardPolicy(newPolicy)}
            />
            
            {/* 4. MODAL UTAMA: Edit Poin Anggota */}
            <EditMemberPointsModal 
                isOpen={isEditMemberModalOpen}
                onClose={() => setIsEditMemberModalOpen(false)}
                member={selectedMember}
            />
        </div>
    );
}