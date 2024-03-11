import coverImg from "/public/assets/dash.png";
import Image from "next/image";

export default function BackgrongImage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main  className="lg:w-[1920px] lg:h-[1080px] absolute">
      <span id="Fullscreen-Background" className="">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ zIndex: -1 }}
        >
          <div className="flex shrink-0">
            <Image
              src={coverImg}
              alt="Cover Image"
              className="lg:h-full bg-cover bg-center"
              fill
            />
          </div>
        </div>
        <div className="relative z-10 w-full h-full">{children}</div>
        </span>
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
