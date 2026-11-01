import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import LoginView from "@/components/auth/LoginView";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <LoginView />
      </main>
      <Footer />
    </>
  );
}

