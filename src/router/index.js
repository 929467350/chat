import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Login, Error } from '../utils/Components';

class Root extends React.Component {
    render () {
        return (
            <Router >
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/home/:nickname" component={Home} />
                    <Route path="*" component={Error} />
                </Switch>
            </Router>
        )
    }
}
export default Root;