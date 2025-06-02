import { useState, useEffect } from "react";
import { Address as AddressType } from "../types";

type ErrorResponse = {
  status: "error";
  errormessage: string;
};

type SuccessResponse = {
  status: "ok";
  details: AddressType[];
};

const transformAddress = (details: AddressType[], houseNumber: string) => {
  return details.map((detail) => ({
    ...detail,
    houseNumber,
    id: houseNumber,
  }));
};

const fetchAddresses = async (
  postCode: string,
  houseNumber: string,
): Promise<ErrorResponse | SuccessResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?` +
      new URLSearchParams({
        postcode: postCode,
        streetnumber: houseNumber,
      }),
  );

  const data = await response.json();

  if (!response.ok) {
    return data as ErrorResponse;
  }

  return data as SuccessResponse;
};

const useAddressSearch = () => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState("");

  const handleFetchRequest = async (postCode: string, houseNumber: string) => {
    setAddresses([]);
    setError("");
    setIsFetching(true);

    try {
      const response = await fetchAddresses(postCode, houseNumber);
      if (response.status === "ok") {
        setAddresses(transformAddress(response.details, houseNumber));
      } else {
        setError(response.errormessage);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {}, []);

  return {
    addresses,
    isFetching,
    handleFetchRequest,
    error,
    clearError: () => setError(""),
    clearAddresses: () => setAddresses([]),
  };
};

export default useAddressSearch;
