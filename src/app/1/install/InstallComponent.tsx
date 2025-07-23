'use client'

import { IconBrandAndroid, IconBrandAppleFilled } from "@tabler/icons-react";
import { useQRCode } from "next-qrcode";

const googlePlayUrl = `https://play.google.com/store/apps/details?id=io.handcash.wallet`;
const appStoreUrl = `https://apps.apple.com/us/app/handcash/id1477625366`;


export default function InstallComponent() {

    const { Canvas } = useQRCode();
    return (
        <div className="my-12">
            <p className="text-center pb-2 text-3xl font-bold text-gray-600">¿Quieres recibir 1 USD?</p>
            <p className="text-center pb-6 text-4xl font-bold text-green-600">Instala la app de HandCash</p>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col items-center gap-2 w-full lg:w-1/2">
                    <div className="rounded-lg overflow-hidden">
                        <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer">
                            <Canvas
                                text={googlePlayUrl}
                                options={{
                                    errorCorrectionLevel: 'M',
                                    margin: 3,
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
                    <p className="text-lg font-semibold tracking-tighter uppercase flex justify-center"><IconBrandAndroid className="inline-block mr-3 text-green-500" /> Instala en Android</p>
                </div>
                <div className="m-6 lg:mx-6 border-b lg:border-b-0 lg:border-r border-gray-200"></div>
                <div className="flex flex-col items-center gap-2 w-full lg:w-1/2">
                    <div className="rounded-lg overflow-hidden">
                        <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                            <Canvas
                                text={appStoreUrl}
                                options={{
                                    errorCorrectionLevel: 'M',
                                    margin: 3,
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
                    <p className="text-lg font-semibold tracking-tighter uppercase flex justify-center"><IconBrandAppleFilled className="inline-block mr-3 text-gray-500" /> Instala en iPhone</p>
                </div>
            </div>
        </div>
    );
}
