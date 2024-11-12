import { Locator } from "@playwright/test";
import moment from "moment";
import { MeetPage } from "src/pages/users/meets/MeetPage";

/**
 * Response of the book web meeting function
 */
interface BookWebMeetingResponse {
  /**
   * Month of the meeting (1-12)
   */
  month: string;
  /**
   * Day of the meeting (1-31)
   */
  day: string;
  /**
   * Time of the meeting (H:mm)
   */
  time: string;
}

/**
 * Utility function that book a web meeting for the requester
 * @description It starts with the current time and search (loop) for the next available time slot
 * @param meetPage meet page of the requester
 * @returns the time of the meeting - usually needed for checking that the chat messages are correct
 */
export async function e2eBookWebMeeting(
  meetPage: MeetPage
): Promise<BookWebMeetingResponse> {
  // Click on the booking button
  const bookMeetingPopup = await meetPage.clickBookMeeting();

  // Select Web相談
  await bookMeetingPopup.selectWebMeeting();
  await bookMeetingPopup.clickOnNext();
  await bookMeetingPopup.waitForCalendarLoaded();

  // Extract current selected date
  const currentSelectedDate = parseInt(
    (
      (await bookMeetingPopup.page
        .getByTestId(/^button-schedule-date-day-/i)
        .and(bookMeetingPopup.page.locator(".Mui-selected"))
        .getAttribute("data-testid")) ?? ""
    ).replace("button-schedule-date-day-", ""),
    10
  );
  if (isNaN(currentSelectedDate)) {
    throw new Error("Unable to extract current selected date");
  }

  // Used as a safeguard
  let daysAdded = 0;

  // To keep track of date and time
  const date = moment();
  // Ensures that if now we are the 31 and the selectedDate is 01
  // We actually move the `moment()` to the next month
  while (date.date() !== currentSelectedDate) {
    date.add(1, "d");
  }
  let timeStr: string | undefined;

  // Loop until we find an available time slot
  let freeTimeSlot: Locator | undefined;
  while (!freeTimeSlot) {
    // Check if the time slot is available
    try {
      freeTimeSlot = await bookMeetingPopup.getFirstFreeTime();
    } catch {
      // Ignore
    }

    // If found, we parse the time and exit
    if (freeTimeSlot) {
      const value = await freeTimeSlot.getAttribute("data-testid");

      if (!value) {
        throw new Error("Unable to extract time slot");
      }

      timeStr = value.replace("button-schedule-date-time-", "");
      await bookMeetingPopup.selectTime(timeStr);
      break;
    }

    // Else we add a day, click in the calendar on it and continue
    date.add(1, "d");

    daysAdded += 1;
    if (daysAdded >= 3) {
      throw new Error("Unable to find an available time slot");
    }

    // If we don't see the next day, then we need to go to the next week
    const dateStr = date.format("D");
    if (!(await bookMeetingPopup.isDayVisible(dateStr))) {
      await bookMeetingPopup.clickGoToNextWeek();
    }

    // Click on the next day
    await bookMeetingPopup.selectDay(dateStr);
  }

  // Specify that the pro should provide the URL
  await bookMeetingPopup.selectProShouldSetupLink();
  // Save
  await bookMeetingPopup.clickOnSave();

  if (!timeStr) {
    throw new Error("Time slot not found");
  }

  return {
    month: date.format("M"),
    day: date.format("D"),
    time: timeStr,
  };
}
