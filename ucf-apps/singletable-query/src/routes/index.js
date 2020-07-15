/**
 * 前端路由说明：
 * 1、基于浏览器 History 的前端 Hash 路由
 * 2、按业务模块和具体页面功能划分了一级路由和二级路由
 */
import React from "react";
import mirror, { connect,Route } from 'mirrorx';

// 组件引入
import Query from './query/components/IndexView';
import Employee from './employee/components/IndexView';

// 数据模型引入
import model from './model'

mirror.model(model);

// 数据和组件UI关联、绑定
const QueryContainer = connect(state => state.query,null)(Query);
const EmployeeContainer = connect(state => state.query,null)(Employee);


export default () => (
    <div className="route-content">
        <Route exact path="/" component={QueryContainer}/>
        <Route exact path="/employee" component={EmployeeContainer}/>
    </div>

)

