import { UserModel } from "@/lib/models/user";
import ConnectComponent from "./ConnectComponent";
import connectDB from "@/lib/mongodb";

export default async function Page() {
    await connectDB();
    const users = await UserModel.find({}).sort({ updatedAt: -1 });
    return (
        <ConnectComponent initialUsers={users} />
    );
}
