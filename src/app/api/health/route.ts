import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Basic health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV,
      deployment: {
        vercel: {
          url: process.env.VERCEL_URL,
          region: process.env.VERCEL_REGION,
          deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
        }
      },
      config: {
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        defaultChainId: process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID,
        hasThirdwebClientId: !!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        hasContractAddress: !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      },
      checks: {
        environmentVariables: {
          required: {
            thirdwebClientId: !!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
            contractAddress: !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          },
          optional: {
            appName: !!process.env.NEXT_PUBLIC_APP_NAME,
            defaultChainId: !!process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID,
          }
        }
      }
    };

    // Check if critical environment variables are missing
    const missingRequired = Object.entries(healthData.checks.environmentVariables.required)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingRequired.length > 0) {
      return NextResponse.json({
        ...healthData,
        status: 'unhealthy',
        warnings: [`Missing required environment variables: ${missingRequired.join(', ')}`]
      }, { status: 503 });
    }

    return NextResponse.json(healthData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function HEAD(request: NextRequest) {
  // Simple HEAD request for uptime monitoring
  return new NextResponse(null, { status: 200 });
}
