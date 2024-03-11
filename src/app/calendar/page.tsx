import DefaultLayout from "@/components/Layouts/DefaultLayout";
import coverImg from "/public/assets/dashboard.jpg";
import Image from "next/image";
export default function Page() {

    return (
        <DefaultLayout>
            <div id="Fullscreen-Background" className="flex shrink-0 ">
                <Image
                    src={coverImg}
                    alt="Cover Image"
                    className="lg:h-full bg-cover bg-center"
                    fill
                />
            </div>
        </DefaultLayout>
    );
}
