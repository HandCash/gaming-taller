import { UserModel } from "@/lib/models/user";
import ConnectComponent from "./ConnectComponent";

export default async function Page() {
    const users = await UserModel.find({}).sort({ updatedAt: -1 });
    return (
        <ConnectComponent initialUsers={users} />
    );
}
