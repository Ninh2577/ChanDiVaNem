import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Culture from './pages/Culture';
import Destinations from './pages/Destinations';
import Cuisine from './pages/Cuisine';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import NewsletterPage from './pages/NewsletterPage';
import About from './pages/About';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminUsers from './pages/AdminUsers';
import ContributorApply from './pages/ContributorApply';
import CTVLayout from './components/CTVLayout';
import CTVDashboard from './pages/CTVDashboard';
import CTVMyPosts from './pages/CTVMyPosts';
import CTVProfile from './pages/CTVProfile';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import AdminNavigation from './pages/AdminNavigation';
import AdminHomepage from './pages/AdminHomepage';
import AdminCategories from './pages/AdminCategories';
import AdminAds from './pages/AdminAds';
import NotFound from './pages/NotFound';
import SearchResults from './pages/SearchResults';
import Archive from './pages/Archive';
import AuthorProfile from './pages/AuthorProfile';
import SavedPosts from './pages/SavedPosts';
import ProtectedRoute from './components/ProtectedRoute';
import { AdDeliveryManager } from './components/AdDeliveryManager';

import './index.css';

const PublicLayout = () => {
  return (
    <>
      <AdDeliveryManager />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Header & Footer */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="culture" element={<Culture />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="cuisine" element={<Cuisine />} />
          <Route path="blog" element={<Blog />} />
          <Route path="post/:slug" element={<PostDetail />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="tag/:slug" element={<Archive />} />
          <Route path="category/:slug" element={<Archive />} />
          <Route path="author/:username" element={<AuthorProfile />} />
          <Route path="saved" element={<SavedPosts />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="about" element={<About />} />
          <Route path="apply-ctv" element={<ContributorApply />} />
        </Route>

        {/* Authentication Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes - No public Header/Footer */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/create" element={<CreatePost />} />
            <Route path="posts/edit/:id" element={<CreatePost />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="navigation" element={<AdminNavigation />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="ads" element={<AdminAds />} />
          </Route>
        </Route>

        {/* CTV Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'CTV']} />}>
          <Route path="/ctv" element={<CTVLayout />}>
            <Route index element={<CTVDashboard />} />
            <Route path="my-posts" element={<CTVMyPosts />} />
            <Route path="my-posts/create" element={<CreatePost />} />
            <Route path="my-posts/edit/:id" element={<CreatePost />} />
            <Route path="profile" element={<CTVProfile />} />
          </Route>
        </Route>

        {/* 404 Not Found (Catch all) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
