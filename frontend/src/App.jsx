import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Layout
import Footer from "./shared/components/Layout/Footer";
import Header from "./shared/components/Layout/Header";
import Menu from "./shared/components/Layout/Menu";
import Sidebar from "./shared/components/Layout/Sidebar";
import VideoModal from "./shared/components/VideoModal";

// Import Pages
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import PaymentSuccess from "./pages/PaymentSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
//Redux

import { Provider } from "react-redux";
import store from "./redux-setup/store";

const App = () => {

  const [openVideo, setOpenVideo] = React.useState(false);


  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Full page routes */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />


          {/* Layout routes */}
          <Route
            path="*"
            element={
              <div>
                <Header />
                {/*	Body	*/}
                <div id="body">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <Menu />
                      </div>
                    </div>
                    <div className="row">
                      <div id="main" className="col-lg-8 col-md-12 col-sm-12">


                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/categories/:id" element={<Category />} />
                          <Route path="/products/:id" element={<ProductDetails />} />
                          <Route path="/search" element={<Search />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/success" element={<Success />} />
                          <Route path="/payment-success" element={<PaymentSuccess />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="*" element={<NotFound />} />


                        </Routes>
                      </div>
                      <Sidebar setOpenVideo={setOpenVideo}/>
                      <VideoModal open={openVideo} onClose={() => setOpenVideo(false)} />
                    </div>
                  </div>
                </div>
                {/*	End Body	*/}
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App;