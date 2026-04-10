import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MonthlyCalendar from "@/components/HebrewCalendar/MonthlyCalendar";

export const metadata = {
  title: "לוח עברי חודשי | Schedule",
  description: "לוח עברי עם זמני זריחה, שקיעה ודף יומי לכל יום",
};

export default function CalendarPage() {
  return (
    <DefaultLayout>
      <MonthlyCalendar />
    </DefaultLayout>
  );
}
