"use client";

import { useState } from "react";

type FormData = {
  client_name: string;
  client_address: string;
  client_contact: string;
  resort_type: string;
  is_day: boolean;
  day_start_time: string;
  day_end_time: string;
  is_night: boolean;
  night_start_time: string;
  night_end_time: string;
  event_name: string;
  event_date: string;
  venues: {
    [key: string]: {
      checked: boolean;
      note: string;
      amount: string;
    };
  };
  suppliers: {
    [key: string]: {
      checked: boolean;
      amount: string;
    };
  };
  venue_total: string;
};

export default function CreateContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form state for live preview
  const [formData, setFormData] = useState<FormData>({
    client_name: "",
    client_address: "",
    client_contact: "",
    resort_type: "",
    is_day: false,
    day_start_time: "",
    day_end_time: "",
    is_night: false,
    night_start_time: "",
    night_end_time: "",
    event_name: "",
    event_date: "",
    venues: {
      "Swimming Pool": { checked: false, note: "", amount: "" },
      "Room 1": { checked: false, note: "", amount: "" },
      "Room 2": { checked: false, note: "", amount: "" },
      "Kitchen lounge": { checked: false, note: "", amount: "" },
      "Family room": { checked: false, note: "", amount: "" },
      "Function Hall": { checked: false, note: "", amount: "" },
      Others: { checked: false, note: "", amount: "" },
    },
    suppliers: {
      catering_services: { checked: false, amount: "" },
      sounds_lights: { checked: false, amount: "" },
      photobooth: { checked: false, amount: "" },
      projector: { checked: false, amount: "" },
      mobile_bar: { checked: false, amount: "" },
      food_cart: { checked: false, amount: "" },
      band: { checked: false, amount: "" },
      photo_video: { checked: false, amount: "" },
    },
    venue_total: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setPdfUrl(null);

    const formDataToSend = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setPdfUrl(result.filePath);
        alert("Contract generated successfully!");

        // Optional: Download the PDF automatically
        const link = document.createElement("a");
        link.href = result.filePath;
        link.download = result.filePath.split("/").pop() || "contract.pdf";
        link.click();
      } else {
        alert("Failed to generate contract: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while generating the contract");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-6">
      {/* FORM SECTION */}
      <div className={showPreview ? "w-1/2" : "w-full"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CLIENT DETAILS */}
          <fieldset className="border p-4 rounded">
            <legend className="font-semibold">Client details</legend>

            <label>
              Name:
              <input
                type="text"
                name="client_name"
                className="block border p-2 rounded w-full"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Address:
              <input
                type="text"
                name="client_address"
                className="block border p-2 rounded w-full"
                value={formData.client_address}
                onChange={(e) =>
                  setFormData({ ...formData, client_address: e.target.value })
                }
                required
              />
            </label>

            <label>
              Contact #:
              <input
                type="text"
                name="client_contact"
                className="block border p-2 rounded w-full"
                value={formData.client_contact}
                onChange={(e) =>
                  setFormData({ ...formData, client_contact: e.target.value })
                }
                required
              />
            </label>
          </fieldset>

          {/* EVENT DETAILS */}
          <fieldset className="border p-4 rounded mt-6">
            <legend className="font-semibold">Event details</legend>

            {/* Resort Type */}
            <div>
              <p className="font-medium">Resort type:</p>
              <label className="mr-4">
                <input
                  type="radio"
                  name="resort_type"
                  value="VP1"
                  checked={formData.resort_type === "VP1"}
                  onChange={(e) =>
                    setFormData({ ...formData, resort_type: e.target.value })
                  }
                  required
                />{" "}
                VP1
              </label>
              <label>
                <input
                  type="radio"
                  name="resort_type"
                  value="VP2"
                  checked={formData.resort_type === "VP2"}
                  onChange={(e) =>
                    setFormData({ ...formData, resort_type: e.target.value })
                  }
                  required
                />{" "}
                VP2
              </label>
            </div>

            {/* Day or Night */}
            <div className="mt-3">
              <p className="font-medium">Schedule:</p>

              <label className="block">
                <input
                  type="checkbox"
                  name="is_day"
                  checked={formData.is_day}
                  onChange={(e) =>
                    setFormData({ ...formData, is_day: e.target.checked })
                  }
                />{" "}
                Day (specify time range)
              </label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="time"
                  name="day_start_time"
                  className="border p-2 rounded"
                  value={formData.day_start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, day_start_time: e.target.value })
                  }
                />
                <span>to</span>
                <input
                  type="time"
                  name="day_end_time"
                  className="border p-2 rounded"
                  value={formData.day_end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, day_end_time: e.target.value })
                  }
                />
              </div>

              <label className="block mt-3">
                <input
                  type="checkbox"
                  name="is_night"
                  checked={formData.is_night}
                  onChange={(e) =>
                    setFormData({ ...formData, is_night: e.target.checked })
                  }
                />{" "}
                Night (specify time range)
              </label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="time"
                  name="night_start_time"
                  className="border p-2 rounded"
                  value={formData.night_start_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      night_start_time: e.target.value,
                    })
                  }
                />
                <span>to</span>
                <input
                  type="time"
                  name="night_end_time"
                  className="border p-2 rounded"
                  value={formData.night_end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, night_end_time: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Occasion */}
            <label className="block mt-4">
              Occasion:
              <input
                type="text"
                name="event_name"
                className="block border p-2 rounded w-full"
                value={formData.event_name}
                onChange={(e) =>
                  setFormData({ ...formData, event_name: e.target.value })
                }
                required
              />
            </label>

            {/* Event Date */}
            <label className="block mt-4">
              Event date:
              <input
                type="date"
                name="event_date"
                className="block border p-2 rounded w-full"
                value={formData.event_date}
                onChange={(e) =>
                  setFormData({ ...formData, event_date: e.target.value })
                }
                required
              />
            </label>
          </fieldset>

          {/* VENUE RATES */}
          <fieldset className="border p-4 rounded mt-6">
            <legend className="font-semibold">Venue rates</legend>

            {[
              "Swimming Pool",
              "Room 1",
              "Room 2",
              "Kitchen lounge",
              "Family room",
              "Function Hall",
              "Others",
            ].map((amenity) => (
              <div key={amenity} className="flex items-center gap-3 mt-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  name={`venue_${amenity}`}
                  checked={formData.venues[amenity]?.checked}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      venues: {
                        ...formData.venues,
                        [amenity]: {
                          ...formData.venues[amenity],
                          checked: e.target.checked,
                        },
                      },
                    })
                  }
                />

                {/* Amenity Name */}
                <span className="w-40">{amenity}</span>

                {/* Note Input */}
                <input
                  type="text"
                  name={`note_${amenity}`}
                  placeholder="Note"
                  className="border p-2 rounded flex-1"
                  value={formData.venues[amenity]?.note}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      venues: {
                        ...formData.venues,
                        [amenity]: {
                          ...formData.venues[amenity],
                          note: e.target.value,
                        },
                      },
                    })
                  }
                />

                {/* Amount Input */}
                <input
                  type="number"
                  name={`amount_${amenity}`}
                  placeholder="₱ Amount"
                  className="border p-2 rounded w-32"
                  min={0}
                  value={formData.venues[amenity]?.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      venues: {
                        ...formData.venues,
                        [amenity]: {
                          ...formData.venues[amenity],
                          amount: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            ))}
          </fieldset>

          {/* SUPPLIERS / CORKAGE */}
          <fieldset className="border p-4 rounded">
            <legend className="font-semibold">
              Outside supplier's corkage fees
            </legend>

            <SupplierInput
              name="Catering services"
              defaultPrice={3000}
              formData={formData}
              setFormData={setFormData}
            />
            <SupplierInput
              name="Sounds & lights"
              defaultPrice={1500}
              formData={formData}
              setFormData={setFormData}
            />
            <SupplierInput
              name="Photobooth"
              defaultPrice={1000}
              formData={formData}
              setFormData={setFormData}
            />
            <SupplierInput
              name="Projector"
              defaultPrice={1000}
              formData={formData}
              setFormData={setFormData}
            />
            <SupplierInput
              name="Mobile bar"
              defaultPrice={2000}
              formData={formData}
              setFormData={setFormData}
            />
            <SupplierInput
              name="Food cart"
              defaultPrice={500}
              formData={formData}
              setFormData={setFormData}
            />
            <SupplierInput
              name="Band"
              defaultPrice={1500}
              formData={formData}
              setFormData={setFormData}
            />
            <SupplierInput
              name="Photo/video"
              defaultPrice={1000}
              formData={formData}
              setFormData={setFormData}
            />
          </fieldset>

          {/* TOTAL */}
          <fieldset className="border p-4 rounded">
            <legend className="font-semibold">Total amount for venue</legend>
            <input
              type="number"
              name="venue_total"
              className="border p-2 rounded w-full"
              placeholder="Enter total amount..."
              value={formData.venue_total}
              onChange={(e) =>
                setFormData({ ...formData, venue_total: e.target.value })
              }
              required
            />
          </fieldset>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Generate Contract PDF"}
            </button>
          </div>
        </form>

        {pdfUrl && (
          <div className="mt-6 p-4 border rounded bg-green-50">
            <p className="font-semibold mb-2">
              Contract generated successfully!
            </p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Contract PDF
            </a>
          </div>
        )}
      </div>

      {/* PREVIEW SECTION */}
      {showPreview && (
        <div className="w-1/2 border-l pl-6">
          <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white py-2">
            Live Preview
          </h2>
          <ContractPreview data={formData} />
        </div>
      )}
    </div>
  );
}

