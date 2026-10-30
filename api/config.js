// Vercel serverless function: sends the PUBLIC Supabase values (from Vercel Environment Variables) to the browser.
module.exports=(req,res)=>{res.setHeader('Cache-Control','no-store');res.status(200).json({url:process.env.SUPABASE_URL||'',key:process.env.SUPABASE_ANON_KEY||''})};
