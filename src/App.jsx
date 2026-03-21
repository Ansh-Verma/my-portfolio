import Portfolio from "./Portfolio";
import Chatbot from "./Chatbot";
import CustomCursor from "./CustomCursor";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <CustomCursor />
      <Portfolio />
      <Chatbot />
      <Analytics />
    </>
  );
}