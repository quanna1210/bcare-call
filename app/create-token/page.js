'use server'
import {createToken} from '@/helpers/jwt'
export default async function Page({params,searchParams}){
    const {userId} = await searchParams
    const apiKey = 'pnwf8hccjv6n'
    const secretKey = 'bwt22s6xuae8r5a6d27egphbqws75mx7mkv7usdpf6asrpveb5x7ttxkvpee6v4u'
    const token = createToken(
        userId,
        apiKey,
        secretKey,
        {}
    )
    return <div id="token">{token}</div>
}