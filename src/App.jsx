import React, { lazy, Suspense } from "react";
import Portfolio from "./Portfolio";

const Chatbot = lazy(() => import("./Chatbot"));

export default function App() {
  return (
    <>
      <Portfolio />
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </>
  );
}