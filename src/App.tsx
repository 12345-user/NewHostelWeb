import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Activities from './pages/Activities'
import ActivityDetail from './pages/ActivityDetail'
import People from './pages/People'
import Items from './pages/Items'
import AboutDetail from './pages/AboutDetail'
import Admin from './pages/Admin'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/people" element={<People />} />
          <Route path="/items" element={<Items />} />
          <Route path="/about" element={<AboutDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
