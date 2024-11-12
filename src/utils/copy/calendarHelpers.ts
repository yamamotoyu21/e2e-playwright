import { schedule } from "@meetsmore/config";
import { Page, expect } from "@playwright/test";
import moment from "moment";

export type TimeslotValuesType =
  keyof typeof schedule.timeRangeHashWithoutDefault;
const TIMESLOT_VALUES = Object.keys(
  schedule.timeRangeHashWithoutDefault
) as TimeslotValuesType[];

type DateTimeslot = {
  date: string;
  timeslot: TimeslotValuesType;
};

/**
 * Find a free date and timeslot in the calendar
 * @param page the Playwright page
 * @param options (optional) `date` and `timeslot` to select - YYYYMMDD e.g. '20210824' and '午前(9〜12時)'
 * @returns true if the date is blocked, false otherwise
 */
export const findFreeDateTimeslot = async (
  page: Page,
  options?: Partial<DateTimeslot>
) => {
  let found = false;
  let tries = 0;
  // Search an empty slot
  let date = options?.date ?? moment().add(1, "days").format("YYYYMMDD");
  let timeslot = options?.timeslot ?? TIMESLOT_VALUES[0];
  while (!found) {
    const dateBlocked = await isDateBlocked(page, date);
    if (!dateBlocked) {
      const timeslotAvailable = await isScheduleAvailable(page, date, timeslot);
      if (timeslotAvailable) {
        found = true;
      } else {
        // Timeslot is blocked, try next one
        const index = TIMESLOT_VALUES.indexOf(timeslot);
        if (index === TIMESLOT_VALUES.length - 1) {
          // Last timeslot, try next date
          date = moment(date, "YYYYMMDD").add(1, "days").format("YYYYMMDD");
          timeslot = TIMESLOT_VALUES[0];
        } else {
          timeslot = TIMESLOT_VALUES[index + 1];
        }
      }
    } else {
      // Date is blocked, try next one
      date = moment(date, "YYYYMMDD").add(1, "days").format("YYYYMMDD");
      timeslot = TIMESLOT_VALUES[0];
    }

    // Tries limit
    tries++;
    if (tries > 50) {
      throw new Error("findFreeDateTimeslot: tries limit reached");
    }
  }

  return {
    date,
    timeslot,
  };
};

/**
 * Check that a date is blocked
 * @param page the Playwright page
 * @param date date to check
 * @returns true if the date is blocked, false otherwise
 */
export const isDateBlocked = async (
  page: Page,
  date: string
): Promise<boolean> => {
  const dateLocator = page.getByTestId(`date-vertical-picker-${date}`).first();

  return (await dateLocator.getAttribute("data-is-blocked")) === "true";
};

/**
 * Check that a schedule is available
 * This check the date itself, and if it's not blocked, opens the timeslot popover and check the timeslot
 * The timeslot popover is closed before returning
 * @param page the Playwright page
 * @param date the date to check
 * @param timeslot the timeslot to check
 * @returns true if the schedule is available/free, false otherwise
 */
export const isScheduleAvailable = async (
  page: Page,
  date: string,
  timeslot: TimeslotValuesType
): Promise<boolean> => {
  const dateBlocked = await isDateBlocked(page, date);

  if (dateBlocked) {
    return false;
  }

  // Open the popover
  await page.getByTestId(`date-vertical-picker-${date}`).first().click();

  const timeslotLocator = page.getByLabel(timeslot);

  // Wait for popover to be visible
  await expect(page.getByLabel("時").first()).toBeVisible(); // Wait for any label to be visible

  // Check if option is present
  const count = await timeslotLocator.count();
  // If not present, then consider it's disabled
  let isAvailable = count !== 0;
  // If present, then check if it's disabled
  if (isAvailable) {
    isAvailable = !(await timeslotLocator.isDisabled());
    // If not disabled, check if it's already checked
    if (isAvailable) {
      isAvailable = !(await timeslotLocator.isChecked());
    }
  }

  // Close the popover
  await page.click("body", { position: { x: 1, y: 1 }, force: true });
  await expect(timeslotLocator).not.toBeVisible();

  return isAvailable;
};
