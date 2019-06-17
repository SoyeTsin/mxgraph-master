import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/AppCanvas'

// const appReport = () => import('@/views/appReport')


Vue.use(Router)

export default new Router({
    routes: [

        {
            meta: {des: '首页'},
            path: '/',
            name: 'index',
            component: index,
            children: [
                // {
                //     meta: {des: '机构管理'},
                //     path: '/boxList',
                //     name: 'boxList',
                //     component: boxList
                // }
            ], //redirect: '/login'//默认显示此子路由
        }
    ]
})
