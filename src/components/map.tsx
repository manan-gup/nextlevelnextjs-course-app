import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
import { HousesQuery_houses } from "src/generated/HousesQuery";
// import { SearchBox } from "./searchBox";

interface IProps {
  setDataBounds: (bounds: string) => void;
  houses: HousesQuery_houses[];
  highlightedId: string | null;
  setHighlightedId: (id: string | null) => void;
}

export default function Map({
  setDataBounds,
  houses,
  highlightedId,
  setHighlightedId,
}: IProps) {
  const [selected, setSelected] = useState<HousesQuery_houses | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useLocalState<ViewState>("viewport", {
    latitude: 28.657,
    longitude: 77.15,
    zoom: 13,
  });

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={3}
        maxZoom={18}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        onLoad={() => {
          if (mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds().toArray();
            setDataBounds(JSON.stringify(bounds));
          }
        }}
        onInteractionStateChange={(extra) => {
          if (!extra.isDragging && mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds().toArray();
            setDataBounds(JSON.stringify(bounds));
          }
        }}
      >
        {houses.map((house) => {
          return (
            <Marker
              key={house.id}
              latitude={house.latitude}
              longitude={house.longitude}
              offsetLeft={-15}
              offsetTop={-15}
              className={highlightedId === house.id ? "marker-active" : ""}
            >
              <button
                style={{ height: "30px", width: "30px", fontSize: "30px" }}
                type="button"
                onClick={() => setSelected(house)}
                onMouseEnter={() => setHighlightedId(house.id)}
                onMouseLeave={() => setHighlightedId(null)}
              >
                <img
                  src={
                    highlightedId === house.id
                      ? "/home-color.svg"
                      : "/home-solid.svg"
                  }
                  alt="House Marker"
                  className="w-8"
                />
              </button>
            </Marker>
          );
        })}
        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-center">
              <h3 className="px-4">{selected.address.substr(0, 30)}</h3>
              <Image
                className="mx-auto my-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={selected.publicId}
                secure
                dpr="auto"
                quality="auto"
                width={200}
                height={Math.floor((9 / 16) * 200)}
                crop="fill"
                gravity="auto"
              />
              <Link href={`/houses/${selected.id}`}>
                <a>View House</a>
              </Link>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
