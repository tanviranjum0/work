import React, { useState, useCallback } from "react";
import clsx from "clsx";
import {
  AddressAutofill,
  AddressMinimap,
  useConfirmAddress,
} from "@mapbox/search-js-react";

const ACCESS_TOKEN =
  "pk.eyJ1IjoidGFudmlyYW5qdW0iLCJhIjoiY203bm82YjVuMDFzbjJxcHNjYmU2NzFieCJ9.HQ3wry_A2fszUOnKcV3F0A";

const MapboxExample = () => {
  // one of 'shipping', 'confirm', 'complete'
  const [activePage, setActivePage] = useState("shipping");
  const [formData, setFormData] = useState();
  const [minimapFeature, setMinimapFeature] = useState();
  const { formRef, showConfirm } = useConfirmAddress({
    accessToken: ACCESS_TOKEN,
  });
  console.log(activePage, formData, minimapFeature);

  const handleAutofillRetrieve = (response) => {
    setMinimapFeature(response.features[0]);
  };

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await showConfirm();

      // if no change is suggested, the address is confirmed. continue to the confirmation page
      if (result.type === "nochange") {
        setFormData(new FormData(e.target));
        setActivePage("confirm");
      }
    },
    [showConfirm]
  );

  const handleChangeAddress = () => {
    setActivePage("shipping");
  };

  const handleOrderSubmit = () => {
    setActivePage("complete");
  };

  const handleTryAgain = () => {
    formRef.current.reset();
    setMinimapFeature();
    setActivePage("shipping");
  };

  let displayAddress;

  if (formData) {
    displayAddress = (
      <>
        {formData.get("first-name")} {formData.get("last-name")}
        <br />
        {formData.get("address-line1 address-search")}
        <br />
        {formData.get("address-line2") && (
          <>
            {formData.get("address-line2")} <br />
          </>
        )}
        {formData.get("address-level2")} {formData.get("address-level1")}{" "}
        {formData.get("postal-code")}
      </>
    );
  }

  return (
    <div
      className="round border border--gray-lighter px12 py24"
      style={{ minHeight: 550 }}
    >
      <div className="wmax600 mx-auto">
        {/* shipping address page */}
        <div
          className={clsx("address-page", {
            none: activePage !== "shipping",
          })}
        >
          <h4 className="txt-l txt-bold mb6">Shipping Address</h4>

          {/* address form with `autocomplete` attributes on each address input */}
          <form
            className="flex flex--column"
            ref={formRef}
            onSubmit={handleFormSubmit}
          >
            {/* first and last name */}
            <div className="grid grid--gut12">
              <div className="col w-1/2">
                <label className="txt-s txt-bold color-gray mb3">
                  First Name
                  <input className="input mb12" name="first-name" required />
                </label>
              </div>
              <div className="col w-1/2">
                <label className="txt-s txt-bold color-gray mb3">
                  Last Name
                  <input className="input mb12" name="last-name" required />
                </label>
              </div>
            </div>

            {/* address-line1 with search icon */}
            <AddressAutofill
              accessToken={ACCESS_TOKEN}
              onRetrieve={handleAutofillRetrieve}
            >
              <label className="txt-s txt-bold color-gray mb3">
                Address
                <div className="relative color-gray">
                  <input
                    className="input mb12"
                    autoComplete="address-line1"
                    name="address-line1"
                    required
                  />
                  <svg
                    className="absolute"
                    viewBox="0 0 18 18"
                    xmlSpace="preserve"
                    width="20"
                    height="20"
                    fill="currentColor"
                    style={{ top: 8, right: 8 }}
                  >
                    <path d="M7.4 2.5c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9c1 0 1.8-.2 2.5-.8l3.7 3.7c.2.2.4.3.8.3.7 0 1.1-.4 1.1-1.1 0-.3-.1-.5-.3-.8L11.4 10c.4-.8.8-1.6.8-2.5.1-2.8-2.1-5-4.8-5zm0 1.6c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.3-1.3-3.3-3.1 1.4-3.3 3.3-3.3z"></path>
                  </svg>
                </div>
              </label>
            </AddressAutofill>

            {/* address-line2 */}
            <label className="txt-s txt-bold color-gray mb3">
              Apartment, suite, etc. (optional)
              <input
                className="input mb12"
                autoComplete="address-line2"
                name="address-line2"
              />
            </label>

            {/* address-level2, address-level1, postal-code */}
            <div className="grid grid--gut12 mb12">
              <div className="col w-1/3">
                <label className="txt-s txt-bold color-gray mb3">
                  City
                  <input
                    className="input mb12"
                    autoComplete="address-level2"
                    name="address-level2"
                    required
                  />
                </label>
              </div>
              <div className="col w-1/3">
                <label className="txt-s txt-bold color-gray mb3">
                  State / Region
                  <input
                    className="input mb12"
                    autoComplete="address-level1"
                    name="address-level1"
                    required
                  />
                </label>
              </div>
              <div className="col w-1/3">
                <label className="txt-s txt-bold color-gray mb3">
                  ZIP / Postcode
                  <input
                    className="input"
                    autoComplete="postal-code"
                    name="postal-code"
                    required
                  />
                </label>
              </div>
            </div>

            {/* minimap for visual confirmation */}
            <div
              id="minimap-container"
              className={clsx("h180 wfull relative mt18 mb60", {
                none: !minimapFeature,
              })}
            >
              <AddressMinimap
                feature={minimapFeature}
                show={!!minimapFeature}
                satelliteToggle
                canAdjustMarker
                footer
                accessToken={ACCESS_TOKEN}
              />
            </div>

            {/* continue button */}
            <div className="mb12 submit-btns align-r">
              <button type="submit" className="btn round">
                Continue
              </button>
            </div>
          </form>
          {/* end address form */}
        </div>

        {/* confirmation page */}
        <div
          className={clsx("confirm-page", {
            none: activePage === "shipping",
          })}
        >
          <div
            className={clsx("confirm-order-blurb", {
              none: activePage !== "confirm",
            })}
          >
            <h4 className="txt-l txt-bold mb6">Confirm Order</h4>

            <p className="mb24">
              Review your order and shipping details below. This is only an
              example, so we aren't going to ship anything to you.
            </p>
          </div>

          <div
            className={clsx("order-submitted-blurb mb24", {
              none: activePage !== "complete",
            })}
          >
            <h4 className="txt-l txt-bold mb6">Order Submitted!</h4>

            <p className="mb12">Your order is on the way!</p>
            <button
              className="txt-ms border-b color-blue color-blue-dark-on-hover link restart-button inline-block"
              onClick={handleTryAgain}
            >
              Try this example again
            </button>
          </div>

          {/* order details */}
          <div className="round border border--gray-light px18 py6 flex mb24">
            <div className="txt-bold mr24 w60">Order</div>
            <div className="flex-child-grow">
              1 - Mapbox Developer Tee Shirt
            </div>
          </div>

          {/* shipping address */}
          <div className="round border border--gray-light px18 py6 flex mb24">
            <div className="txt-bold mr24 w60">Ship To</div>
            <div className="flex-child-grow" id="shipping-address">
              {displayAddress}
            </div>
            <div className={clsx({ none: activePage !== "confirm" })}>
              <button
                className="txt-ms border-b color-blue color-blue-dark-on-hover link change-address-button"
                onClick={handleChangeAddress}
              >
                Change
              </button>
            </div>
          </div>

          <div
            className={clsx("mb12 submit-btns align-r", {
              none: activePage !== "confirm",
            })}
          >
            <button
              type="submit"
              className="btn round submit-order-button"
              onClick={handleOrderSubmit}
            >
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxExample;
