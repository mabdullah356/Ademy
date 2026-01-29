import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  Header, Home, Footer, Login, SignUp, Course, Cart, InstructorHome, InstructorCreateCourse,
  InstructorEditCourse,
  InstructorViewCourse,
  SuccessPage,
  CancelPage,
  MyOrders
} from "./Components/Pages/Index"

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/course/:id' element={<Course />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/instructor-home' element={<InstructorHome />} />
        <Route path='/create-course' element={<InstructorCreateCourse />} />
        <Route path='/edit-course/:id' element={<InstructorEditCourse />} />
        <Route path='/course-/:id' element={<InstructorViewCourse />} />

        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/my-orders" element={<MyOrders />} />

      </Routes>
      <Footer />
    </Router>
  )
}

export default App
