import {HeaderReports} from "./components/header";
import Search from "./components/search";
import ReportItem from "./components/reportItem";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 md:p-9  w-full max-w-7xl mx-auto font-['Calibri']">
      <HeaderReports />
      
      <Search searchTerm={"search..."} />

      <div className="w-full mt-6 space-y-6">
        {['Today', 'Yesterday', 'This week', 'This month', 'This year', 'Older'].map((period) => (
          <ReportItem key={period} period={period} />
        ))}
      </div>
    </main>
  );
}
