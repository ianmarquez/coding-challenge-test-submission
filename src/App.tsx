import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import Form from "@/components/Form/Form";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useDynamicForm } from "./hooks/useDynamicForm";
import useAddressSearch from "./hooks/useAddressSearch";
import Button from "@/components/Button/Button";

type AddressFormInputs = {
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string | undefined;
};

function App() {
  const {
    values: formValues,
    onChange,
    clearAll: clearAllFields,
  } = useDynamicForm<AddressFormInputs>({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: undefined,
  });
  const {
    addresses,
    isFetching,
    handleFetchRequest: handleAddressesFetchRequest,
    error: addressSearchError,
    clearError: clearAddressSearchError,
    clearAddresses,
  } = useAddressSearch();

  const [error, setError] = React.useState<undefined | string>(undefined);
  const loading = isFetching;
  const { addAddress } = useAddressBook();

  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddressesFetchRequest(formValues.postCode, formValues.houseNumber);
    clearAllFields(["postCode", "houseNumber"]);
  };

  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formValues.lastName || !formValues.firstName) {
      return setError("First name and last name fields mandatory!");
    }

    if (!formValues.selectedAddress || !addresses.length) {
      return setError(
        "No address selected, try to select an address or find one if you haven't",
      );
    }

    const foundAddress = addresses.find(
      (address) => address.id === formValues.selectedAddress,
    );

    if (!foundAddress) {
      return setError("Selected address not found");
    }

    addAddress({
      ...foundAddress,
      id: `${foundAddress.id}-${formValues.firstName}-${formValues.lastName}`,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
    });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                onChange,
                value: formValues.postCode,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House Number",
              extraProps: {
                onChange,
                value: formValues.houseNumber,
              },
            },
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address, index) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={`${address.id}-${index}-radio`}
                onChange={onChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {formValues.selectedAddress && (
          <Form
            label={"✏️ Add personal info to address"}
            loading={loading}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  onChange,
                  value: formValues.firstName,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: { onChange, value: formValues.lastName },
              },
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to Addressbook"
          />
        )}

        <ErrorMessage error={addressSearchError ?? error} />

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            clearAddressSearchError();
            setError("");
            clearAllFields();
            clearAddresses();
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
