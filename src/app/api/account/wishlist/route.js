import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest, isSameOrigin } from "@/lib/auth";
import { z } from "zod";
const schema=z.object({productId:z.string().cuid()}).strict();
export async function GET(request){const user=await getUserFromRequest(request);if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});const items=await db.wishlistItem.findMany({where:{userId:user.id},include:{product:{include:{images:true,category:true}}},orderBy:{createdAt:"desc"}});return NextResponse.json({items:items.map(i=>i.product)})}
export async function POST(request){if(!isSameOrigin(request))return NextResponse.json({error:"Invalid origin"},{status:403});const user=await getUserFromRequest(request);if(!user)return NextResponse.json({error:"Sign in to save items"},{status:401});const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid product"},{status:422});const where={userId_productId:{userId:user.id,productId:parsed.data.productId}};const existing=await db.wishlistItem.findUnique({where});if(existing){await db.wishlistItem.delete({where});return NextResponse.json({liked:false})}await db.wishlistItem.create({data:{userId:user.id,productId:parsed.data.productId}});return NextResponse.json({liked:true})}
