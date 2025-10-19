import DAppLayout from '~~/components/DAppLayout';

// This layout removes Header/Footer from DApp pages
export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <DAppLayout>{children}</DAppLayout>;
}
