"use client";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useSession } from "next-auth/react";


const Profile = () => {
    const { data: session } = useSession();

    return (
        <DefaultLayout>

                <div className="flex flex-col items-center justify-center gap-4 p-10 text-center dark:text-white">
                    <h1 className=" text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Profile</h1>
                <span className="avatar h-12 w-12 rounded-full border border-stroke">
                    <Image
                        width={112}
                        height={112}
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || ""}
                        style={{
                            width: "auto",
                            height: "auto",
                            borderRadius: "50%",
                        }}
                    />
                </span>
                <div>{session?.user?.name}</div>
                <div>{session?.user?.email}</div>
            </div>

        </DefaultLayout>
    );
};

export default Profile;
