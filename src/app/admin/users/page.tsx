
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Edit3, ShieldBan, UserPlus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const mockUsers = [
  { id: 'usr_1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'Customer', status: 'Active', joinedDate: '2023-01-15' },
  { id: 'usr_2', name: 'Bob The Builder', email: 'bob@example.com', role: 'Seller', status: 'Active', joinedDate: '2023-02-20' },
  { id: 'usr_3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Customer', status: 'Suspended', joinedDate: '2023-03-10' },
  { id: 'usr_4', name: 'Diana Prince', email: 'diana@example.com', role: 'Seller', status: 'Pending Approval', joinedDate: '2023-04-05' },
];

export default function AdminUsersPage() {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && (!currentUser || currentUser.role !== 'admin')) {
      router.push('/login?redirect=/admin/users');
    }
  }, [currentUser, authIsLoading, router]);

  if (authIsLoading || !currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" /> User Management
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input type="search" placeholder="Search users..." className="pl-8 w-full sm:w-[250px]" />
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled> {/* TODO: Implement Add User Modal */}
                <UserPlus className="mr-2 h-5 w-5" /> Add User
            </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">User Accounts</CardTitle>
          <CardDescription>View and manage all user accounts on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Seller' ? 'secondary' : 'outline'} className="capitalize">
                        {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : (user.status === 'Suspended' ? 'destructive' : 'outline')}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled> {/* TODO: Implement Edit User */}
                      <Edit3 className="h-4 w-4" />
                      <span className="sr-only">Edit User</span>
                    </Button>
                    <Button variant={user.status === 'Suspended' ? 'default' : 'destructive'} size="icon" className="h-8 w-8" disabled> {/* TODO: Implement Suspend/Unsuspend User */}
                      <ShieldBan className="h-4 w-4" />
                      <span className="sr-only">{user.status === 'Suspended' ? 'Unsuspend User' : 'Suspend User'}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mockUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No users found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
