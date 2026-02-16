// app/bouquet/[id]/page.tsx
import { supabase } from "@/lib/supabase"; // we'll make this below
import Bouquet from "../../../components/bouquet/Bouquet";
import Image from "next/image";
import Link from "next/link";
import type { Bouquet as BouquetType } from "@/types/bouquet";
import type { Metadata } from "next";

interface Params {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    data?: string;
  }>;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params;

  if (id === "shared" && searchParams.data) {
    try {
      const decoded = decodeURIComponent(searchParams.data);
      const sharedBouquet = JSON.parse(decoded) as BouquetType;
      const sender = sharedBouquet.letter?.sender?.trim();
      return {
        title: sender ? `digibouquet from ${sender}` : "digibouquet",
      };
    } catch {
      return { title: "digibouquet" };
    }
  }

  if (!supabase) {
    return { title: "digibouquet" };
  }

  const { data } = await supabase
    .from("bouquets")
    .select("letter")
    .eq("id", id)
    .single();

  const sender = data?.letter?.sender?.trim();
  return {
    title: sender ? `digibouquet from ${sender}` : "digibouquet",
  };
}

export default async function BouquetPage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params;

  if (id === "shared" && searchParams.data) {
    try {
      const decoded = decodeURIComponent(searchParams.data);
      const sharedBouquet = JSON.parse(decoded) as BouquetType;

      return (
        <div
          className="text-center p-6 min-h-screen"
          style={{
            backgroundImage: `linear-gradient(180deg, ${
              sharedBouquet.letter?.cardColor || "#F9F9EE"
            } 0%, #ffffff 100%)`,
          }}
        >
          <Link href="/">
            <Image
              src="/digibouquet.png"
              alt="digibouquet"
              width={200}
              height={80}
              className="object-cover mx-auto my-10"
              priority
            />
          </Link>
          <h2 className="text-3xl md:text-4xl font-dmserif mb-12 tracking-wide normal-case">
            {sharedBouquet.letter?.title?.trim() || "Hi, I made this bouquet for you!"}
          </h2>
          <Bouquet bouquet={sharedBouquet} />
          <p className="text-sm text-gray-500">
            made with digibouquet, a tool by{" "}
            <Link
              href="https://x.com/pau_wee_"
              className="text-sm underline text-gray-500 mt-2"
            >
              @pau_wee_
            </Link>
          </p>
          <Link href="/" className="text-sm underline text-gray-500 mt-2">
            make a bouquet now!
          </Link>
        </div>
      );
    } catch {
      return <div>Invalid shared bouquet link.</div>;
    }
  }

  if (!supabase) {
    return <div>Supabase is not configured.</div>;
  }

  const { data, error } = await supabase
    .from("bouquets")
    .select()
    .eq("id", id)
    .single();

  if (error || !data) {
    return <div>404 - Bouquet not found</div>;
  }

  return (
    <div
      className="text-center p-6 min-h-screen"
      style={{
        backgroundImage: `linear-gradient(180deg, ${
          data.letter?.cardColor || "#F9F9EE"
        } 0%, #ffffff 100%)`,
      }}
    >
      {/* Logo/Branding */}
      <Link href="/">
        <Image
          src="/digibouquet.png"
          alt="digibouquet"
          width={200}
          height={80}
          className="object-cover mx-auto my-10"
          priority
        />
      </Link>
      <h2 className="text-3xl md:text-4xl font-dmserif mb-12 tracking-wide normal-case">
        {data.letter?.title?.trim() || "Hi, I made this bouquet for you!"}
      </h2>
      <Bouquet bouquet={data} />
      <p className="text-sm text-gray-500">
        made with digibouquet, a tool by{" "}
        <Link
          href="https://x.com/pau_wee_"
          className="text-sm underline text-gray-500 mt-2"
        >
          @pau_wee_
        </Link>
      </p>
      <Link href="/" className="text-sm underline text-gray-500 mt-2">
        make a bouquet now!
      </Link>
    </div>
  );
}
