import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
// import { DeleteHouse, DeleteHouseVariables } from "src/generated/DeleteHouse";

interface IProps {
  house: {
    id: string;
    userId: string;
  };
}

export default function HouseNav({ house }: IProps) {
  const { user } = useAuth();
  const canManage = !!user && house.userId === user.uid;

  return (
    <>
      <Link href="/">
        <a>Map</a>
      </Link>
      {canManage && (
        <>
          {" | "}
          <Link href={`/houses/${house.id}/edit`}>
            <a>Edit</a>
          </Link>
        </>
      )}
    </>
  );
}
