'use client'

import { Nft } from "@/types";
import { useQRCode } from "next-qrcode";
import { useEffect } from "react";
import { useState } from "react";

const minterUrl = 'https://gaming-taller.vercel.app/2/mintNft';

export default function MintNftComponent() {
    const { Canvas } = useQRCode();
    const [mintedNfts, setMintedNfts] = useState<Nft[]>([]);

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

    return (
        <div className="flex flex-col lg:flex-row gap-6 my-12">
            <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
                <p className="text-lg font-semibold tracking-tighter uppercase text-center">Escanea para</p>
                <div className="rounded-lg overflow-hidden">
                    <a href={minterUrl} target="_blank" rel="noopener noreferrer">
                        <Canvas
                            text={minterUrl}
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
                <p className="text-lg font-semibold tracking-tighter uppercase text-center">Crear tu Avatar</p>
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