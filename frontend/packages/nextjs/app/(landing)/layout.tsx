import { Header } from '~~/components/Header';
import { Footer } from '~~/components/Footer';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative flex flex-col flex-1">{children}</main>
      <Footer />
    </>
  );
}
