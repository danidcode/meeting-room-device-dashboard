# Meeting Room Device Dashboard

A frontend project for monitoring and managing a fleet of meeting-room devices, built with React, TypeScript, Tailwind CSS, and Chart.js with react-chartjs-2.

## Getting started

Use Node.js 24 LTS and npm.

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal (normally http://localhost:5173).

```sh
npm run build   # Type-check and create a production build
npm run lint    # Run the linter
npm run format # Format source, configuration, and documentation with Prettier
npm run format:check # Check formatting without changing files
npm test        # Run automated tests once
npm run test:watch # Re-run tests while editing
npm run preview # Serve the production build locally
```

## Structure

```text
src/
  components/  # Dashboard and its form, table, chart, dialog, and toast
  constants/   # Device statuses, labels, and color mappings
  hooks/       # Device table state and toast timing
  utils/       # Initial fleet preparation
  main.tsx     # React entry point; renders Dashboard in StrictMode
  index.css    # Tailwind and base styles
  types.ts     # Device TypeScript types
```

Dashboard state stays in the component. Initial fleet preparation lives in utils, and shared status values and color mappings live in constants.

## Scope

- Display each device's name, model, and status: online, in meeting, offline, or deactivated.
- Show summary counts for the fleet.
- Add devices with a name, description, and status, updating the list and summary counts.
- Remove devices from the list.
- Optional: filter devices by name and chart status counts over time.

## Data

- `devices.json`: 433 sample devices.
- `status-history.json`: 56 months of status counts.

The data can be adapted to suit the application. Summary counts can be derived on the client.

## Implemented features

- Device table with name, description, model, and status.
- Fleet summary counts that update when devices are added or removed.
- Native add-device dialog with name validation, optional description, and status selection. Cancel and Escape close it; focus returns to the Add device button.
- Remove action for each device.
- Case-insensitive name search and pagination with 25 devices per page.
- Monthly status chart with a readable data table as an accessible alternative.
- Responsive layout and plain English UI text, with no translation layer.
- Dismissible confirmation toasts for adding and removing devices, automatically hidden after four seconds.

## Decisions and limits

- Devices live in React state. Refreshing restores the supplied sample data; no backend or persistence is required for this demo.
- Summary counts are derived from the full fleet, independent of the table filter.
- The add form follows the requested fields. New devices display “Not specified” for model.
- Historical counts come from the supplied history file. Current fleet changes do not rewrite past months.
- The table, filtering, pagination, and form use native HTML and React. Chart rendering is handled by Chart.js.
- `useDeviceTable` groups search and pagination state and handlers. Filtered rows and counts are derived during rendering, without effects or duplicated state.

## Manual checks

1. Add a device and verify that the total and selected status count increase.
2. Submit a whitespace-only name and verify that validation prevents saving.
3. Remove a device and verify that the corresponding counts decrease.
4. Search by name, try a query with no matches, and clear it.
5. Navigate pages and remove the last item on the final filtered page.
6. Check the chart and expand its data table; check the layout on a narrow screen.

## Automated tests

Vitest and React Testing Library cover adding/removing devices, summary updates, invalid and cancelled forms, search and pagination edge cases, accessible confirmation messages, manual dismissal, four-second expiry, replacement notifications (including repeated text), and timer cleanup. Timer tests use fake time to stay fast and deterministic.
