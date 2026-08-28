"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { WizardProvider } from "@/lib/wizard-context";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <WizardProvider>
          {children}
          <Toaster position="top-center" richColors />
        </WizardProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
