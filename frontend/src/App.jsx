import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PageTransition from "./components/common/PageTransition";
import GradientBackground from "./components/common/GradientBackground";

import Home from "./pages/public/Home";
import BrowsePhotographers from "./pages/public/BrowsePhotographers";
import PhotographerProfile from "./pages/public/PhotographerProfile";
import AlbumView from "./pages/public/AlbumView";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import BookPhotographer from "./pages/client/BookPhotographer";
import MyBookings from "./pages/client/MyBookings";
import BookingDetail from "./pages/client/BookingDetail";

import Dashboard from "./pages/photographer/Dashboard";
import MyAlbums from "./pages/photographer/MyAlbums";
import AlbumEditor from "./pages/photographer/AlbumEditor";
import ReceivedBookings from "./pages/photographer/ReceivedBookings";
import PendingPayments from "./pages/photographer/PendingPayments";
import ProfileSettings from "./pages/photographer/ProfileSettings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePhotographers from "./pages/admin/ManagePhotographers";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageReviews from "./pages/admin/ManageReviews";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/photographers" element={<PageTransition><BrowsePhotographers /></PageTransition>} />
        <Route path="/photographers/:id" element={<PageTransition><PhotographerProfile /></PageTransition>} />
        <Route path="/albums/:id" element={<PageTransition><AlbumView /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

        <Route path="/photographers/:id/book" element={
          <ProtectedRoute><PageTransition><BookPhotographer /></PageTransition></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute><PageTransition><MyBookings /></PageTransition></ProtectedRoute>
        } />
        <Route path="/my-bookings/:id" element={
          <ProtectedRoute><PageTransition><BookingDetail /></PageTransition></ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["photographer", "admin"]}><PageTransition><Dashboard /></PageTransition></ProtectedRoute>
        } />
        <Route path="/dashboard/albums" element={
          <ProtectedRoute allowedRoles={["photographer", "admin"]}><PageTransition><MyAlbums /></PageTransition></ProtectedRoute>
        } />
        <Route path="/dashboard/albums/:id" element={
          <ProtectedRoute allowedRoles={["photographer", "admin"]}><PageTransition><AlbumEditor /></PageTransition></ProtectedRoute>
        } />
        <Route path="/dashboard/bookings" element={
          <ProtectedRoute allowedRoles={["photographer", "admin"]}><PageTransition><ReceivedBookings /></PageTransition></ProtectedRoute>
        } />
        <Route path="/dashboard/payments" element={
          <ProtectedRoute allowedRoles={["photographer", "admin"]}><PageTransition><PendingPayments /></PageTransition></ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute allowedRoles={["photographer", "admin"]}><PageTransition><ProfileSettings /></PageTransition></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["admin"]}><PageTransition><ManageUsers /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/photographers" element={
          <ProtectedRoute allowedRoles={["admin"]}><PageTransition><ManagePhotographers /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute allowedRoles={["admin"]}><PageTransition><ManageBookings /></PageTransition></ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute allowedRoles={["admin"]}><PageTransition><ManageReviews /></PageTransition></ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col bg-bg text-text">
        <GradientBackground />
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;