import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { ShieldAlert } from 'lucide-react'; // Standard icon library in most Radix/Tailwind setups

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <ShieldAlert className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You do not have the required permissions to view this page. If you believe this is an error, please contact your system administrator.
      </p>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <Button 
          onClick={() => navigate({ to: '/' })}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}