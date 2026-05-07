import React, { useState } from 'react';
import { useAuth, Role, User } from '../../lib/auth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { toast } from 'sonner'; // Assuming sonner is used based on src/components/ui/sonner.tsx

// Mock data for initial development
const MOCK_USERS: User[] = [
  { id: '1', name: 'Dr. Sarah Smith', email: 'sarah.smith@hospital.com', role: 'doctor' },
  { id: '2', name: 'John Doe', email: 'john.doe@hospital.com', role: 'admin' },
  { id: '3', name: 'Alice Johnson', email: 'alice.j@hospital.com', role: 'manager' },
];

export default function RoleManager() {
  const { user: currentUser, updateRole } = useAuth();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    // If the admin changes their own role, update global auth state
    if (currentUser?.id === userId) {
      updateRole(newRole);
    }

    toast.success(`Role updated to ${newRole} successfully`);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={user.role}
                      onValueChange={(value: Role) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[140px] ml-auto">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}