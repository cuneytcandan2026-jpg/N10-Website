# N10 Academy Website

Static HTML website for N10 Academy — Edmonton, North London.

## Development

Start the local server:

```bash
node serve.mjs
```

Runs at `http://localhost:3000`.

Take screenshots (saves to `./temporary screenshots/`):

```bash
node screenshot.mjs http://localhost:3000
node screenshot.mjs http://localhost:3000/coaching.html
```

---

## Connecting the 1-to-1 Booking System

The 1-to-1 Coaching page (`coaching.html`) includes a booking section that renders a live calendar embed once a URL is configured, or a polished placeholder until it is.

### Step 1 — Find your booking URL

**Option A: Calendly (recommended)**

1. Sign up at [calendly.com](https://calendly.com)
2. Create a new Event Type — name it "1-to-1 Football Coaching Session"
3. Set the duration to 60 minutes
4. Connect your Google Calendar (Settings → Calendar Connections → Google Calendar)
5. In Event Type settings, copy the event URL — it will look like:
   `https://calendly.com/coachnathanemanuel/1to1`

**Option B: Cal.com (free, open source alternative)**

1. Sign up at [cal.com](https://cal.com)
2. Create a new Event Type — name it "1-to-1 Coaching"
3. Connect your Google Calendar under Integrations → Google Calendar
4. Copy the event embed URL — it will look like:
   `https://cal.com/coachnathanemanuel/1to1`

---

### Step 2 — Add the URL to coaching.html

Open `coaching.html` and find this block near the top of `<body>`:

```html
<!-- BOOKING URL CONFIG — paste your Calendly or Cal.com embed URL here when ready -->
<!-- Example: var BOOKING_URL = 'https://calendly.com/coachnathanemanuel/1to1'; -->
<script>var BOOKING_URL = '';</script>
```

Replace the empty string with your booking URL:

```html
<script>var BOOKING_URL = 'https://calendly.com/coachnathanemanuel/1to1';</script>
```

Save the file and reload `http://localhost:3000/coaching.html` — the booking calendar will appear automatically in the **Book Your Session** section.

---

### Step 3 — Google Calendar sync

Both Calendly and Cal.com support two-way sync with Google Calendar:

- **Calendly:** Settings → Calendar Connections → Google Calendar → Connect. Calendly will check your Google Calendar for conflicts and add confirmed bookings automatically.
- **Cal.com:** Settings → Integrations → Google Calendar → Connect. Same behaviour.

Once connected, every booking made through the website will appear in Nathan's Google Calendar, and the calendar will block out times that are already busy.

---

### Booking confirmation emails

Both platforms send automatic confirmation emails to the person who booked, including session time, location placeholder, and any custom messages you configure in the event type settings.

To add reminders: enable email/SMS reminders inside the Event Type settings on Calendly or Cal.com.

---

### Customising the booking form fields

The booking form in Calendly / Cal.com can be extended to capture additional information from parents when they book. Inside your Event Type settings, add custom questions for:

- Player name and age
- Player position
- Current club or team
- Areas the player wants to improve
- Any injury or medical information

---

### Notes

- The booking placeholder will show automatically if `BOOKING_URL` is empty — no broken widgets or errors.
- For group sessions, academy trials or specialist requests, direct parents to the contact details shown on the page: 07539 072029 / coachnathanemanuel@outlook.com
- If you switch from Calendly to Cal.com (or vice versa), simply update the `BOOKING_URL` value — no other code changes needed.
