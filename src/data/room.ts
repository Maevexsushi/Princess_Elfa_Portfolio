/**
 * The 3D room on the Setup page.
 *
 * Everything a visitor can read in the room lives here, so it can be edited
 * without touching the 3D code: what I'm doing at each hour, the camera
 * views, and the objects that react when clicked.
 */

export type RoomMode = "live" | "work" | "coffee" | "rest" | "code" | "sleep";
export type Activity = Exclude<RoomMode, "live">;

export const roomModes: { value: RoomMode; label: string }[] = [
  { value: "live", label: "Live" },
  { value: "work", label: "Work" },
  { value: "coffee", label: "Coffee" },
  { value: "rest", label: "Rest" },
  { value: "code", label: "Code late" },
  { value: "sleep", label: "Sleep" },
];

/**
 * "Live" mode follows this day, in Philippine time. It's a playful sketch
 * of a typical day rather than a timetable — change it freely.
 * Each entry runs from `from` (hour, 0–24) until the next entry starts.
 */
export const daySchedule: { from: number; activity: Activity }[] = [
  { from: 0, activity: "sleep" },
  { from: 7, activity: "coffee" },
  { from: 8, activity: "work" },
  { from: 12, activity: "rest" },
  { from: 13, activity: "work" },
  { from: 18, activity: "rest" },
  { from: 21, activity: "code" },
];

export function activityAt(hour: number): Activity {
  let current = daySchedule[0].activity;
  for (const slot of daySchedule) if (hour >= slot.from) current = slot.activity;
  return current;
}

export const activityLabel: Record<Activity, string> = {
  work: "Working",
  coffee: "Making coffee",
  rest: "Taking a break",
  code: "Coding late",
  sleep: "Asleep",
};

export type CameraView = "room" | "desk" | "bed" | "window";

export const cameraViews: { value: CameraView; label: string }[] = [
  { value: "room", label: "Room" },
  { value: "desk", label: "Desk" },
  { value: "bed", label: "Bed" },
  { value: "window", label: "Window" },
];

/** Where the weather in the window comes from. */
export const weatherLocation = { label: "Manila", latitude: 14.5995, longitude: 120.9842 };

export type RoomItemId =
  | "monitor"
  | "laptop"
  | "deskLamp"
  | "mug"
  | "chair"
  | "curtains"
  | "clock"
  | "diploma"
  | "cap"
  | "plant"
  | "bedLamp"
  | "fairyLights"
  | "poster"
  | "headphones"
  | "photo";

/**
 * The objects that react. `hint` is what the "Things to find" list shows
 * before an object has been found; `note` is what appears once it has.
 */
export const roomItems: {
  id: RoomItemId;
  label: string;
  hint: string;
  note: string;
  link?: { href: string; label: string };
}[] = [
  {
    id: "monitor",
    label: "Monitor",
    hint: "Something on the desk is always on.",
    note: "Click again to change what's on screen: code, Acadify, or this portfolio.",
    link: { href: "/projects", label: "See the projects" },
  },
  {
    id: "laptop",
    label: "Laptop",
    hint: "The second screen folds.",
    note: "The laptop opens and closes.",
  },
  {
    id: "deskLamp",
    label: "Desk lamp",
    hint: "For working after dark.",
    note: "The desk lamp switches on and off.",
  },
  {
    id: "mug",
    label: "Coffee mug",
    hint: "Never empty for long.",
    note: "Refilled. Fresh coffee steams for a while.",
  },
  {
    id: "chair",
    label: "Chair",
    hint: "Every desk chair is a ride.",
    note: "It spins.",
  },
  {
    id: "curtains",
    label: "Curtains",
    hint: "Let the light in.",
    note: "The curtains open and close.",
  },
  {
    id: "clock",
    label: "Wall clock",
    hint: "It keeps Philippine time.",
    note: "Switches between 12- and 24-hour time.",
  },
  {
    id: "diploma",
    label: "Diploma",
    hint: "Framed on the wall.",
    note: "BS Information Technology, Cum Laude — Bulacan State University, 2026.",
    link: { href: "/experience", label: "Education" },
  },
  {
    id: "cap",
    label: "Graduation cap",
    hint: "On the shelf, waiting to be thrown.",
    note: "Class of 2026. Toss it again.",
  },
  {
    id: "plant",
    label: "Plant",
    hint: "The only coworker who never complains.",
    note: "Watered. It's thriving.",
  },
  {
    id: "bedLamp",
    label: "Bedside lamp",
    hint: "Next to the bed.",
    note: "The bedside lamp switches on and off.",
  },
  {
    id: "fairyLights",
    label: "Fairy lights",
    hint: "Strung along the top of the walls.",
    note: "Off, on, or twinkling.",
  },
  {
    id: "poster",
    label: "Poster",
    hint: "Words to work by.",
    note: "Click for another motto.",
  },
  {
    id: "headphones",
    label: "Headphones",
    hint: "Hanging on their stand.",
    note: "Lo-fi on. Click again for quiet.",
  },
  {
    id: "photo",
    label: "Graduation photo",
    hint: "A frame on the nightstand.",
    note: "Graduation day, 2026.",
    link: { href: "/experience", label: "Education" },
  },
];

export const posterMottos = ["KEEP\nSHIPPING", "MAKE IT\nWORK", "THEN MAKE\nIT RIGHT", "LEARN\nBY BUILDING"];
