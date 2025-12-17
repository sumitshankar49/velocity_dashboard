'use client';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useOrganization } from '@clerk/nextjs';
import { PricingTable } from '@clerk/nextjs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BillingPage() {
  const { organization, isLoaded } = useOrganization();
  const [isBillingEnabled, setIsBillingEnabled] = useState(true);

  useEffect(() => {
    // Check if billing is enabled by checking environment or catching errors
    const checkBilling = () => {
      // In development, you can check if NEXT_PUBLIC_CLERK_BILLING_ENABLED is set
      const billingEnabled =
        process.env.NEXT_PUBLIC_CLERK_BILLING_ENABLED !== 'false';
      setIsBillingEnabled(billingEnabled);
    };
    checkBilling();
  }, []);

  return (
    <PageContainer
      isloading={!isLoaded}
      access={!!organization}
      accessFallback={
        <div className='flex min-h-100 items-center justify-center'>
          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-semibold'>No Organization Selected</h2>
            <p className='text-muted-foreground'>
              Please select or create an organization to view billing
              information.
            </p>
          </div>
        </div>
      }
    >
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Billing & Plans</h1>
          <p className='text-muted-foreground'>
            Manage your subscription and usage limits for {organization?.name}
          </p>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className='h-4 w-4' />
          <AlertDescription>
            Plans and subscriptions are managed through Clerk Billing. Subscribe
            to a plan to unlock features and higher limits.
          </AlertDescription>
        </Alert>

        {/* Billing Disabled Warning */}
        {!isBillingEnabled && (
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              <strong>Billing is currently disabled.</strong> To enable billing
              and use the PricingTable component, visit{' '}
              <a
                href='https://dashboard.clerk.com/last-active?path=billing/settings'
                target='_blank'
                rel='noopener noreferrer'
                className='underline'
              >
                Clerk Dashboard Billing Settings
              </a>{' '}
              and follow the setup instructions.
            </AlertDescription>
          </Alert>
        )}

        {/* Clerk Pricing Table */}
        {isBillingEnabled ? (
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Choose a plan that fits your organization's needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='mx-auto max-w-4xl'>
                <PricingTable for='organization' />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Billing must be enabled to view plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-muted-foreground py-8 text-center'>
                <p className='mb-4'>
                  Billing features are not available at this time.
                </p>
                <p className='text-sm'>
                  Please enable billing in your Clerk dashboard to view and
                  manage subscription plans.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
