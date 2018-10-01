import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import App from './App'

const history = createHistory();

const Root = () => (
    <Router history={history}>
        <Switch>
            <Route path="/" component={App}/>
        </Switch>
    </Router>
)


ReactDOM.render(<Root/>, document.getElementById('root'));