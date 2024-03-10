import coverImg from "/public/assets/dash.png";
import Image from "next/image";

export default function BackgrongImage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-[1920px] h-[1080px] absolute">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ zIndex: -1 }}
      >
        <div className="flex shrink-0">
          <Image
            src={coverImg}
            alt="Cover Image"
            className=" lg:h-full bg-cover bg-center"
            width={1920}
            height={1080}
          />
        </div>
      </div>
      <div className="relative z-10 w-full h-full">{children}</div>
    </main>
  );
}

{
  /* <div className="w-full h-full">
//   <div
//     style={{ backgroundImage: `url(${"/assets/dash.png"})` }}
//     className="w-full lg:h-full bg-cover bg-center text-white"
//   > */
}
