// app/api/generate-contract/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log(formData);

    // Parse form data
    const data = {
      // Client details
      client_name: formData.get("client_name") as string,
      client_address: formData.get("client_address") as string,
      client_contact: formData.get("client_contact") as string,

      // Event details
      resort_type: formData.get("resort_type") as string,
      is_day: formData.get("is_day") === "on",
      day_time: formData.get("day_time") as string,
      is_night: formData.get("is_night") === "on",
      night_time: formData.get("night_time") as string,
      event_name: formData.get("event_name") as string,
      event_date: formData.get("event_date") as string,

      // Venue rates
      venues: {
        "Swimming Pool": {
          checked: formData.get("venue_Swimming Pool") === "on",
          note: formData.get("note_Swimming Pool") as string,
          amount: formData.get("amount_Swimming Pool") as string,
        },
        "Room 1": {
          checked: formData.get("venue_Room 1") === "on",
          note: formData.get("note_Room 1") as string,
          amount: formData.get("amount_Room 1") as string,
        },
        "Room 2": {
          checked: formData.get("venue_Room 2") === "on",
          note: formData.get("note_Room 2") as string,
          amount: formData.get("amount_Room 2") as string,
        },
        "Kitchen lounge": {
          checked: formData.get("venue_Kitchen lounge") === "on",
          note: formData.get("note_Kitchen lounge") as string,
          amount: formData.get("amount_Kitchen lounge") as string,
        },
        "Family room": {
          checked: formData.get("venue_Family room") === "on",
          note: formData.get("note_Family room") as string,
          amount: formData.get("amount_Family room") as string,
        },
        "Function Hall": {
          checked: formData.get("venue_Function Hall") === "on",
          note: formData.get("note_Function Hall") as string,
          amount: formData.get("amount_Function Hall") as string,
        },
        Others: {
          checked: formData.get("venue_Others") === "on",
          note: formData.get("note_Others") as string,
          amount: formData.get("amount_Others") as string,
        },
      },

      // Suppliers
      suppliers: {
        catering_services: {
          checked: formData.get("check_catering_services") === "on",
          amount: formData.get("catering_services") as string,
        },
        sounds_lights: {
          checked: formData.get("check_sounds_lights") === "on",
          amount: formData.get("sounds_lights") as string,
        },
        photobooth: {
          checked: formData.get("check_photobooth") === "on",
          amount: formData.get("photobooth") as string,
        },
        projector: {
          checked: formData.get("check_projector") === "on",
          amount: formData.get("projector") as string,
        },
        mobile_bar: {
          checked: formData.get("check_mobile_bar") === "on",
          amount: formData.get("mobile_bar") as string,
        },
        food_cart: {
          checked: formData.get("check_food_cart") === "on",
          amount: formData.get("food_cart") as string,
        },
        band: {
          checked: formData.get("check_band") === "on",
          amount: formData.get("band") as string,
        },
        photo_video: {
          checked: formData.get("check_photo_video") === "on",
          amount: formData.get("photo_video") as string,
        },
      },

      // Total
      venue_total: formData.get("venue_total") as string,
    };

    // 👇 READ TEMPLATE FILE (This is new!)
    const templatePath = path.join(
      process.cwd(),
      "app",
      "templates",
      "contract-template.html"
    );
    let html = fs.readFileSync(templatePath, "utf-8");

    // 👇 REPLACE PLACEHOLDERS (This is new!)
    html = replacePlaceholders(html, data);

    // Launch Puppeteer (same as before)
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF (same as before)
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // Save to public folder (same as before)
    const publicDir = path.join(process.cwd(), "public", "contracts");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filename = `contract_${Date.now()}.pdf`;
    const filepath = path.join(publicDir, filename);
    fs.writeFileSync(filepath, pdfBuffer);

    // Convert to base64 (same as before)
    const base64 = pdfBuffer.toString();

    return NextResponse.json({
      success: true,
      filePath: `/contracts/${filename}`,
      base64: base64,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

// 👇 NEW FUNCTION - This replaces all {{PLACEHOLDERS}} with actual data
function replacePlaceholders(html: string, data: any): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate venue items HTML
  const venueItems = Object.entries(data.venues)
    .map(
      ([name, details]: [string, any]) => `
      <div class="venue-item">
        <div class="venue-checkbox ${details.checked ? "checked" : ""}"></div>
        <span class="venue-name">${name.toUpperCase()}</span>
        <span class="venue-note">${details.note || ""}</span>
        <span class="venue-amount">Php ${details.amount || ""}</span>
      </div>
    `
    )
    .join("");

  // All the placeholders to replace
  const replacements: Record<string, string> = {
    "{{CONTRACT_DATE}}": today,
    "{{VP1_CHECKED}}": data.resort_type === "VP1" ? "checked" : "",
    "{{VP2_CHECKED}}": data.resort_type === "VP2" ? "checked" : "",
    "{{EVENT_DATE}}": data.event_date || "",
    "{{EVENT_NAME}}": data.event_name || "",
    "{{CLIENT_NAME}}": data.client_name || "",
    "{{CLIENT_ADDRESS}}": data.client_address || "",
    "{{CLIENT_CONTACT}}": data.client_contact || "",
    "{{DAY_CHECKED}}": data.is_day ? "checked" : "",
    "{{DAY_TIME}}": data.is_day ? data.day_time || "" : "",
    "{{NIGHT_CHECKED}}": data.is_night ? "checked" : "",
    "{{NIGHT_TIME}}": data.is_night ? data.night_time || "" : "",
    "{{VENUE_ITEMS}}": venueItems,
    "{{CATERING_CHECKED}}": data.suppliers.catering_services.checked
      ? "checked"
      : "",
    "{{CATERING_AMOUNT}}": data.suppliers.catering_services.amount || "",
    "{{SOUNDS_LIGHTS_CHECKED}}": data.suppliers.sounds_lights.checked
      ? "checked"
      : "",
    "{{SOUNDS_LIGHTS_AMOUNT}}": data.suppliers.sounds_lights.amount || "",
    "{{PHOTOBOOTH_CHECKED}}": data.suppliers.photobooth.checked
      ? "checked"
      : "",
    "{{PHOTOBOOTH_AMOUNT}}": data.suppliers.photobooth.amount || "",
    "{{PROJECTOR_CHECKED}}": data.suppliers.projector.checked ? "checked" : "",
    "{{PROJECTOR_AMOUNT}}": data.suppliers.projector.amount || "",
    "{{MOBILE_BAR_CHECKED}}": data.suppliers.mobile_bar.checked
      ? "checked"
      : "",
    "{{MOBILE_BAR_AMOUNT}}": data.suppliers.mobile_bar.amount || "",
    "{{FOOD_CART_CHECKED}}": data.suppliers.food_cart.checked ? "checked" : "",
    "{{FOOD_CART_AMOUNT}}": data.suppliers.food_cart.amount || "",
    "{{BAND_CHECKED}}": data.suppliers.band.checked ? "checked" : "",
    "{{BAND_AMOUNT}}": data.suppliers.band.amount || "",
    "{{PHOTO_VIDEO_CHECKED}}": data.suppliers.photo_video.checked
      ? "checked"
      : "",
    "{{PHOTO_VIDEO_AMOUNT}}": data.suppliers.photo_video.amount || "",
    "{{VENUE_TOTAL}}": data.venue_total || "",
  };

  // Replace all placeholders in the HTML
  let result = html;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key, "g"), value);
  }

  return result;
}
