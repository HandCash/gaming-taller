'use client'

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CircleCheck, GiftIcon } from "lucide-react";
import router from "next/router";
import { useState } from "react";


type Params = {
    hasAnyBox: boolean
    isBoxOpen: boolean
}


export default function BurnNftComponent({ hasAnyBox, isBoxOpen }: Params) {
    const [isPaying, setIsPaying] = useState(false);

    const handleOpenBox = async () => {
        setIsPaying(true);
        const response = await fetch('/api/nfts/burn', { method: 'POST' });
        if (response.ok) {
            toast({
                description: <div className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-green-500" /> Has abierto la caja</div>,
                variant: 'success',
            });
            router.reload();
        } else {
            toast({
                title: 'Error al abrir la caja',
                description: 'Intenta nuevamente',
                variant: 'destructive',
            });
        }
        setIsPaying(false);
    }

    return (
        <div className="flex justify-center gap-6 my-12">
            {hasAnyBox && <div className="flex flex-col items-center max-w-lg">
                <GiftIcon className="h-20 w-20 mb-4" />
                <p>Abre tu caja misteriosa para ver su contenido.</p>
                <Button onClick={handleOpenBox} className="w-full mt-4" disabled={isPaying}>{isPaying ? 'Abriendo...' : 'Abrir Caja'}</Button>
            </div >}
            {isBoxOpen && <div>
                <p className="text-3xl font-bold text-green-600">🥳 Enhorabuena</p>
                <p>Has obtenido tu diploma del curso! Revisa tu billetera de HandCash</p>
            </div>}
        </div>
    );
}
