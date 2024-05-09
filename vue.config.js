module.exports={
    lintOnSave:false,//关闭语法检查
    publicPath: process.env.NODE_ENV === 'development' ? '/' : process.env.VUE_APP_PROD_URL,
    devServer:{port : 8081}
}