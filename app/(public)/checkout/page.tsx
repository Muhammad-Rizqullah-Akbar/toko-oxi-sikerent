"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { QRCodeCanvas } from "qrcode.react"; // Library QR Code
import { 
  Upload, Clock, Copy, FileText, 
  Calendar, ChevronLeft, AlertCircle, CheckCircle2, Loader2, Smartphone, Building2 
} from "lucide-react";
import { processCheckout } from "@/app/actions/checkout"; 

// --- TYPE DEFINITIONS ---
type PaymentMethod = {
  id: string;
  name: string;
  number: string; // Untuk VA atau Rekening
  owner: string;
  type: "BANK" | "EWALLET" | "QRIS" | "VA";
  logo: string;
  isAutomatic: boolean; 
};

// Sesuaikan dengan data dari useCart
type CartItem = {
  id: string; 
  name: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
  // Asumsi data durasi/kualitas sudah masuk di nama/kategori atau field lain dari cart
  duration?: string; 
  quality?: string;
};

// --- DATA DUMMY PAYMENT ---
const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
  { 
    id: "1", name: "Bank BCA", number: "1234567890", owner: "Toko OXI", 
    type: "BANK", logo: "/logos/bca.png", isAutomatic: false 
  },
  { 
    id: "2", name: "QRIS (Instan)", number: "eqi ganteng", owner: "OXI Payment", 
    type: "QRIS", logo: "/logos/qris.png", isAutomatic: true 
  },
  { 
    id: "3", name: "Mandiri VA", number: "880129384756", owner: "OXI Virtual", 
    type: "VA", logo: "/logos/mandiri.png", isAutomatic: true 
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart(); 
  const [mounted, setMounted] = useState(false);

  // State Form & Logic
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [uniqueCode, setUniqueCode] = useState(0);
  const [senderName, setSenderName] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(AVAILABLE_PAYMENT_METHODS[0]);
  const [designFiles, setDesignFiles] = useState<{ [key: string]: File }>({});
  
  // State Loading Simulasi
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationStep, setSimulationStep] = useState(""); 

  useEffect(() => {
    setMounted(true);
    // Kode unik hanya untuk transfer manual
    setUniqueCode(Math.floor(Math.random() * 999) + 1);
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleDesignUpload = (itemId: string, file: File) => {
    setDesignFiles((prev) => ({ ...prev, [itemId]: file }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPrintingItem = (item: any) => {
    const category = item.category?.toLowerCase() || "";
    const name = item.name.toLowerCase();
    return category.includes("cetak") || category.includes("printing") || name.includes("spanduk");
  };

  const handlePay = async () => {
    setIsProcessing(true);

    try {
      // 1. Simulasi Payment Gateway (QRIS / VA)
      if (selectedPayment.isAutomatic) {
        setSimulationStep("CONNECTING");
        await new Promise(r => setTimeout(r, 1500)); 

        setSimulationStep("VERIFYING");
        await new Promise(r => setTimeout(r, 2000)); 

        setSimulationStep("SUCCESS");
        await new Promise(r => setTimeout(r, 1000)); 
      }

      // 2. Siapkan Payload
      const payload = {
        senderName: selectedPayment.isAutomatic ? "System (Auto)" : senderName,
        proofImage: selectedPayment.isAutomatic ? "INSTANT_PAYMENT" : (proofFile?.name || "manual-upload"), 
        // Jika Otomatis -> Harga Pas. Jika Manual -> Harga + Kode Unik
        totalAmount: selectedPayment.isAutomatic ? totalPrice() : totalPrice() + uniqueCode,
        paymentMethod: selectedPayment.name,
        items: items.map(item => ({
          id: item.id, 
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          fileUrl: designFiles[item.id] ? "file-uploaded" : ""
        }))
      };

      // 3. Eksekusi Server Action
      const result = await processCheckout(payload);

      if (result.success) {
        alert("Transaksi Berhasil Dibuat!"); 
        router.push("/"); // Idealnya ke halaman /success/[orderId]
      } else {
        alert("Gagal memproses pesanan.");
      }

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsProcessing(false);
      setSimulationStep("");
    }
  };

  if (!mounted) return null;
  if (items.length === 0) return null;

  // LOGIKA HARGA AKHIR
  const totalBarang = totalPrice();
  // Kode unik = 0 jika pembayaran otomatis (QRIS/VA biasanya nominal pas)
  const appliedUniqueCode = selectedPayment.isAutomatic ? 0 : uniqueCode;
  const grandTotal = totalBarang + appliedUniqueCode;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 relative">
      
      {/* --- OVERLAY SIMULASI GATEWAY --- */}
      {isProcessing && selectedPayment.isAutomatic && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                {simulationStep === 'CONNECTING' && (
                    <>
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4"/>
                        <h3 className="text-lg font-bold text-slate-800">Menghubungkan ke {selectedPayment.name}...</h3>
                        <p className="text-slate-500 text-sm mt-2">Jangan tutup halaman ini</p>
                    </>
                )}
                {simulationStep === 'VERIFYING' && (
                    <>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Clock className="w-6 h-6 text-yellow-600"/>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Cek Status Pembayaran...</h3>
                        <p className="text-slate-500 text-sm mt-2">Mendeteksi dana masuk...</p>
                    </>
                )}
                {simulationStep === 'SUCCESS' && (
                    <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600"/>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Lunas!</h3>
                        <p className="text-slate-500 text-sm mt-2">Terima kasih, Eqi Ganteng!</p>
                    </>
                )}
            </div>
        </div>
      )}

      {/* --- HEADER STICKY --- */}
      <div className="sticky top-0 z-40 bg-indigo-600 text-white py-3 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/cart" className="flex items-center text-sm hover:underline opacity-90">
            <ChevronLeft size={16} className="mr-1" /> Kembali
          </Link>
          <div className="flex items-center font-bold bg-white/20 px-4 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm animate-pulse">
            <Clock size={16} className="mr-2" />
            Bayar dalam {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Review Pesanan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-700">1. Rincian Pesanan</h2>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="p-6 border-b border-slate-100 last:border-0 flex flex-col sm:flex-row gap-6">
                <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                   <Image 
                     src={item.imageUrl || "/images/placeholder.jpg"} 
                     alt={item.name} 
                     fill 
                     className="object-cover"
                   />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                    <p className="font-bold text-slate-900 text-sm">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits:0 }).format(item.price * item.quantity)}
                    </p>
                  </div>
                  
                  {/* Keterangan Harga (Durasi / Kualitas) - Statis dari Cart */}
                  <div className="text-xs text-slate-500 mb-3 space-y-1">
                      <p>{item.quantity} x {item.price.toLocaleString("id-ID")}</p>
                      {/* Jika ada data durasi di cart (optional) */}
                      {item.category?.includes('rental') && <p className="text-blue-600">• Durasi Sewa Sesuai Pilihan</p>}
                  </div>

                  {isPrintingItem(item) ? (
                    <div className="mt-2">
                      <label className={`flex flex-col w-full border-2 border-dashed rounded-lg p-3 cursor-pointer transition group ${designFiles[item.id] ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}>
                        <div className="flex items-center justify-center gap-3">
                           {designFiles[item.id] ? (
                             <>
                               <FileText size={20} className="text-green-600"/>
                               <div className="text-left overflow-hidden">
                                    <p className="text-xs font-bold text-green-700 truncate max-w-[200px]">{designFiles[item.id].name}</p>
                                    <p className="text-[10px] text-green-600">File siap dicetak</p>
                               </div>
                             </>
                           ) : (
                             <>
                                <Upload size={18} className="text-slate-400 group-hover:text-indigo-500"/>
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600">Upload Desain</p>
                                    <p className="text-[10px] text-slate-400">Pastikan kualitas High Res</p>
                                </div>
                             </>
                           )}
                        </div>
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files && handleDesignUpload(item.id, e.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 w-fit">
                      <Calendar size={14} className="mr-2 text-blue-500" />
                      <span>Sewa Barang (Siap Pakai)</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 2. Metode Pembayaran */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="font-bold text-slate-700">2. Metode Pembayaran</h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">Otomatis Cek</span>
            </div>
            
            <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {AVAILABLE_PAYMENT_METHODS.map((method) => (
                        <div 
                            key={method.id}
                            onClick={() => setSelectedPayment(method)}
                            className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all relative overflow-hidden ${selectedPayment.id === method.id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            {method.isAutomatic && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                                    AUTO
                                </div>
                            )}

                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-[10px] font-bold text-slate-600 shadow-sm shrink-0 overflow-hidden">
                                {method.name.substring(0,3)}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-800">{method.name}</p>
                                <p className="text-xs text-slate-500">{method.type}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    {/* TAMPILAN KHUSUS QRIS (GENERATE QR) */}
                    {selectedPayment.type === 'QRIS' && (
                         <div className="flex flex-col items-center justify-center text-center">
                             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
                                {/* GENERATE QR CODE DISINI */}
                                <QRCodeCanvas 
                                    value={selectedPayment.number} // Value: "eqi ganteng"
                                    size={180}
                                    level={"H"}
                                    includeMargin={true}
                                />
                             </div>
                             <p className="font-bold text-slate-800 text-lg">Scan QRIS</p>
                             <p className="text-sm text-slate-500 mb-4">NMID: ID123456789 • {selectedPayment.owner}</p>
                             <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full animate-pulse">
                                Menunggu scan...
                             </div>
                         </div>
                    )}

                    {/* TAMPILAN KHUSUS VA (SIMULASI NUMBER) */}
                    {selectedPayment.type === 'VA' && (
                         <div className="flex flex-col items-center text-center py-2">
                             <Building2 className="w-10 h-10 text-indigo-600 mb-3" />
                             <p className="text-sm text-slate-500 mb-1">Nomor Virtual Account (Mandiri)</p>
                             <div className="flex items-center gap-3 bg-white border border-slate-300 px-4 py-2 rounded-lg mb-4 shadow-sm">
                                 <span className="text-2xl font-mono font-bold text-slate-800 tracking-widest">
                                    {selectedPayment.number}
                                 </span>
                                 <button onClick={() => navigator.clipboard.writeText(selectedPayment.number)} className="text-indigo-600 hover:text-indigo-800 transition">
                                    <Copy size={18} />
                                 </button>
                             </div>
                             <p className="text-xs text-slate-400">Pembayaran akan terverifikasi otomatis dalam 1-2 menit.</p>
                         </div>
                    )}

                    {/* TAMPILAN MANUAL (REKENING BIASA) */}
                    {selectedPayment.type === 'BANK' && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Transfer Manual BCA</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-mono font-bold text-slate-800 tracking-tight">{selectedPayment.number}</p>
                                    <button onClick={() => navigator.clipboard.writeText(selectedPayment.number)} className="text-indigo-600 p-1"><Copy size={16}/></button>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">a.n <strong>{selectedPayment.owner}</strong></p>
                            </div>
                            <div className="mt-4 flex items-start gap-2 text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-100">
                                <AlertCircle size={14} className="mt-0.5 shrink-0"/>
                                <p>PENTING: Mohon transfer <strong>tepat hingga 3 digit terakhir</strong> ({uniqueCode}).</p>
                            </div>
                        </div>
                    )}
                </div>
             </div>
           </div>
        </div>

        {/* --- KOLOM KANAN --- */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Konfirmasi Pembayaran</h2>
              
              <div className="space-y-3 mb-6 border-b border-slate-100 pb-6">
                <div className="flex justify-between text-slate-600 text-sm">
                   <span>Subtotal</span>
                   <span>Rp {totalBarang.toLocaleString("id-ID")}</span>
                </div>
                {/* Kode unik HANYA MUNCUL jika Manual Transfer */}
                {!selectedPayment.isAutomatic && (
                    <div className="flex justify-between text-indigo-600 text-sm font-medium bg-indigo-50 p-2 rounded">
                        <span>Kode Unik</span>
                        <span>+ Rp {uniqueCode}</span>
                    </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-8">
                 <span className="text-slate-600 font-medium">Total Tagihan</span>
                 <span className="text-2xl font-bold text-indigo-700">Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>

              {/* Form Manual Transfer Only */}
              {!selectedPayment.isAutomatic && (
                  <div className="space-y-4 mb-6">
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pengirim</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" value={senderName} onChange={(e) => setSenderName(e.target.value)}/>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Bukti Transfer</label>
                        <div className="relative">
                            <input type="file" id="proof" className="hidden" accept="image/*" onChange={(e) => e.target.files && setProofFile(e.target.files[0])} />
                            <label htmlFor="proof" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-indigo-400 text-slate-500">
                                {proofFile ? <span className="text-sm text-green-600 flex items-center"><CheckCircle2 size={16} className="mr-2"/> {proofFile.name}</span> : <span className="text-sm flex items-center"><Upload size={16} className="mr-2"/> Upload Struk</span>}
                            </label>
                        </div>
                     </div>
                  </div>
              )}

              <button 
                onClick={handlePay}
                disabled={isProcessing || (!selectedPayment.isAutomatic && (!proofFile || !senderName))}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 flex justify-center items-center ${selectedPayment.isAutomatic ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-300'}`}
              >
                 {isProcessing ? (
                    <Loader2 className="animate-spin" />
                 ) : selectedPayment.isAutomatic ? (
                    <span className="flex items-center"><Smartphone size={18} className="mr-2"/> Cek Pembayaran Otomatis</span>
                 ) : (
                    "Konfirmasi Transfer"
                 )}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}