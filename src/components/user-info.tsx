'use client'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/useUser";

type Params = {
    homeUrl: string;
}

export default function UserInfo({ homeUrl }: Params) {
    const { user, loading, error } = useUser();

    if (loading) {
        return (
            <div className="bg-background border-b border-border p-4 shadow-sm">
                <div className="flex items-center justify-center">
                    <div className="animate-pulse flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return null;
    }

    return (
        <div className="bg-background border-b border-border p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">@{user.username}</span>
                        <span className="text-xs text-muted-foreground">Conectado</span>
                    </div>
                </div>
                <a href={homeUrl}>
                    <Button>Volver al inicio</Button>
                </a>
            </div>
        </div>
    );
} 