// app/(admin)/dashboard/point-reward/page.tsx

'use client'; 
import React, { useState, useEffect } from 'react';
import { Gift, Edit, Users, Search, BarChart, Loader2 } from 'lucide-react';

// Import Actions Database
import { getMembersForReward, getRewardPolicy, updateMemberPoints, updateRewardPolicy } from '@/app/actions/admin/reward';

// Import Modals
import RewardPolicyModal from '@/components/ui/admin/RewardPolicyModal'; 
import EditMemberPointsModal from '@/components/ui/admin/EditMemberPointsModal'; 

// Tipe data member
type Member = {
    id: string;
    name: string;
    email: string | null;
    whatsapp?: string | null; // Tambahkan ini biar aman kalau ada data WA
    totalPoints: number;
    isActive: boolean;
};

type Policy = {
    earningRate: number;
    redemptionRate: number;
    minRedeem: number;
};

export default function PointRewardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [members, setMembers] = useState<Member[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // State Policy
    const [rewardPolicy, setRewardPolicy] = useState<Policy>({
        earningRate: 0, 
        redemptionRate: 0, 
        minRedeem: 0
    });

    // State Modals
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    // 1. FETCH DATA SAAT MOUNT
    useEffect(() => {
        fetchData();
    }, []);

    // 2. FILTER PENCARIAN
    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = members.filter(m => 
            m.name.toLowerCase().includes(lowerTerm) || 
            (m.email && m.email.toLowerCase().includes(lowerTerm)) ||
            (m.whatsapp && m.whatsapp.toLowerCase().includes(lowerTerm))
        );
        setFilteredMembers(filtered);
    }, [searchTerm, members]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [fetchedMembers, fetchedPolicy] = await Promise.all([
                getMembersForReward(),
                getRewardPolicy()
            ]);
            // Pastikan data member sesuai tipe (handle null values)
            setMembers(fetchedMembers as unknown as Member[]);
            setFilteredMembers(fetchedMembers as unknown as Member[]);
            
            if(fetchedPolicy) {
                setRewardPolicy({
                    earningRate: fetchedPolicy.earningRate,
                    redemptionRate: fetchedPolicy.redemptionRate,
                    minRedeem: fetchedPolicy.minRedeem
                });
            }
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler Save Policy
    const handlePolicySave = async (newPolicy: Policy) => {
        await updateRewardPolicy(newPolicy);
        setRewardPolicy(newPolicy);
        setIsPolicyModalOpen(false);
        alert("Kebijakan reward berhasil diperbarui.");
    };

    // Handler Save Member Points (INTEGRASI UTAMA)
    const handleMemberPointsSave = async (newPoints: number) => {
        if (!selectedMember) return;
        
        // Panggil Server Action
        const result = await updateMemberPoints(selectedMember.id, newPoints);
        
        if (result.success) {
            // Update state lokal biar UI langsung berubah tanpa refresh
            setMembers(prev => prev.map(m => 
                m.id === selectedMember.id ? { ...m, totalPoints: newPoints } : m
            ));
            setIsEditMemberModalOpen(false);
            // alert("Poin berhasil diperbarui!"); // Optional
        } else {
            alert("Gagal menyimpan: " + result.error);
        }
    };

    // Statistik Sederhana
    const totalPointsSystem = members.reduce((acc, curr) => acc + curr.totalPoints, 0);

    return (
        <div>
            {/* Kartu Ringkasan Reward */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Member</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{members.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <Gift className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Poin Beredar</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalPointsSystem.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                        <BarChart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Rate Konversi</p>
                        <h3 className="text-xl font-bold text-gray-900 mt-1">Rp {rewardPolicy.redemptionRate.toLocaleString()}/100 Poin</h3>
                    </div>
                </div>
            </div>

            {/* Konten Utama */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">Kelola Poin Member</h3>
                    
                    <button 
                        onClick={() => setIsPolicyModalOpen(true)}
                        className="bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-sm"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Setting Reward</span>
                    </button>
                </div>

                {/* Display Kebijakan Aktif */}
                <div className="mb-6 p-4 border-l-4 border-indigo-500 bg-indigo-50 text-sm text-gray-700 rounded-r-lg">
                    <p className='font-bold text-indigo-800 mb-1'>Aturan Poin Saat Ini:</p>
                    <ul className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                        <li>• Dapat <b>{rewardPolicy.earningRate} Poin</b> setiap belanja Rp 1.000</li>
                        <li>• Tukar <b>100 Poin</b> jadi diskon <b>Rp {rewardPolicy.redemptionRate.toLocaleString()}</b></li>
                        <li>• Min. Tukar: <b>{rewardPolicy.minRedeem.toLocaleString()} Poin</b></li>
                    </ul>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau whatsapp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 pl-10 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>

                {/* Tabel Daftar Member */}
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Member</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Poin</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center gap-2 text-gray-500">
                                            <Loader2 className="w-5 h-5 animate-spin" /> Memuat data member...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                                        Tidak ada member ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{member.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {member.email || member.whatsapp || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-yellow-200">
                                                {member.totalPoints.toLocaleString()} Poin
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button 
                                                onClick={() => {
                                                    setSelectedMember(member);
                                                    setIsEditMemberModalOpen(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors flex items-center space-x-1"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                <span>Atur Poin</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Kebijakan */}
            <RewardPolicyModal 
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                currentPolicy={rewardPolicy}
                onPolicySave={handlePolicySave}
            />
            
            {/* MODAL EDIT POIN - Terintegrasi */}
            <EditMemberPointsModal 
                isOpen={isEditMemberModalOpen}
                onClose={() => setIsEditMemberModalOpen(false)}
                member={selectedMember} 
                onSave={handleMemberPointsSave} 
            />
        </div>
    );
}