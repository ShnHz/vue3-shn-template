/*
 * @Author: sanghangning 
 * @Date: 2019-12-11 10:48:06 
 * @Last Modified by: sanghangning
 * @Last Modified time: 2021-08-13 17:59:05
 */

import Empty from '@/components/common/Empty.vue'

const components = {
    'Empty': Empty
}

export function loadAllComponents(app) {
    for (let key in components) {
        app.component(key, components[key]);
    }
}