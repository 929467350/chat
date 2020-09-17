import React from 'react';
import { Form, Input, Button } from 'antd';

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};
class Login extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }
    shouldComponentUpdate ( nextProps, nextState ) {
        return false;
    }   
    componentWillUnmount () {
        this.setState = () => {
            return;
        }
    }
    onFinish ( values ) {
        this.props.history.push( `/home/${ values.nickname }` );
    }

    render () {
        return (
            <div className='login'>
                <Form
                    {...formItemLayout}
                    name="login"
                    onFinish={this.onFinish.bind( this )}
                >
                    <Form.Item
                        label="昵称"
                        name="nickname"
                        rules={[{ required: true, message: '请输入昵称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item className='submit'>
                        <Button type="primary" htmlType="submit"> 进入聊天室</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Login;