import { PropsWithChildren } from "react";
import UserInfo from "@/components/user-info";


export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <div>
            <UserInfo homeUrl={"/2/welcome"} />
            {children}
        </div>
    );
}
