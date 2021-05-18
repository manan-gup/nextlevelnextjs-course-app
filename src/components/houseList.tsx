import Link from "next/link";
import { Image } from "cloudinary-react";
import { HousesQuery_houses } from "src/generated/HousesQuery";
import { createRef, RefObject, useEffect, useState } from "react";

interface IProps {
  houses: HousesQuery_houses[];
  highlightedId: string | null;
  setHighlightedId: (id: string | null) => void;
}

let refs: RefObject<HTMLDivElement>[] = [];
const itemClassList = "px-6 py-4 cursor-pointer flex flex-wrap";

export default function HouseList({
  houses,
  highlightedId,
  setHighlightedId,
}: IProps) {
  const [isHouseList, setIsHouseList] = useState<boolean>(false);

  useEffect(() => {
    if (highlightedId && !isHouseList) {
      refs[parseInt(highlightedId) - 1].current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [highlightedId]);

  return (
    <>
      {houses.map((house) => {
        refs[parseInt(house.id) - 1] = createRef<HTMLDivElement>();
        return (
          <Link key={house.id} href={`/houses/${house.id}`}>
            <div
              className={
                highlightedId === house.id
                  ? `${itemClassList} bg-gray-800`
                  : itemClassList
              }
              onMouseEnter={() => {
                setHighlightedId(house.id);
                setIsHouseList(true);
              }}
              onMouseLeave={() => {
                setHighlightedId(null);
                setIsHouseList(false);
              }}
              ref={refs[parseInt(house.id) - 1]}
            >
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
        );
      })}
    </>
  );
}