type SupplierInputProps = {
  name: string;
  defaultPrice: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

function SupplierInput({
  name,
  defaultPrice,
  formData,
  setFormData,
}: SupplierInputProps) {
  const fieldName = name.toLowerCase().replace(/\s+|\/+/g, "_");

  return (
    <div className="mt-3 flex items-start gap-3">
      {/* Checkbox */}
      <input
        type="checkbox"
        name={`check_${fieldName}`}
        className="mt-2"
        checked={formData.suppliers[fieldName]?.checked}
        onChange={(e) =>
          setFormData({
            ...formData,
            suppliers: {
              ...formData.suppliers,
              [fieldName]: {
                ...formData.suppliers[fieldName],
                checked: e.target.checked,
              },
            },
          })
        }
      />

      <div className="flex-1">
        <label className="font-medium block">{name}</label>
        <span className="text-sm text-gray-600">Default: ₱{defaultPrice}</span>

        <input
          type="number"
          name={fieldName}
          className="border p-2 rounded w-full mt-1"
          placeholder={`${defaultPrice}`}
          min={0}
          value={formData.suppliers[fieldName]?.amount}
          onChange={(e) =>
            setFormData({
              ...formData,
              suppliers: {
                ...formData.suppliers,
                [fieldName]: {
                  ...formData.suppliers[fieldName],
                  amount: e.target.value,
                },
              },
            })
          }
        />
      </div>
    </div>
  );
}

function ContractPreview({ data }: { data: FormData }) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime && !endTime) return "";
    if (!endTime) return startTime;
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="border rounded p-6 bg-white text-xs overflow-auto max-h-screen">
      <style jsx>{`
        .preview-checkbox {
          width: 12px;
          height: 12px;
          border: 1px solid #000;
          display: inline-block;
          position: relative;
          margin-right: 8px;
        }
        .preview-checkbox.checked::after {
          content: "✓";
          position: absolute;
          top: -3px;
          left: 1px;
          font-size: 12px;
          font-weight: bold;
        }
      `}</style>

      <div className="text-right text-[9px] mb-2 leading-tight">
        Block 1, Lot 2 & 4, Forest Hills Drive
        <br />
        corner Continental St., Forest Hills
        <br />
        Subdivision, Novaliches, Quezon City
        <br />
        Contact #: 799 6048 / 0917 8222 208
      </div>

      <div className="text-right text-[10px] mb-3">Contract Date: {today}</div>

      <div className="flex gap-8 mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`preview-checkbox ${
              data.resort_type === "VP1" ? "checked" : ""
            }`}
          ></span>
          <span>VILLA PRESCILLA RESORT 1</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`preview-checkbox ${
              data.resort_type === "VP2" ? "checked" : ""
            }`}
          ></span>
          <span>VILLA PRESCILLA RESORT 2</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
        {/* Left Column */}
        <div className="flex">
          <span className="w-28">EVENT DATE:</span>
          <span className="flex-1 border-b border-black">
            {data.event_date}
          </span>
        </div>

        {/* Right Column - Day Tour */}
        <div className="flex items-center gap-2">
          <span
            className={`preview-checkbox ${data.is_day ? "checked" : ""}`}
          ></span>
          <span>DAY TOUR:</span>
          <span className="ml-2">
            {data.is_day
              ? formatTimeRange(data.day_start_time, data.day_end_time)
              : ""}
          </span>
        </div>

        {/* Left Column */}
        <div className="flex">
          <span className="w-28">OCCASION:</span>
          <span className="flex-1 border-b border-black">
            {data.event_name}
          </span>
        </div>

        {/* Right Column - Night Tour */}
        <div className="flex items-center gap-2">
          <span
            className={`preview-checkbox ${data.is_night ? "checked" : ""}`}
          ></span>
          <span>NIGHT TOUR:</span>
          <span className="ml-2">
            {data.is_night
              ? formatTimeRange(data.night_start_time, data.night_end_time)
              : ""}
          </span>
        </div>

        {/* Left Column */}
        <div className="flex">
          <span className="w-28">CLIENT:</span>
          <span className="flex-1 border-b border-black">
            {data.client_name}
          </span>
        </div>

        {/* Right Column - No. of Pax */}
        <div className="flex">
          <span className="w-24">NO. OF PAX:</span>
          <span className="flex-1 border-b border-black"></span>
        </div>

        {/* Left Column */}
        <div className="flex">
          <span className="w-28">ADDRESS:</span>
          <span className="flex-1 border-b border-black">
            {data.client_address}
          </span>
        </div>

        {/* Right Column - Contact */}
        <div className="flex">
          <span className="w-24">CONTACT #:</span>
          <span className="flex-1 border-b border-black">
            {data.client_contact}
          </span>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        {Object.entries(data.venues).map(([name, details]) => (
          <div
            key={name}
            className="flex justify-around items-center text-[10px]"
          >
            <span
              className={`preview-checkbox ${details.checked ? "checked" : ""}`}
            ></span>
            <span className="w-32">{name.toUpperCase()}</span>
            <span className="w-64 border-b border-black px-2">
              {details.note}
            </span>
            <p>Php</p>
            <span className="w-24 border-b border-black text-right">
              {details.amount}
            </span>
          </div>
        ))}
        <div className="text-[9px] italic mt-2">
          ** Function Hall is 6 hrs + 2 hrs prep time only. Exceeding hrs will
          be charged.
        </div>
      </div>

      <div className="mb-4">
        <div className="font-bold text-[10px] mb-2">
          OUTSIDE SUPPLIER'S CORKAGE FEES:
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "catering_services", label: "CATERING SERVICES", def: 3000 },
            { key: "mobile_bar", label: "MOBILE BAR", def: 2000 },
            { key: "sounds_lights", label: "SOUNDS & LIGHTS", def: 1500 },
            { key: "food_cart", label: "FOOD CART", def: 500 },
            { key: "photobooth", label: "PHOTOBOOTH", def: 1000 },
            { key: "band", label: "BAND", def: 1500 },
            { key: "projector", label: "PROJECTOR", def: 1000 },
            { key: "photo_video", label: "PHOTO/VIDEO", def: 1000 },
          ].map((supplier) => (
            <div key={supplier.key} className="flex items-center text-[10px]">
              <span
                className={`preview-checkbox ${
                  data.suppliers[supplier.key]?.checked ? "checked" : ""
                }`}
              ></span>
              <span className="w-28">{supplier.label}</span>
              <span className="w-12 text-right text-[8px] ">
                Php {supplier.def}
              </span>
              <span className="w-20 border-b border-black text-right ml-2">
                {data.suppliers[supplier.key]?.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-right mb-4">
        <span className="font-bold mr-2">TOTAL AMOUNT FOR VENUE</span>
        <span className="inline-block w-32 border-b-2 border-black text-right font-bold">
          Php {data.venue_total}
        </span>
      </div>

      <div className="text-[9px] mt-4">
        <div className="font-bold mb-1">IMPORTANT REMINDERS:</div>
        <ul className="list-disc ml-4 space-y-1">
          <li>
            Full payment is required TWO WEEKS before your event. Payments are
            NON-REFUNDABLE.
          </li>
          <li>
            Every high electricity consumption (rice cooker, water dispenser,
            electric stove, electric heater, iron, microwave, so on and so
            forth) will be paid Php 500 each.
          </li>
          <li>
            CORKAGE FEES must be paid by the client prior to the scheduled
            occasion. Clients who refused to pay the said fees will not be
            allowed to do any event services at Villa Prescilla Resort.
          </li>
        </ul>
      </div>

      <div className="flex justify-between mt-6 text-[10px]">
        <div className="text-center">
          <div>Acknowledged by:</div>
          <div className="w-48 border-b border-black mt-8 mb-1"></div>
          <div>Client's Signature over Printed Name</div>
        </div>
        <div className="text-center">
          <div>Reservation Confirmed by:</div>
          <div className="w-48 border-b border-black mt-8 mb-1"></div>
          <div>Villa Prescilla Resort & Events Services</div>
        </div>
      </div>
    </div>
  );
}
