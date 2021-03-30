import React, { Component } from 'react';
import './PopUpWapper.css';

class PopUpWapper extends Component {
    state = { isOpen: false }
    InnerComponent = <></>
    InnerComponentProps = {};

    PopUp(Component, props = {}) {
        this.InnerComponent = Component;
        this.InnerComponentProps = props;
        this.setState({ isOpen: true });
    }
    
    PopUpClose() {
        this.setState({ isOpen: false });
    }

    render() {
        const { children } = this.props;
        const { isOpen } = this.state;
        const { InnerComponent, InnerComponentProps } = this;
        return (
            <div className="PopUpWapper">
                {children}
                <div className={`PopUpBg ${isOpen ? 'isOpen' : ''}`}>
                    { isOpen && <InnerComponent {...InnerComponentProps} PopUpClose={() => this.PopUpClose()} />}
                </div>
            </div>
        );
    }
}
 
export default PopUpWapper;
