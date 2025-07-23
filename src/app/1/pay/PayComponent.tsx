'use client'

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Payment } from "@/types";
import { CircleCheck } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";


export default function PayComponent() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        const fetchPayments = async () => {
            const response = await fetch('/api/payments?tag=tip');
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

    const handlePayRandom = async () => {
        setIsPaying(true);
        const response = await fetch('/api/payments/pay/random');
        if (response.ok) {
            toast({
                description: <div className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-green-500" /> Pago enviado con éxito</div>,
                variant: 'success',
            });
        } else {
            toast({
                title: 'Error al pagar al azar',
                description: 'Intenta nuevamente',
                variant: 'destructive',
            });
        }
        setIsPaying(false);
    }

    const handlePayAll = async () => {
        setIsPaying(true);
        const response = await fetch('/api/payments/pay/all');
        if (response.ok) {
            toast({
                description: <div className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-green-500" /> Pago enviado con éxito</div>,
                variant: 'success',
            });
        } else {
            toast({
                title: 'Error al pagar a todos',
                description: 'Intenta nuevamente',
                variant: 'destructive',
            });
        }
        setIsPaying(false);
    }


    return (
        <div className="flex flex-col lg:flex-row gap-6 my-12">
            <div className="flex flex-col items-center gap-12 w-full lg:w-1/3 px-6">
                <div className="flex flex-col gap-2 w-full items-center">
                    <Button size="lg" className="w-full" onClick={handlePayRandom} disabled={isPaying}>{isPaying ? 'Pagando...' : 'Pago al azar'}</Button>
                    <p className="text-xs text-gray-500 text-center">Paga $0.01 a una persona al azar</p>
                </div>
                <div className="flex flex-col gap-2 w-full items-center">
                    <Button size="lg" className="w-full" onClick={handlePayAll} disabled={isPaying}>{isPaying ? 'Pagando...' : 'Pago a todos'}</Button>
                    <p className="text-xs text-gray-500 text-center">Paga un total de $0.05 a todos los que están conectados</p>
                </div>
            </div>
            <div className="border-b lg:border-b-0 lg:border-r border-gray-200"></div>
            <div className="flex flex-col gap-4 w-full lg:w-2/3 px-6">
                <h2 className="text-xl font-semibold text-green-600">Pagos recientes</h2>
                {payments.length === 0 && (
                    <p className="text-gray-500">No hay pagos aún. Sé el primero en pagar!</p>
                )}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {payments.map((payment) => (
                        <a href={`https://whatsonchain.com/tx/${payment.transactionId}`} target="_blank" key={payment.transactionId} rel="noopener noreferrer">
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
    );
}
