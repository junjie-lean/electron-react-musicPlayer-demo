/*
 * @Author: junjie.lean 
 * @Date: 2020-07-01 11:15:45 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-07-01 11:25:53
 */


import React from 'react'
import { withRouter } from 'react-router-dom'

const { ipcRender } = window.require('electron')

export default withRouter(() => {
    useEffect(() => {
        console.log(sessionStorage)
    }, [])
    return (<div>
        add music
    </div>)
})