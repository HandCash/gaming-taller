'use client'

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Constants } from "@/constants";
import { useQRCode } from "next-qrcode";
import { useEffect } from "react";
import { useState } from "react";

type User = {
    username: string;
    avatarUrl: string;
}

const connectUrl = `https://market.handcash.io/connect?appId=${Constants.HandCashAppCredentials.appId}`;

type Params = {
    initialUsers: User[];
}


export default function ConnectComponent({ initialUsers }: Params) {
    const [users, setUsers] = useState<User[]>(initialUsers);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`/api/users?t=${new Date().getTime()}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data.items);
            }
        };
        fetchUsers();
        const interval = setInterval(fetchUsers, 2000);
        return () => clearInterval(interval);
    }, []);

    const { Canvas } = useQRCode();
    return (
        <div className="flex flex-col lg:flex-row gap-6 my-12">
            <div className="flex flex-col items-center gap-4 w-full lg:hidden">
                <a href={connectUrl} target="_blank" rel="noopener noreferrer" className="w-full px-8">
                    <Button size="lg" className="w-full">Conecta tu Wallet</Button>
                    <p className="text-sm text-gray-500 pt-2 text-center">Y recibirás 1 USD</p>
                </a>
            </div>
            <div className="hidden lg:flex flex-col items-center gap-4 w-full lg:w-1/3">
                <p className="text-lg font-semibold tracking-tighter uppercase text-center">Escanea para conectar</p>
                <div className="rounded-lg overflow-hidden">
                    <a href={connectUrl} target="_blank" rel="noopener noreferrer">
                        <Canvas
                            text={connectUrl}
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
                <p className="text-lg font-semibold tracking-tighter uppercase text-center">Y recibirás 1 USD</p>
            </div>
            <div className="m-6 lg:mx-6 border-b lg:border-b-0 lg:border-r border-gray-200"></div>
            <div className="flex flex-col gap-4 w-full lg:w-2/3 px-6">
                <h2 className="text-xl font-semibold text-green-600">Wallet Conectadas</h2>
                {users.length === 0 && (
                    <p className="text-gray-500">No hay wallets conectadas aún. Sé el primero en conectar tu wallet!</p>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {users.map((user) => (
                        <Card key={user.username}>
                            <div className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatarUrl}
                                        alt={`${user.username} avatar`}
                                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                                    />
                                    <CardTitle className="text-lg font-semibold">${user.username}</CardTitle>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
