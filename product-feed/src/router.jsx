import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Cart from "./Cart.js";

// Layout and Root Components
const Products = lazy(() => import("./Products.js"));
const ProductDetail = lazy(() => import("./ProductDetail.js"));

export const routers = createBrowserRouter([
  {
    path: "/",

    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    ),
  },
  {
    path: "/page/:page",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetail />
      </Suspense>
    ),
  },
  {
    path: "/cart",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Cart />
      </Suspense>
    ),
  },
]);
