import Link from "next/link";
import { Image } from "cloudinary-react";
import { HousesQuery_houses } from "src/generated/HousesQuery";

export default function HouseList({
  houses,
}: {
  houses: HousesQuery_houses[];
}) {
  return (
    <>
      {houses.map((house) => (
        <Link key={house.id} href={`/houses/${house.id}`}>
          <div className="px-6 pt-4 cursor-pointer flex flex-wrap">
            <div className="sm:w-full md:w-1/2">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={house.publicId}
                alt={house.address}
                secure
                crop="fill"
                dpr="auto"
                quality="auto"
                gravity="auto"
                width={350}
                height={Math.floor((9 / 16) * 350)}
              />
            </div>
            <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
              <h2 className="text-lg">{house.address}</h2>
              <p>{house.bedrooms} 🛏 house</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
