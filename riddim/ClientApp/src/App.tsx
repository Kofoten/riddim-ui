import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Room from './components/Room';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/:slug' component={Room} />
            <p>AAAAAAAAAAARGGGGH</p>
        </Switch>
    </Layout>
);
