import React from 'react';
import { message, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
let socket = void 0;
const emoji = [];
message.config( { duration: 1, } );
const io = require( 'socket.io-client' );
for ( let index = 1; index <= 75; index++ ) {
    emoji.push( index );
}
class Home extends React.Component {
    state = {
        data: [],
        total: 0,
        nickname: '',
        select: false
    }

    constructor() {
        super();
        this.input = React.createRef();
        this.container = React.createRef();
    }
    componentDidMount () {
        const { params } = this.props.match;
        if ( params.hasOwnProperty( 'nickname' ) ) {
            this.setState( {
                nickname: params.nickname
            } );
            this.connect();
        }
    }
    componentWillUnmount () {
        this.setState = () => {
            return;
        }
    }
    shouldComponentUpdate ( nextProps, nextState ) {
        if (
            this.state.total !== nextState.total ||
            this.state.select !== nextState.select ||
            this.state.nickname !== nextState.nickname ||
            this.state.data.length !== nextState.data.length
        ) {
            return true;
        }
        return false;
    }
    connect () {
        socket = io( '127.0.0.1:3001' );
        socket.on( 'connect', () => {
            const { nickname } = this.state;
            // 发送用户登录
            this.emit( 'login', { nickname } );
            // 监听当前客户端进入
            socket.on( 'logined', (data) => {
                message.success( `欢迎您加入聊天室` )
                this.setState( { total: data.total } )
            } );

            // 监听新的聊天|新的用户登录|用户退出
            ['new message', 'new user', 'disconnect'].forEach( item => {
                socket.on( item, data => {
                    if ( data.hasOwnProperty( 'nickname' ) ) {
                        if ( item === 'new user' || item === 'disconnect' ) {
                            this.setState( { total: data.total } )
                        }
                        this.setState( { data: [...this.state.data, data], } );
                        this.resetTop();
                    }
                } );
            } );

        } );


    }

    emit ( type, data ) {
        if ( socket.connected ) {
            socket.emit( type, data );
        }
    }

    resetTop () {
        const container = this.container.current;
        container.scrollTop = container.scrollHeight;
    }
    resetLeft () {
        const input = this.input.current;
        input.scrollLeft = input.scrollWidth;
    }

    onClick () {
        this.sendMessage();
    }


    sendMessage () {
        let input = this.input.current.innerHTML;
        input = input.replace( /<\/?((?!img).)*?\/?>/g, '' );
        if ( input.trim() === '' ) {
            return message.warning( '发送内容不得为空' );
        }
        this.emit( 'new message', { data: input } );
        this.input.current.innerText = '';
        this.setState( {
            select: false
        } );
    }

    onKeyup ( e ) {
        if ( e.keyCode === 13 ) {
            this.sendMessage();
        }
    }

    onOpen () {
        const { select } = this.state;
        this.setState( {
            select: !select
        } );
    }

    onSelect ( item ) {
        let img = new Image();
        img.src = require( `../images/${ item }.gif` );
        img.onload = () => {
            this.input.current.appendChild( img );
            this.resetLeft();
        }
    }


    render () {
        const { data, select, total } = this.state;
        return (
            <>
                <main>
                    <header>在线 ({total}) 人</header>
                    <section>
                        <div ref={this.container}>
                            {data.map( ( item, index ) => (
                                <div className={item.logined ? 'logined' : item.logout ? 'logout' : 'message'} key={index} id={item.id}>
                                    <p>{item.logined ? item.nickname + '加入聊天室' : item.logout ? item.nickname + '离开聊天室' : item.nickname + ':'}</p>
                                    <span dangerouslySetInnerHTML={{ __html: item.data }}></span>
                                </div>
                            ) )}
                        </div>
                    </section>
                    <footer>
                        <div ref={this.input} onKeyUp={this.onKeyup.bind( this )} contentEditable></div>
                        <p className='emoji' onClick={this.onOpen.bind( this )}><SmileOutlined /></p>
                        <Button onClick={this.onClick.bind( this )} type="primary">发送</Button>
                    </footer>
                    {select && <div className='emoji-content'>
                        <ul>
                            {Array.from( Array( 75 ), ( v, k ) => k ).map( item => (
                                item > 0 && <li onClick={this.onSelect.bind( this, item )} key={item}><img src={require( `../images/${ item }.gif` )} alt="" /></li>
                            ) )}
                        </ul>
                    </div>}
                </main>
            </>
        );
    }
}

export default Home;
