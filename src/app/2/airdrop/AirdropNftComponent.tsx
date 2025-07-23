'use client'

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Payment } from "@/types";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useQRCode } from "next-qrcode";
import { useEffect } from "react";
import { useState } from "react";


const paymentRequestUrl = 'https://market.handcash.io/connect?appId=686d0a689576a05abc4de93f';

export default function AirdropNftComponent() {
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
                <p className="text-lg font-semibold tracking-tighter uppercase">Recibe un NFT</p>
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
                <p className="text-lg font-semibold tracking-tighter uppercase">Escanea para recibir</p>
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {payments.map((payment) => (
                            <a href={`https://whatsonchain.com/tx/${payment.transactionId}`} key={payment.transactionId} target="_blank" rel="noopener noreferrer">
                                <Card key={payment.sender.username}>
                                    <div className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={payment.sender.avatarUrl}
                                                alt={`${payment.sender.username} avatar`}
                                                className="w-8 h-8 rounded-full border-2 border-gray-200"
                                            />
                                            <p className="w-full text-center"><b>${payment.sender.username}</b> ha pagado ${payment.usdAmount} a <b>${getReceiversString(payment)}</b></p>
                                            {payment.receivers.length === 1 && (
                                                <img
                                                    src={payment.receivers[0].avatarUrl}
                                                    alt={`${payment.receivers[0].username} avatar`}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                                                />
                                            )}
                                            {payment.receivers.length > 1 && (
                                                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                                                    <Avatar>
                                                        <AvatarImage src={payment.receivers[0].avatarUrl} />
                                                    </Avatar>
                                                    <Avatar>
                                                        <AvatarImage src={payment.receivers[1].avatarUrl} />
                                                    </Avatar>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
