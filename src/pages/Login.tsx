import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth, Role, User } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock user generation based on selected role
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      name: `Test ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`,
      email: `${selectedRole}@hospital.com`,
      role: selectedRole,
    };

    login(mockUser);
    
    // Redirect to the dashboard after successful "auth"
    navigate({ to: '/' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Hospital System Login</CardTitle>
          <CardDescription>
            Select a role to enter the development environment.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Login As</Label>
              <Select 
                value={selectedRole} 
                onValueChange={(value: Role) => setSelectedRole(value)}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                  <SelectItem value="doctor">Doctor (Clinical Access)</SelectItem>
                  <SelectItem value="manager">Manager (Operations Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-700 border border-blue-200">
              <p><strong>Dev Note:</strong> In production, this dropdown will be replaced by standard email/password authentication.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}