import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Room from './components/Room';
import RoomCreate from './components/RoomCreate';
import RoomEdit from './components/RoomEdit';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/:slug' component={Room} />
            <Route path='/room/create' componenet={RoomCreate} />
            <Route path='/room/edit/:id' componenet={RoomEdit} />
        </Switch>
    </Layout>
);
