import React from 'react';
import { Parameters } from "@storybook/react"
import toast, { Toast } from '../../components'

export default {
    title: 'Toast',
    component: Toast,
};

const DateTemplate: Parameters = (args) => {
    
    const handle = () => {
        toast(args)
    }

    return (
        <button className="btn btn-primary" onClick={handle}>toast</button>
    )
};

export const DefaultDate = DateTemplate.bind({});

DefaultDate.args = {
    body: "Successfully show toaster"
}