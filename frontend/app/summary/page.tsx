import CalendarSummary from "@/components/calendar/summary.calendar";
import { title } from "@/components/primitives";

export default function BlogPage() {
  return (
    <div>
      <h1 className={title()}>welcome to Summary Dashboard</h1>
      <CalendarSummary />
    </div>
  );
}
