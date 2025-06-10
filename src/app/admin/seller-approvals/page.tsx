
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserCheck, CheckCircle2, XCircle, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const mockSellerRequests = [
  { id: 'req_1', userName: 'Diana Prince', userEmail: 'diana@example.com', requestDate: '2023-04-05', reason: 'Wants to sell handmade jewelry.', status: 'Pending' },
  { id: 'req_2', userName: 'Clark Kent', userEmail: 'clark@example.com', requestDate: '2023-04-10', reason: 'Looking to sell vintage collectibles.', status: 'Pending' },
  { id: 'req_3', userName: 'Bruce Wayne', userEmail: 'bruce@example.com', requestDate: '2023-03-20', reason: 'Tech gadgets and accessories.', status: 'Approved' },
];

export default function AdminSellerApprovalsPage() {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && (!currentUser || currentUser.role !== 'admin')) {
      router.push('/login?redirect=/admin/seller-approvals');
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
      <h1 className="text-3xl font-headline font-bold flex items-center">
        <UserCheck className="mr-3 h-8 w-8 text-primary" /> Seller Account Approvals
      </h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Pending Seller Requests</CardTitle>
          <CardDescription>Review and approve or deny requests from users wishing to become sellers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Reason (Brief)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSellerRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.userName}</TableCell>
                  <TableCell>{request.userEmail}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                  <TableCell>
                    <Badge variant={request.status === 'Pending' ? 'secondary' : (request.status === 'Approved' ? 'default' : 'destructive')}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {request.status === 'Pending' && (
                      <>
                        <Button variant="outline" size="sm" className="h-8" disabled> {/* TODO: Implement View Details */}
                          <Eye className="mr-1 h-4 w-4" /> View Details
                        </Button>
                        <Button variant="default" size="sm" className="h-8 bg-green-600 hover:bg-green-700" disabled> {/* TODO: Implement Approve */}
                          <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button variant="destructive" size="sm" className="h-8" disabled> {/* TODO: Implement Deny */}
                          <XCircle className="mr-1 h-4 w-4" /> Deny
                        </Button>
                      </>
                    )}
                    {request.status !== 'Pending' && (
                       <Button variant="outline" size="sm" className="h-8" disabled>
                          Action Taken
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mockSellerRequests.filter(r => r.status === 'Pending').length === 0 && (
            <p className="text-center text-muted-foreground py-8">No pending seller requests.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
