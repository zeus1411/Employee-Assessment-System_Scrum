// // import {
// //   formatCurrency,
// //   generateSlugUrl,
// //   htmlToTextForDescription,
// // } from "@/lib/utils";
// // import Image from "next/image";
// // import { getTranslations } from "next-intl/server";
// // import { Metadata } from "next";
// // import envConfig from "@/config";
// // import Earth from "@/app/earth";

// // export async function generateMetadata(): Promise<Metadata> {
// //   const t = await getTranslations("HomePage");
// //   return {
// //     title: t("title"),
// //     description: htmlToTextForDescription(t("description")),
// //     alternates: {
// //       canonical: envConfig.NEXT_PUBLIC_URL,
// //     },
// //   };
// // }

// // export default async function Home() {
// //   const t = await getTranslations("HomePage");
// //   return (
// //     <div className="w-full space-y-4">
// //       {/* Banner Section */}
// //       <div className="relative z-10 min-h-[100px]">
// //         <span className="absolute top-0 left-0 w-full h-full bg-black opacity-10 z-10"></span>
// //         <Image
// //           src="/banner.jpg"
// //           width={900}
// //           height={100}
// //           quality={100}
// //           alt="Banner"
// //           className="absolute top-0 w-full object-cover "
// //         />
// //         <Earth />

// //         <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
// //           <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">
// //             {t("title")}
// //           </h1>
// //           <p className="text-center text-sm sm:text-base mt-4 text-white">
// //             {t("description")}
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import {
//   formatCurrency,
//   generateSlugUrl,
//   htmlToTextForDescription,
// } from "@/lib/utils";
// import Image from "next/image";
// import { getTranslations } from "next-intl/server";
// import { Metadata } from "next";
// import envConfig from "@/config";
// import Earth from "@/app/earth";

// export async function generateMetadata(): Promise<Metadata> {
//   const t = await getTranslations("HomePage");
//   return {
//     title: t("title"),
//     description: htmlToTextForDescription(t("description")),
//     alternates: {
//       canonical: envConfig.NEXT_PUBLIC_URL,
//     },
//   };
// }

// export default async function Home() {
//   const t = await getTranslations("HomePage");

//   return (
//     <div className="w-full space-y-10">
//       {/* Banner Section */}

//       <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
//         {/* Banner image */}
//         <Image
//           src="/banner.jpg"
//           layout="fill"
//           objectFit="cover"
//           quality={100}
//           alt="Banner"
//           className="z-0"
//         />

//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/50 z-10" />

//         {/* Earth Animation */}

//         {/* Title & Description */}
//         <div className="relative z-30 px-4 text-center max-w-3xl">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
//             {t("title")}
//           </h1>
//           <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200">
//             {t("description")}
//           </p>
//         </div>
//       </div>
//       <div>
//         <Earth />
//       </div>
//     </div>
//   );
// }

import {
  formatCurrency,
  generateSlugUrl,
  htmlToTextForDescription,
} from "@/lib/utils";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import envConfig from "@/config";
import Earth from "@/app/earth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("HomePage");
  return {
    title: t("title"),
    description: htmlToTextForDescription(t("description")),
    alternates: {
      canonical: envConfig.NEXT_PUBLIC_URL,
    },
  };
}

export default async function Home() {
  const t = await getTranslations("HomePage");

  return (
    <div className="w-full space-y-10">
      {/* Banner Section */}
      <div className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Banner image */}
        <Image
          src="/banner.jpg"
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="Banner"
          className="z-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Earth - Centered in the banner */}
        <div className="absolute z-20 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80">
          <Earth />
        </div>

        {/* Title & Description */}
        <div className="relative z-30 px-4 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {t("title")}
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200">
            {t("description")}
          </p>
        </div>
      </div>
    </div>
  );
}
