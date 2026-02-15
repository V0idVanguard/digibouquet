import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen font-mono uppercase">
      <div className="p-16 mx-auto max-w-3xl text-center">
        <Image
          src="/color/flowers/peony.png"
          alt="anemone flower"
          width={100}
          height={100}
          className="object-cover mx-auto mb-6"
          priority
        />
        <Image
          src="/digibouquet.png"
          alt="digibouquet"
          width={600}
          height={400}
          className="object-cover mx-auto"
          priority
        />
        <p className="my-6 text-sm md:mb-6 md:-mt-6">
          beautiful flowers <br /> delivered digitally
        </p>
        <div className="flex flex-col justify-center items-center">
          <Link
            href="/bouquet?mode=color"
            className="text-sm px-8 py-4 bg-[#000000] text-[#F5F5DC] hover:bg-[#0A0000]/90 m-2"
          >
            BUILD A BOUQUET
          </Link>

          <Link
            href="/bouquet?mode=mono"
            className="text-sm px-8 py-4 border border-black text-[#000000] hover:bg-[#F5F5AC]/90 m-2"
          >
            BUILD IT IN BLACK AND WHITE
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-500 normal-case">
          Originally created by{" "}
          <Link
            href="https://x.com/pau_wee_"
            className="mt-2 text-sm text-gray-500"
          >
            @pau_wee_
          </Link>
          {", "}forked and customized by{" "}
          <Link
            href="https://github.com/rushhiii"
            className="mt-2 text-sm text-gray-500"
          >
            @rushhiii
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
