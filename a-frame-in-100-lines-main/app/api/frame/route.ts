import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { AppConfig } from '../../config';
import { sql } from "@vercel/postgres";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { rows } = await sql`SELECT * FROM myboook`;
  let name = "";
  rows.forEach(element => {
    name = element.name;
  });

  let accountAddress: string | undefined = '';
  let following: boolean | undefined = false;
  let liked: boolean | undefined = false;
  let recasted: boolean | undefined = false;
  // let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];

  }
  following = message?.following;
  liked = message?.liked;
  recasted = message?.recasted;
  let label:string = "";
  // if(following && liked && recasted){
  if(true){
    label = "Thanks!" + name;
  }else{
    label = "Register!"
  }

  // if (message?.input) {
  //   text = message.input;
  // }

  // if (message?.button === 3) {
  //   return NextResponse.redirect(
  //     'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
  //     { status: 302 },
  //   );
  // }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: label,
        },
        {
          action: 'link',
          label: 'Follow @Kosk',
          target: 'https://warpcast.com/kosk',
        },
      ],
      image: {
        src: `${AppConfig.NEXT_PUBLIC_URL}/park-1.png`,
      },
      postUrl: `${AppConfig.NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
