import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Room from './components/Room';
import RoomCreate from './components/RoomCreate';
import RoomEdit from './components/RoomEdit';
import Login from './components/Login';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/:slug' component={Room} />
            <Route exact path='/room/create' component={RoomCreate} />
            <Route exact path='/room/edit/:id' component={RoomEdit} />
            <Route exact path='/auth/login' component={Login} />
            <Route><h1>404</h1></Route>
        </Switch>
    </Layout>
);
