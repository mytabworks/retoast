import React, { useEffect } from 'react'
import classNames from 'classnames'
import createDimension, { useDimension } from 'dymension'

interface ToastProps {
    key?: string;
    body: React.ReactNode;
    className?: string;
    classEnter?: string;
    classExit?: string;
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
    placement?: 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    duration?: number;
    delay?: number;
    dismissible?: boolean;
    dismissIcon?: React.ReactNode;
    onMount?: () => void;
    onUnmount?: () => void;
    onDismissed?: () => void;
}

export const Toast: React.FunctionComponent<ToastProps> = ({ 
    body,
    className,
    classEnter,
    classExit,
    variant,
    duration,
    dismissible,
    dismissIcon,
    onMount,
    onUnmount,
    onDismissed
}) => {
    const {
        show,
        resolve,
    } = useDimension()
    //@ts-ignore
    useEffect(() => {
        if(duration! > 0 && show) {

            const cleanup = setTimeout(() => {

                resolve(true)

            }, duration)

            return () => clearTimeout(cleanup)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration, show])

    useEffect(() => {

        onMount && onMount()

        return () => onUnmount && onUnmount()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onUnmount])

    return (
        <div className={classNames('retoast', { [classEnter!]: show, [classExit!]: !show }, variant && `retoast-${variant}`, className)}>
            <div className="retoast-container">
                <div className="retoast-content">
                    {body}
                    {dismissible && (
                        <button 
                            className="retoast-content-close" 
                            onClick={() => {
                                resolve(true)
                                onDismissed && onDismissed()
                            }}>
                            {dismissIcon || <>&times;</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

Toast.defaultProps = {
    dismissible: false,
    duration: 6000,
    classEnter: 'fade-retoast-in',
    classExit: 'fade-retoast-out'
}

const createNode = (parent?: any) => {
    if(typeof document !== "undefined") {
        return (parent || document.body).appendChild(document.createElement('div'))
    }
}

const toastContainer = createNode()

const setNodePosition = (position: string) => {

    const node = createNode(toastContainer)

    node.id = `retoast-${position}`

    return node
}

const container = ['top', 'bottom'].reduce((result, primePosition) => {

    if(primePosition === 'top') {

        result[primePosition] = setNodePosition(primePosition)

    }

    return ['left', 'right'].reduce((result, position) => {

        const nodeProsition = `${primePosition}-${position}`

        result[nodeProsition] = setNodePosition(nodeProsition)

        return result

    }, result)

}, {})

export default createDimension(Toast, {
    delay: ({ delay = 600 }) => delay,
    containerNode: ({ placement = 'top-right'}) => container[placement],
    manipulateWrapperNode: (wrapperNode, props) => {

        if(props.key && typeof document !== "undefined") {
            const existNode = document.getElementById(props.key)

            if(existNode) {

                wrapperNode = existNode

            } else {

                wrapperNode.id = props.key

            }
        }

        wrapperNode.className = 'retoast-wrapper'

        return wrapperNode
    }
})