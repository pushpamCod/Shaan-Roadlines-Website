import { ChatbotButton } from "@/components/common/ChatbotButton";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  fullBleed?: boolean;
}

export function Layout({
  children,
  hideFooter = false,
  fullBleed = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${fullBleed ? "" : ""}`}>{children}</main>
      {!hideFooter && <Footer />}
      <Toaster richColors position="top-right" />
      <ChatbotButton />
    </div>
  );
}
