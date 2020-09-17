const port = 3001;
const app = require( 'express' )();
const http = require( "http" ).createServer( app );
const io = require( "socket.io" )( http, {
    pingTimeout: 60000,

} );
const login = [];

io.on( "connection", socket => {
    const getIndex = () => {
        return login.findIndex( item => {
            return item.id === socket.id;
        } );
    }

    // 监听用户登录
    socket.on( 'login', data => {
        login.push( { id: socket.id, ...data } );
        socket.emit( 'logined', { 'msg': '登录成功' } );
        io.emit( 'new user', { ...data, logined: true, total: login.length } );
    } );

    // 监听新的聊天
    socket.on( 'new message', data => {
        const newData = { ...login[getIndex()], ...data };
        socket.emit( 'new message', newData );
        socket.broadcast.emit( 'new message', newData );
    } );

    // 断开链接
    socket.on( 'disconnect', data => {
        if ( login.length > 0 ) {
            const index = getIndex();
            io.emit( 'disconnect', { nickname: login[index].nickname, logout: true, total: login.length - 1 } );
            login.splice( index, 1 );
        }
    } );


} );

http.listen( port );    
