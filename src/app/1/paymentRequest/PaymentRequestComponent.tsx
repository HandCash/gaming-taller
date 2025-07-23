'use client'

import { Payment } from "@/types";
import { useQRCode } from "next-qrcode";
import { useEffect } from "react";
import { useState } from "react";


const paymentRequestUrl = 'https://pay.handcash.io/687ebf58d7922bf632eaad46';


export default function PaymentRequestComponent() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const { Canvas } = useQRCode();

    useEffect(() => {
        const fetchPayments = async () => {
            const response = await fetch('/api/payments?tag=avatar');
            if (response.ok) {
                const data = await response.json();
                setPayments(data.items);
            }
        };
        fetchPayments();
        const interval = setInterval(fetchPayments, 2000);
        return () => clearInterval(interval);
    }, []);

    const getReceiversString = (payment: Payment) => {
        if (payment.receivers.length === 1) {
            return `${payment.receivers[0].username}`;
        }
        return `${payment.receivers.length} personas`;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 my-12">
            <div className="flex flex-col items-center gap-4 w-full lg:w-1/3">
                <p className="text-lg font-semibold tracking-tighter uppercase">Compra tu avatar</p>
                <div className="rounded-lg overflow-hidden">
                    <a href={paymentRequestUrl} target="_blank" rel="noopener noreferrer">
                        <Canvas
                            text={paymentRequestUrl}
                            options={{
                                errorCorrectionLevel: 'M',
                                margin: 0,
                                scale: 4,
                                width: 400,
                                color: {
                                    dark: '#000000FF',
                                    light: '#FFFFFFFF',
                                },
                            }}
                        />
                    </a>
                </div>
                <p className="text-lg font-semibold tracking-tighter uppercase">Escanea para pagar</p>
            </div>
            <div className="border-b lg:border-b-0 lg:border-r border-gray-200"></div>
            <div className="flex flex-col gap-4 w-full lg:w-2/3 px-6">
                {/* <h2 className="text-xl font-semibold">Pagos recientes</h2>
                {payments.length === 0 && (
                    <p className="text-gray-500">No hay pagos aún. Sé el primero en pagar!</p>
                )} */}
                <p className="text-lg font-semibold text-green-600">Avatares comprados</p>
                {payments.length === 0 && (
                    <p className="text-gray-500">No hay pagos aún. Sé el primero en comprar un avatar!</p>
                )}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {payments.map((payment) => (
                        <a href={`https://whatsonchain.com/tx/${payment.transactionId}`} key={payment.transactionId} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="px-4 py-3">
                                <div className="flex flex-col items-center gap-2">
                                    <img
                                        src={`https://api.dicebear.com/9.x/personas/svg?seed=${payment.transactionId}`}
                                        alt={`${payment.sender.username} avatar`}
                                        className="w-328 h-32 rounded-full border-2 border-gray-200 shadow-lg group-hover:border-green-400"
                                    />
                                    <p className="w-full text-center group-hover:text-green-600"><b>${payment.sender.username}</b></p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div >
    );
}
