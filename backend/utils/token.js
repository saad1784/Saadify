export default (user,statusCode,res)=>{
    const token=user.getJwtToken();

console.log(token);
    const options={
        expires:new Date(  
                      Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000
        ),
        httpOnly:true,
        //secure: false, // false for localhost
    //sameSite: "lax",
    };
    res.status(statusCode).cookie("token",token,options).json({
         success: true,
        token,
    });
}