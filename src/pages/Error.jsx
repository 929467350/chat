import React from 'react';
import { Result, Button } from 'antd';
class Error extends React.Component {
    
    onClick(){
        this.props.history.push( '/' );
    }
    render () {
        return (
            <div className='response-404'>
                <Result
                status="404"
                title="404"
                subTitle="抱歉，您访问的页面不存在。"
                extra={<Button type="primary" onClick={this.onClick.bind(this)}>返回首页</Button>}
            />
            </div>
        );
    }
}
export default Error;