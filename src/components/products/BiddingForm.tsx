
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Product, Bid } from '@/lib/types';
// import { formatDistanceToNowStrict } from 'date-fns'; // No longer needed for this specific formatting
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface BiddingFormProps {
  product: Product;
  onBidPlaced: (newBidAmount: number) => void; // Callback to update parent state
}

export function BiddingForm({ product, onBidPlaced }: BiddingFormProps) {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [auctionOutcomeNotified, setAuctionOutcomeNotified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!product.auctionEndDate) {
      setTimeLeft('Auction date not set');
      setIsAuctionEnded(true); // Consider it ended if no date
      return;
    }

    const auctionEnd = new Date(product.auctionEndDate);
    let intervalId: NodeJS.Timeout | undefined;

    const updateTimer = () => {
      const now = new Date();
      const totalSecondsRemaining = Math.max(0, Math.floor((auctionEnd.getTime() - now.getTime()) / 1000));

      if (totalSecondsRemaining === 0) {
        setTimeLeft('Auction Ended');
        setIsAuctionEnded(true);
        if (intervalId) clearInterval(intervalId);
      } else {
        const days = Math.floor(totalSecondsRemaining / (3600 * 24));
        const hours = Math.floor((totalSecondsRemaining % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
        const seconds = totalSecondsRemaining % 60;

        let formattedTime = '';
        if (days > 0) {
          formattedTime += `${days}d `;
        }
        formattedTime += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        setTimeLeft(formattedTime);
        setIsAuctionEnded(false);
      }
    };

    updateTimer(); // Initial call
    intervalId = setInterval(updateTimer, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [product.auctionEndDate]);

  useEffect(() => {
    if (isAuctionEnded && !auctionOutcomeNotified) {
      let userWon = false;
      if (product.bids && product.bids.length > 0) {
        const winningBid = product.bids.find(b => b.amount === product.currentBid);
        if (winningBid && winningBid.userId === 'currentUser') {
          userWon = true;
        }
      }

      if (userWon) {
        toast({
          title: "Auction Won!",
          description: `Congratulations! You won ${product.name} with a bid of $${product.currentBid?.toFixed(2)}.`,
          action: (
            <Button variant="link" asChild>
              <Link href={`/checkout/${product.id}`}>Proceed to Checkout</Link>
            </Button>
          ),
          duration: 10000, 
        });
      } else {
        toast({
          title: "Auction Ended",
          description: `The auction for ${product.name} has ended. ${product.currentBid && product.bids && product.bids.length > 0 ? `The winning bid was $${product.currentBid.toFixed(2)}.` : 'There were no winning bids.'} You did not win this time.`,
        });
      }
      setAuctionOutcomeNotified(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuctionEnded, product, toast, auctionOutcomeNotified]);


  const currentHighBid = product.currentBid || product.price;
  const minimumBid = currentHighBid + 1; // Simple increment

  const handleSubmitBid = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numericBidAmount = parseFloat(bidAmount);

    if (isAuctionEnded) {
      toast({ title: 'Auction Ended', description: 'This auction has already ended.', variant: 'destructive' });
      return;
    }

    if (isNaN(numericBidAmount)) {
      toast({ title: 'Invalid Bid', description: 'Please enter a valid number.', variant: 'destructive' });
      return;
    }

    if (numericBidAmount < minimumBid) {
      toast({
        title: 'Bid Too Low',
        description: `Your bid must be at least $${minimumBid.toFixed(2)}.`,
        variant: 'destructive',
      });
      return;
    }
    
    onBidPlaced(numericBidAmount);
    toast({ title: 'Bid Placed!', description: `Your bid of $${numericBidAmount.toFixed(2)} has been submitted for ${product.name}.` });
    setBidAmount(''); 
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Place Your Bid</CardTitle>
        <CardDescription>
          {isAuctionEnded && auctionOutcomeNotified 
            ? `This auction ended. ${product.bids?.find(b=>b.amount === product.currentBid)?.userId === 'currentUser' ? 'You won!' : 'You did not win.'}` 
            : (isAuctionEnded ? 'This auction has ended.' : `Time Left: ${timeLeft}`)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Highest Bid:</p>
          <p className="text-3xl font-bold text-primary">${currentHighBid.toFixed(2)}</p>
        </div>
        
        {product.bids && product.bids.length > 0 && (
          <div className="max-h-32 overflow-y-auto border p-2 rounded-md space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground">Recent Bids:</h4>
            {product.bids.slice(0,3).map(bid => ( 
              <div key={bid.id} className="text-xs flex justify-between">
                <span>{bid.userName}</span>
                <span className="font-medium">${bid.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {!isAuctionEnded ? (
          <form onSubmit={handleSubmitBid} className="space-y-4">
            <div>
              <Label htmlFor="bidAmount" className="block text-sm font-medium text-muted-foreground">
                Your Bid Amount (Min. ${minimumBid.toFixed(2)})
              </Label>
              <Input
                id="bidAmount"
                type="number"
                step="0.01"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Enter $${minimumBid.toFixed(2)} or more`}
                className="mt-1 text-lg"
                min={minimumBid.toString()} 
                required
              />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3">
              Place Bid
            </Button>
          </form>
        ) : (
           <Button className="w-full" variant="outline" disabled>Auction Ended</Button>
        )}
         <Button variant="link" asChild className="w-full mt-2">
            <Link href="/my-account">View My Bids</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

