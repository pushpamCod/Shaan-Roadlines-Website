import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

const HomePage = lazy(() => import("./pages/HomePage"));
const BusSearchPage = lazy(() => import("./pages/bus/BusSearchPage"));
const BusResultsPage = lazy(() => import("./pages/bus/BusResultsPage"));
const BusSeatPage = lazy(() => import("./pages/bus/BusSeatPage"));
const TrainSearchPage = lazy(() => import("./pages/train/TrainSearchPage"));
const TrainResultsPage = lazy(() => import("./pages/train/TrainResultsPage"));
const TrainSeatPage = lazy(() => import("./pages/train/TrainSeatPage"));
const FlightSearchPage = lazy(() => import("./pages/flight/FlightSearchPage"));
const FlightResultsPage = lazy(
  () => import("./pages/flight/FlightResultsPage"),
);
const FlightSeatPage = lazy(() => import("./pages/flight/FlightSeatPage"));
const HotelSearchPage = lazy(() => import("./pages/hotel/HotelSearchPage"));
const HotelResultsPage = lazy(() => import("./pages/hotel/HotelResultsPage"));
const HotelDetailPage = lazy(() => import("./pages/hotel/HotelDetailPage"));
const HotelRoomsPage = lazy(() => import("./pages/hotel/HotelRoomsPage"));
const BookingSummaryPage = lazy(
  () => import("./pages/booking/BookingSummaryPage"),
);
const PaymentPage = lazy(() => import("./pages/booking/PaymentPage"));
const BookingSuccessPage = lazy(
  () => import("./pages/booking/BookingSuccessPage"),
);
const BookingFailurePage = lazy(
  () => import("./pages/booking/BookingFailurePage"),
);
const UserDashboardPage = lazy(() => import("./pages/UserDashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AboutFounderPage = lazy(() => import("./pages/AboutFounderPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function PageFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm font-body">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bus" element={<BusSearchPage />} />
              <Route path="/bus/results" element={<BusResultsPage />} />
              <Route path="/bus/:id/seats" element={<BusSeatPage />} />
              <Route path="/train" element={<TrainSearchPage />} />
              <Route path="/train/results" element={<TrainResultsPage />} />
              <Route path="/train/:id/seats" element={<TrainSeatPage />} />
              <Route path="/flight" element={<FlightSearchPage />} />
              <Route path="/flight/results" element={<FlightResultsPage />} />
              <Route path="/flight/:id/seats" element={<FlightSeatPage />} />
              <Route path="/hotel" element={<HotelSearchPage />} />
              <Route path="/hotel/results" element={<HotelResultsPage />} />
              <Route path="/hotel/:id" element={<HotelDetailPage />} />
              <Route path="/hotel/:id/rooms" element={<HotelRoomsPage />} />
              <Route path="/booking/summary" element={<BookingSummaryPage />} />
              <Route path="/booking/payment" element={<PaymentPage />} />
              <Route path="/booking/success" element={<BookingSuccessPage />} />
              <Route path="/booking/failure" element={<BookingFailurePage />} />
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about-founder" element={<AboutFounderPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
