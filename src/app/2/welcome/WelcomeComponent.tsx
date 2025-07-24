'use client'

import { useUser } from "@/hooks/useUser";
import Link from "next/link";


type Params = {
    isCreateNftCompleted: boolean;
    isBurnNftCompleted: boolean;
    isBuyNftCompleted: boolean;
}

export default function WelcomeComponent({ isCreateNftCompleted, isBurnNftCompleted, isBuyNftCompleted }: Params) {
    const { user, loading } = useUser();

    if (loading) {
        return null;
    }

    return (
        <div>
            <div style={{ maxWidth: 480, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                <p className="text-center pb-6 text-xl font-bold text-green-600">Taller de Blockchain y Gaming</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: 20 }}>
                        <Link href="/1/install" style={{ textDecoration: 'none', color: '#222', display: 'block', padding: 16, borderRadius: 8, background: '#f5f5f5', transition: 'background 0.2s', fontWeight: 500 }}>
                            <span className="mr-3">{user ? '✅' : '⌛️'}</span>Instalar HandCash y crear una cuenta
                        </Link>
                    </li>
                    <li style={{ marginBottom: 20 }}>
                        <Link href="/1/connect" style={{ textDecoration: 'none', color: '#222', display: 'block', padding: 16, borderRadius: 8, background: '#f5f5f5', transition: 'background 0.2s', fontWeight: 500 }}>
                            <span className="mr-3">{user ? '✅' : '⌛️'}</span>Conectar a HandCash y recibir un NFT
                        </Link>
                    </li>
                    <li style={{ marginBottom: 20 }}>
                        <Link href="/2/mintNft" style={{ textDecoration: 'none', color: '#222', display: 'block', padding: 16, borderRadius: 8, background: '#f5f5f5', transition: 'background 0.2s', fontWeight: 500 }}>
                            <span className="mr-3">{isCreateNftCompleted ? '✅' : '⌛️'}</span>Crear un NFT
                        </Link>
                    </li>
                    <li style={{ marginBottom: 20 }}>
                        <Link href="/2/burnNft" style={{ textDecoration: 'none', color: '#222', display: 'block', padding: 16, borderRadius: 8, background: '#f5f5f5', transition: 'background 0.2s', fontWeight: 500 }}>
                            <span className="mr-3">{isBurnNftCompleted ? '✅' : '⌛️'}</span>Quemar un NFT
                        </Link>
                    </li>
                    <li>
                        <Link href="/2/buyNft" style={{ textDecoration: 'none', color: '#222', display: 'block', padding: 16, borderRadius: 8, background: '#f5f5f5', transition: 'background 0.2s', fontWeight: 500 }}>
                            <span className="mr-3">{isBuyNftCompleted ? '✅' : '⌛️'}</span>Comprar un NFT
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
