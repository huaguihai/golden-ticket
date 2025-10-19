import React from 'react';

export const metadata = {
  title: 'Golden Ticket DApp',
  description: 'Privacy-Preserving Asset Verification DApp',
};

export default function GoldenTicketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Simply return children, no <html> or <body>
}