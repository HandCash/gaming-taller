'use client'

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { Nft } from "@/types";
import { IconArrowsShuffle } from "@tabler/icons-react";
import { CircleCheck } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

type AvatarProperty = 'clothesColor' | 'eyes' | 'hairColor' | 'top';

const clothesValues = ['DD0000', '00DD00', '0000EE', '888888', '000000', 'FFFFFF'];
const hairValues = ['DD0000', '00DD00', '0000EE', '888888', '000000', 'FFFFFF']
const topValues = ['frizzle', 'bob', 'bigHair', 'shaggy', 'theCaesar', 'dreads01'];
const eyesValues = ['default', 'closed', 'cry'];

export default function MintNftComponent() {
    const { user, loading } = useUser();
    const [mintedNfts, setMintedNfts] = useState<Nft[]>([]);
    const [avatarProperties, setAvatarProperties] = useState({
        'clothesColor': 'CC0000',
        'eyes': 'default',
        'hairColor': 'FF00AA',
        'top': 'frizzle',
    });
    const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/9.x/avataaars/svg');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            window.location.href = '/1/connect'
        }
    }, [loading, user]);

    useEffect(() => {
        generateRandomProperties();
    }, []);

    useEffect(() => {
        const queryParams = Object.entries(avatarProperties).map(([key, value]) => `${key}=${value}`).join('&');
        setAvatarUrl(`https://api.dicebear.com/9.x/avataaars/svg?${queryParams}`);
    }, [avatarProperties])

    useEffect(() => {
        const fetchPayments = async () => {
            const response = await fetch(`/api/nfts?i=${new Date().getTime()}`);
            if (response.ok) {
                const data = await response.json();
                setMintedNfts(data.items);
            }
        };
        fetchPayments();
        const interval = setInterval(fetchPayments, 2000);
        return () => clearInterval(interval);
    }, []);

    const generateRandomProperties = () => {
        setAvatarProperties({
            'clothesColor': clothesValues[Math.round(Math.random() * (clothesValues.length - 1))],
            'eyes': eyesValues[Math.round(Math.random() * (eyesValues.length - 1))],
            'hairColor': hairValues[Math.round(Math.random() * (hairValues.length - 1))],
            'top': topValues[Math.round(Math.random() * (topValues.length - 1))],
        });
    }

    const setAvatarProperty = (key: string, value: string) => {
        setAvatarProperties({
            ...avatarProperties,
            [key]: value
        });
    };

    const createAvatar = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/nfts/mint', {
                method: 'POST',
                body: JSON.stringify({
                    attributes: [
                        { name: 'clothesColor', value: '#' + avatarProperties['clothesColor'] },
                        { name: 'eyes', value: avatarProperties['eyes'] },
                        { name: 'hairColor', value: '#' + avatarProperties['hairColor'] },
                        { name: 'top', value: avatarProperties['top'] },
                    ],
                    mediaUrl: avatarUrl.replace('svg', 'png'),
                }),
            });
            if (response.ok) {
                toast({
                    description: <div className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-green-500" /> Avatar creado en la blockchain</div>,
                    variant: 'success',
                });
            } else {
                toast({
                    title: 'Error al crear avatar',
                    description: 'Intenta nuevamente',
                    variant: 'destructive',
                });
            }
        } finally {
            setLoading(false);
        }
    }

    const buildChip = ({ label, value, key }: { label: string; value: string; key: AvatarProperty }) => {
        return (
            <Button size="sm" variant={avatarProperties[key] === value ? 'default' : 'outline'} onClick={() => setAvatarProperty(key, value)}>{label}</Button>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 my-12">
            <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
                <p className="text-lg font-semibold tracking-tighter uppercase">Crea tu avatar</p>
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-center">
                        <img src={avatarUrl} width={100} height={100} className="w-32 h-32 rounded-full bg-gray-100" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-semibold">Color de Ropa</p>
                        <div className="flex space-x-1">
                            {buildChip({ label: 'Rojo', value: 'DD0000', key: 'clothesColor' })}
                            {buildChip({ label: 'Verde', value: '00DD00', key: 'clothesColor' })}
                            {buildChip({ label: 'Azul', value: '0000EE', key: 'clothesColor' })}
                            {buildChip({ label: 'Gris', value: '888888', key: 'clothesColor' })}
                            {buildChip({ label: 'Negro', value: '000000', key: 'clothesColor' })}
                            {buildChip({ label: 'Blanco', value: 'FFFFFF', key: 'clothesColor' })}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-semibold">Tipo de ojos</p>
                        <div className="flex space-x-1">
                            {buildChip({ label: 'Normal', value: 'default', key: 'eyes' })}
                            {buildChip({ label: 'Cerrados', value: 'closed', key: 'eyes' })}
                            {buildChip({ label: 'Llorando', value: 'cry', key: 'eyes' })}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-semibold">Tipo de pelo</p>
                        <div className="flex space-x-1">
                            {buildChip({ label: 'Tupé', value: 'frizzle', key: 'top' })}
                            {buildChip({ label: 'Bob', value: 'bob', key: 'top' })}
                            {buildChip({ label: 'Pelo Grande', value: 'bigHair', key: 'top' })}
                            {buildChip({ label: 'Lanudo', value: 'shaggy', key: 'top' })}
                            {buildChip({ label: 'Cesar', value: 'theCaesar', key: 'top' })}
                            {buildChip({ label: 'Rastas', value: 'dreads01', key: 'top' })}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-semibold">Color de pelo</p>
                        <div className="flex space-x-1">
                            {buildChip({ label: 'Rojo', value: 'DD0000', key: 'hairColor' })}
                            {buildChip({ label: 'Verde', value: '00DD00', key: 'hairColor' })}
                            {buildChip({ label: 'Azul', value: '0000EE', key: 'hairColor' })}
                            {buildChip({ label: 'Gris', value: '888888', key: 'hairColor' })}
                            {buildChip({ label: 'Negro', value: '000000', key: 'hairColor' })}
                            {buildChip({ label: 'Blanco', value: 'FFFFFF', key: 'hairColor' })}
                        </div>
                    </div>
                    <div className="flex space-x-4 pt-6 w-full">
                        <Button onClick={generateRandomProperties} disabled={isLoading} size={"lg"} variant="outline" className="w-1/2"><IconArrowsShuffle className="w-5 h-5 mr-2" /> Random</Button>
                        <Button onClick={createAvatar} disabled={isLoading} size={"lg"} variant="default" className="w-1/2 bg-green-600 hover:bg-green-700">{isLoading ? 'Creando Avatar' : 'Crear Avatar'}</Button>
                    </div>
                </div>
            </div>
            <div className="border-b lg:border-b-0 lg:border-r border-gray-200"></div>
            <div className="flex flex-col gap-4 w-full lg:w-1/2 px-6">
                <p className="text-lg font-semibold text-green-600">Avatares creados</p>
                {mintedNfts.length === 0 && (
                    <p className="text-gray-500">No hay avatares aún. Sé el primero en crear uno!</p>
                )}
                <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {mintedNfts.map((nft) => (
                        <a href={`https://whatsonchain.com/tx/${nft.transactionId}`} key={nft.origin} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="px-4 py-3">
                                <div className="flex flex-col items-center gap-2">
                                    <img
                                        src={`${nft.mediaUrl}`}
                                        alt={`${nft.origin} avatar`}
                                        className="w-328 h-32 rounded-full border-2 border-gray-200 bg-gray-100Ad shadow-lg group-hover:border-green-400"
                                    />
                                    <p className="w-full text-center group-hover:text-green-600"><b>${nft.username}</b></p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div >
    );
}




// https://api.dicebear.com/9.x/avataaars/svg?clothesColor=3c4f5c,65c9ff,262e33

// https://api.dicebear.com/9.x/avataaars/svg?accessories=eyepatch,kurt,prescription01

// https://api.dicebear.com/9.x/avataaars/svg?eyes=closed,cry,default

// https://api.dicebear.com/9.x/avataaars/svg?hairColor=2c1b18,4a312c,724133

// https://api.dicebear.com/9.x/avataaars/svg?top=bigHair,bob,bun