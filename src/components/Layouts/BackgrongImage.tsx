import coverImg from "/public/assets/dashboard-2.png";
import Image from "next/image";

export default function BackgroundImage({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative w-full min-h-screen" style={{ zoom: '0.75' }}>
      <div id="Fullscreen-Background">
        <div className="fixed inset-0 z-0">
          <Image src={coverImg} alt="רקע" fill className="object-cover object-center" priority />
        </div>
        <div className="relative z-10 w-full min-h-screen pb-16">{children}</div>
      </div>
    </main>
  );
}
